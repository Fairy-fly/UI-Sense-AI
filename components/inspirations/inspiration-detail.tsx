import type { Inspiration } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TagPill } from "@/components/inspirations/tag-pill";
import { RatingDisplay } from "@/components/inspirations/rating-display";
import { cn, getHostname } from "@/lib/utils";
import { displayProjectType } from "@/lib/display-labels";

interface InspirationDetailProps {
  inspiration: Inspiration;
  className?: string;
}

function getColorClass(tagColor: string | null): string {
  if (!tagColor) return "bg-muted-foreground/30";
  const map: Record<string, string> = {
    neutral: "bg-stone-400",
    zinc: "bg-zinc-400",
    slate: "bg-slate-400",
    stone: "bg-stone-500",
    violet: "bg-violet-400",
    indigo: "bg-indigo-400",
    amber: "bg-amber-400",
  };
  return map[tagColor] ?? "bg-muted-foreground/30";
}

export function InspirationDetail({ inspiration, className }: InspirationDetailProps) {
  const { tags, rating, projectType, sourceUrl, notes, createdAt, analysis } = inspiration;

  const uniqueColors = [...new Set((tags ?? []).map((t) => t.color).filter(Boolean))];

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Meta info card */}
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">评分</span>
            <RatingDisplay rating={rating} size="md" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">项目类型</span>
            <Badge variant="secondary" className="text-[11px]">{projectType ? displayProjectType(projectType) : "—"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">来源</span>
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-foreground underline-offset-2 hover:underline"
              >
                {getHostname(sourceUrl) ?? sourceUrl}
              </a>
            ) : (
              <span className="text-[13px] text-muted-foreground">—</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">标签</span>
            <div className="flex flex-wrap justify-end gap-1">
              {(tags ?? []).slice(0, 4).map((tag) => (
                <TagPill key={tag.id} tag={tag} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">颜色</span>
            <div className="flex items-center gap-1.5">
              {uniqueColors.map((color) => (
                <span
                  key={color}
                  className={cn("inline-block h-3 w-3 rounded-full ring-1 ring-border", getColorClass(color ?? null))}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">收藏时间</span>
            <span className="text-[13px] text-foreground">
              {createdAt.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Analysis cards */}
      {analysis && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[13px] font-medium">色彩系统</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                {analysis.colorAnalysis}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[13px] font-medium">布局模式</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                {analysis.layoutAnalysis}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[13px] font-medium">组件语言</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                {analysis.componentAnalysis}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-[13px] font-medium">风格总结</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                {analysis.styleSummary}
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Notes */}
      {notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[13px] font-medium">个人备注</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Design Keywords */}
      {analysis?.designKeywords && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[13px] font-medium">设计关键词</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {analysis.designKeywords.split(", ").map((kw) => (
                <Badge key={kw} variant="secondary" className="text-[11px]">{kw}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
