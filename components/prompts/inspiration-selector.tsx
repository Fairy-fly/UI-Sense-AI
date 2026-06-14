"use client";

import type { Inspiration } from "@/types";
import { cn } from "@/lib/utils";
import { MockPreview } from "@/components/common/mock-preview";
import { Badge } from "@/components/ui/badge";
import { RatingDisplay } from "@/components/inspirations/rating-display";
import { displayProjectType, displayStyleTag } from "@/lib/display-labels";

interface InspirationSelectorProps {
  inspirations: Inspiration[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  maxSelect?: number;
}

export function InspirationSelector({
  inspirations,
  selectedIds,
  onChange,
  maxSelect = 6,
}: InspirationSelectorProps) {
  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else if (selectedIds.length < maxSelect) {
      onChange([...selectedIds, id]);
    }
  }

  if (inspirations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center">
        <p className="text-[12px] text-muted-foreground">还没有收藏 UI 灵感。</p>
      </div>
    );
  }

  return (
    <div className="max-h-[360px] space-y-1.5 overflow-y-auto">
      {inspirations.map((insp) => {
        const isSelected = selectedIds.includes(insp.id);
        const previewVariant = insp.previewVariant ?? "linear";

        return (
          <button
            key={insp.id}
            type="button"
            onClick={() => toggle(insp.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
              isSelected
                ? "border-ring/50 bg-muted/30 ring-1 ring-ring/10"
                : "border-border bg-card hover:border-ring/20 hover:bg-muted/20",
            )}
          >
            <div className="h-11 w-[66px] shrink-0 overflow-hidden rounded-lg border border-border">
              <MockPreview variant={previewVariant} className="h-full w-full rounded-none" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-foreground">{insp.title}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                {insp.projectType && (
                  <Badge variant="secondary" className="shrink-0 text-[10px]">{displayProjectType(insp.projectType)}</Badge>
                )}
                <span className="inline-flex shrink-0 overflow-hidden">
                  <RatingDisplay rating={insp.rating} size="sm" />
                </span>
                {insp.tags && insp.tags.length > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    {(insp.tags ?? []).slice(0, 2).map((t) => displayStyleTag(t.name)).join(" · ")}
                  </span>
                )}
              </div>
            </div>
            {isSelected && (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                {selectedIds.indexOf(insp.id) + 1}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
