/**
 * Inspiration filter & sort helpers — pure functions.
 * Works with Inspiration[] from getInspirations().
 */

import type { Inspiration } from "@/types";
import { displayStyleTag, displayProjectType, displayColor, displayLayout } from "@/lib/display-labels";

export interface InspirationFilters {
  search: string;
  projectType: string;
  tagNames: string[];
  minRating: number;
  sort: string;
}

export function filterInspirations(inspirations: Inspiration[], filters: InspirationFilters): Inspiration[] {
  let result = [...inspirations];

  // Search (title, sourceUrl, notes, projectType, tag names + Chinese display values)
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((insp) => {
      const haystack = [
        insp.title,
        insp.sourceUrl ?? "",
        insp.notes ?? "",
        insp.projectType ?? "",
        displayProjectType(insp.projectType ?? ""),
        ...(insp.tags ?? []).flatMap((t) => [
          t.name,
          displayStyleTag(t.name),
          displayColor(t.name),
          displayLayout(t.name),
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }

  // Project type filter
  if (filters.projectType) {
    result = result.filter((insp) => insp.projectType === filters.projectType);
  }

  // Tag filter (AND — inspiration must have ALL selected tags)
  if (filters.tagNames.length > 0) {
    result = result.filter((insp) =>
      filters.tagNames.every((tagName) =>
        (insp.tags ?? []).some((t) => t.name === tagName),
      ),
    );
  }

  // Rating filter
  if (filters.minRating > 1) {
    result = result.filter((insp) => insp.rating >= filters.minRating);
  }

  return result;
}

export function sortInspirations(inspirations: Inspiration[], sort: string): Inspiration[] {
  const sorted = [...inspirations];

  switch (sort) {
    case "oldest":
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case "rating-high":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "rating-low":
      sorted.sort((a, b) => a.rating - b.rating);
      break;
    case "newest":
    default:
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return sorted;
}
