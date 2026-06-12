"use client";

import { useState, useMemo } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InspirationGrid } from "@/components/inspirations/inspiration-grid";
import { EmptyState } from "@/components/common/empty-state";
import { InspirationFilterBar, type FilterBarState } from "@/components/inspirations/inspiration-filter-bar";
import { filterInspirations, sortInspirations } from "@/lib/filters/inspirations";
import type { Inspiration } from "@/types";

interface InspirationsContentProps {
  inspirations: Inspiration[];
  allTags: string[];
}

export function InspirationsContent({ inspirations, allTags }: InspirationsContentProps) {
  const [filters, setFilters] = useState<FilterBarState>({
    search: "",
    projectType: "",
    tagNames: [],
    minRating: 1,
    sort: "newest",
  });

  const filtered = useMemo(() => {
    const matched = filterInspirations(inspirations, filters);
    return sortInspirations(matched, filters.sort);
  }, [inspirations, filters]);

  return (
    <>
      <InspirationFilterBar
        allTags={allTags}
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />

      {filtered.length > 0 ? (
        <InspirationGrid inspirations={filtered} />
      ) : (
        <EmptyState
          title="没有找到匹配的灵感"
          description="试着换个关键词，或清空筛选条件。"
          action={
            <button
              onClick={() =>
                setFilters({ search: "", projectType: "", tagNames: [], minRating: 1, sort: "newest" })
              }
              className={cn(buttonVariants({ variant: "default", size: "default" }), "gap-1.5")}
            >
              清空筛选
            </button>
          }
        />
      )}
    </>
  );
}
