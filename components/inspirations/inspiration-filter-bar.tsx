"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { displayStyleTag, displayProjectType } from "@/lib/display-labels";

// Display values (Chinese)
const ALL_PROJECT_TYPES = [
  "SaaS", "AI Tool", "Dashboard", "Landing Page",
  "Mobile App", "Portfolio", "Admin Panel", "Design Tool", "Desktop App", "Developer Tool",
];

const RATING_OPTIONS = [
  { value: "1", label: "全部评分" },
  { value: "4", label: "4 星及以上" },
  { value: "3", label: "3 星及以上" },
  { value: "2", label: "2 星及以上" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "最新优先" },
  { value: "oldest", label: "最早收藏" },
  { value: "rating-high", label: "评分最高" },
  { value: "rating-low", label: "评分最低" },
];

export interface FilterBarState {
  search: string;
  projectType: string;
  tagNames: string[];
  minRating: number;
  sort: string;
}

interface InspirationFilterBarProps {
  allTags: string[];
  filters: FilterBarState;
  onChange: (filters: FilterBarState) => void;
  resultCount: number;
}

export function InspirationFilterBar({ allTags, filters, onChange, resultCount }: InspirationFilterBarProps) {
  function update(partial: Partial<FilterBarState>) {
    onChange({ ...filters, ...partial });
  }

  function toggleTag(name: string) {
    const next = filters.tagNames.includes(name)
      ? filters.tagNames.filter((t) => t !== name)
      : [...filters.tagNames, name];
    update({ tagNames: next });
  }

  function toggleProjectType(type: string) {
    update({ projectType: filters.projectType === type ? "" : type });
  }

  function clearAll() {
    onChange({ search: "", projectType: "", tagNames: [], minRating: 1, sort: "newest" });
  }

  const hasFilters = filters.search || filters.projectType || filters.tagNames.length > 0 || filters.minRating > 1;

  return (
    <div className="mb-6 space-y-3 rounded-2xl border border-border bg-card p-4">
      {/* Row 1: Search + Sort + Count */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1" style={{ minWidth: "180px" }}>
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="搜索标题、来源、标签..."
            className="h-8 rounded-[10px] border-0 bg-muted/50 pl-9 text-[13px]"
          />
        </div>
        <Select value={filters.sort} onValueChange={(v) => update({ sort: v ?? "newest" })}>
          <SelectTrigger className="h-8 w-[120px] rounded-[10px] text-[12px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-[12px] text-muted-foreground">
          共 {resultCount} 条灵感
        </span>
      </div>

      {/* Row 2: Project type chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-muted-foreground shrink-0">类型:</span>
        {ALL_PROJECT_TYPES.map((type) => (
          <Badge
            key={type}
            variant={filters.projectType === type ? "secondary" : "outline"}
            className="cursor-pointer text-[11px] transition-colors hover:bg-muted"
            onClick={() => toggleProjectType(type)}
          >
            {displayProjectType(type)}
          </Badge>
        ))}
      </div>

      {/* Row 3: Tag chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-muted-foreground shrink-0">标签:</span>
        {allTags.slice(0, 14).map((name) => (
          <Badge
            key={name}
            variant={filters.tagNames.includes(name) ? "secondary" : "outline"}
            className="cursor-pointer text-[11px] transition-colors hover:bg-muted"
            onClick={() => toggleTag(name)}
          >
            {displayStyleTag(name)}
          </Badge>
        ))}
      </div>

      {/* Row 4: Rating + Clear */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-muted-foreground shrink-0">评分:</span>
        {RATING_OPTIONS.map((r) => (
          <Badge
            key={r.value}
            variant={String(filters.minRating) === r.value ? "secondary" : "outline"}
            className="cursor-pointer text-[11px] transition-colors hover:bg-muted"
            onClick={() => update({ minRating: Number(r.value) })}
          >
            {r.label}
          </Badge>
        ))}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-7 rounded-[10px] gap-1 text-[11px] text-muted-foreground"
            onClick={clearAll}
          >
            <X className="h-3 w-3" />
            清空筛选
          </Button>
        )}
      </div>
    </div>
  );
}
