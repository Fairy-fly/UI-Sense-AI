import Link from "next/link";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { InspirationGrid } from "@/components/inspirations/inspiration-grid";
import { EmptyState } from "@/components/common/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getInspirations } from "@/lib/actions/inspirations";
import { projectTypes, defaultStyleTags } from "@/lib/constants";

export default async function InspirationsPage() {
  const inspirations = await getInspirations();

  return (
    <>
      <PageHeading
        title="UI 灵感库"
        description="收藏和整理符合你个人审美的 UI 参考。"
        action={
          <Link
            href="/inspirations/new"
            className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-1")}
          >
            <Plus className="h-3.5 w-3.5 shrink-0" />
            <span className="inline-flex items-center leading-none">上传灵感</span>
          </Link>
        }
      />

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
        <div className="relative flex-1" style={{ minWidth: "200px" }}>
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索 UI 灵感..."
            className="h-8 rounded-[10px] border-0 bg-muted/50 pl-9 text-[13px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="h-8 w-[140px] rounded-[10px] text-[12px]">
              <SelectValue placeholder="项目类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              {projectTypes.map((t) => (
                <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-8 w-[120px] rounded-[10px] text-[12px]">
              <SelectValue placeholder="风格" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部风格</SelectItem>
              {(defaultStyleTags as readonly string[]).slice(0, 8).map((t) => (
                <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="h-8 w-[120px] rounded-[10px] text-[12px]">
              <SelectValue placeholder="排序" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">最新收藏</SelectItem>
              <SelectItem value="oldest">最早收藏</SelectItem>
              <SelectItem value="rating">评分最高</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 gap-1 rounded-[10px] text-[12px]">
            <SlidersHorizontal className="h-3 w-3" />
            Filters
          </Button>
        </div>
        <p className="ml-auto text-[12px] text-muted-foreground">
          {inspirations.length} 条灵感
        </p>
      </div>

      {/* Inspiration grid */}
      {inspirations.length > 0 ? (
        <InspirationGrid inspirations={inspirations} />
      ) : (
        <EmptyState
          title="还没有 UI 灵感"
          description="上传你的第一张 UI 截图，开始训练你的设计审美。"
          action={
            <Link
              href="/inspirations/new"
              className={cn(buttonVariants({ variant: "default", size: "default" }), "gap-1.5")}
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span className="inline-flex items-center leading-none">上传灵感</span>
            </Link>
          }
        />
      )}
    </>
  );
}
