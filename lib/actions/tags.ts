/**
 * Tag Server Actions — Phase 4
 */

"use server";

import { db } from "@/lib/db";
import type { Tag } from "@/types";

export async function getTags(): Promise<Tag[]> {
  const rows = await db.tag.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapTag);
}

export async function getPopularTags(): Promise<Tag[]> {
  return getTags();
}

/**
 * Get or create tags by name. Deduplicates, trims, filters empty.
 */
export async function getOrCreateTags(
  tagNames: string[],
): Promise<{ id: string; name: string; category: string | null; color: string | null }[]> {
  const cleaned = [...new Set(tagNames.map((t) => t.trim()).filter(Boolean))];

  const results: { id: string; name: string; category: string | null; color: string | null }[] = [];

  for (const name of cleaned) {
    let tag = await db.tag.findUnique({ where: { name } });
    if (!tag) {
      tag = await db.tag.create({
        data: { name, category: "style", color: "neutral" },
      });
    }
    results.push({ id: tag.id, name: tag.name, category: tag.category, color: tag.color });
  }

  return results;
}

function mapTag(row: { id: string; name: string; category: string | null; color: string | null; createdAt: Date; updatedAt: Date }): Tag {
  return {
    id: row.id,
    name: row.name,
    category: row.category as Tag["category"],
    color: row.color,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
