/**
 * User Preference Server Actions — Phase 3
 */

import "server-only";

import { db } from "@/lib/db";
import type { UserPreferences } from "@/types";

export async function getUserPreference(): Promise<UserPreferences | null> {
  const row = await db.userPreference.findFirst();
  if (!row) return null;

  return {
    id: row.id,
    preferredStyles: row.preferredStyles,
    dislikedStyles: row.dislikedStyles,
    preferredColors: row.preferredColors,
    preferredLayouts: row.preferredLayouts,
    defaultTechStack: row.defaultTechStack,
    defaultUiStyle: row.defaultUiStyle,
    updatedAt: row.updatedAt,
  };
}
