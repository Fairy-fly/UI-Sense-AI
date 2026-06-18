import Link from "next/link";
import { Images, Tag, Wand2, TrendingUp, Sparkles } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentInspirations } from "@/components/dashboard/recent-inspirations";
import { StyleOverview } from "@/components/dashboard/style-overview";
import { SectionCard } from "@/components/common/section-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDashboardStats, getRecentInspirations } from "@/lib/actions/inspirations";
import { getPopularTags } from "@/lib/actions/tags";
import { getRecentPromptRecords } from "@/lib/actions/prompts";
import { getUserPreference } from "@/lib/actions/preferences";
import { defaultStyleTags } from "@/lib/constants";
import { displayStyleTag, displayLabelInText } from "@/lib/display-labels";

export default async function DashboardPage() {
  const [stats, recentInspirations, tags, promptRecords, preference] = await Promise.all([
    getDashboardStats(),
    getRecentInspirations(4),
    getPopularTags(),
    getRecentPromptRecords(5),
    getUserPreference(),
  ]);

  const prefStyles = preference?.preferredStyles
    ? safeJsonParse(preference.preferredStyles)
    : ["Minimal SaaS", "Soft Dashboard", "Dense but Clean"];
  const disStyles = preference?.dislikedStyles
    ? safeJsonParse(preference.dislikedStyles)
    : ["廉价蓝白后台", "过度渐变"];
  const prefColors = preference?.preferredColors
    ? safeJsonParse(preference.preferredColors)
    : ["Slate", "Neutral", "Zinc"];
  const prefLayouts = preference?.preferredLayouts
    ? safeJsonParse(preference.preferredLayouts)
    : ["Sidebar + Content", "Card Grid"];

  return (
    <>
      <PageHeading
        title="总览"
        description="追踪你的 UI 灵感库、审美信号和最近的 Prompt 活动。"
      />

      {/* Welcome bar */}
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-foreground">欢迎回来</p>
          {preference?.aestheticSummary ? (
            <p className="text-[12px] text-muted-foreground">
              {displayLabelInText(preference.aestheticSummary)}
            </p>
          ) : (
            <p className="text-[12px] text-muted-foreground">
              已收藏 {stats.totalInspirations} 个灵感，{stats.highRatedCount} 个高评分参考。继续收藏后可生成审美记忆。
            </p>
          )}
        </div>
        <Link
          href="/inspirations/new"
          className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-1 shrink-0")}
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span className="inline-flex items-center leading-none">新建灵感</span>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="灵感总数" value={stats.totalInspirations} icon={Images} description="已收藏的 UI 参考" />
        <StatCard title="高分 UI" value={stats.highRatedCount} icon={TrendingUp} description="评分 4+ " />
        <StatCard title="风格标签" value={stats.tagCount} icon={Tag} description="已使用标签种类" />
        <StatCard title="生成 Prompt" value={stats.promptCount} icon={Wand2} description="已创建的 Prompt" />
      </div>

      {/* Main grid: left wide, right narrow */}
      <div className="mb-8 grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentInspirations inspirations={recentInspirations} />
        </div>

        <div className="flex flex-col gap-4">
          {/* Recent Prompt Records */}
          <SectionCard
            title="最近 Prompt 记录"
            description="最近生成的 Prompt。"
            action={
              <Link href="/prompts" className="text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                查看全部 →
              </Link>
            }
          >
            {promptRecords.length > 0 ? (
              <div className="space-y-1.5">
                {promptRecords.map((rec) => (
                  <Link
                    key={rec.id}
                    href={`/prompts/${rec.id}`}
                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-[12px] transition-colors hover:bg-muted/50"
                  >
                    <span className="truncate font-medium text-foreground">{rec.title}</span>
                    <span className="ml-2 shrink-0 text-muted-foreground">
                      {rec.createdAt.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-[12px] text-muted-foreground">还没有生成 Prompt。</p>
            )}
          </SectionCard>

          {/* Style Tags */}
          <SectionCard title="风格标签" description="最常用的风格标签。">
            <div className="flex flex-wrap gap-1.5">
              {(tags.length > 0
                ? tags.slice(0, 10).map((t) => t.name)
                : (defaultStyleTags as readonly string[])
              ).map((tag, i) => (
                <Badge key={typeof tag === "string" ? tag : tag} variant={i < 5 ? "secondary" : "outline"} className="text-[11px]">
                  {displayStyleTag(typeof tag === "string" ? tag : tag)}
                </Badge>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Bottom: Style Overview */}
      <StyleOverview
        preferredStyles={prefStyles}
        dislikedStyles={disStyles}
        preferredColors={prefColors}
        preferredLayouts={prefLayouts}
      />
    </>
  );
}

function safeJsonParse(str: string): string[] {
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}
