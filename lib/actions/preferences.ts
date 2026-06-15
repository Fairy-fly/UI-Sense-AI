/**
 * User Preference Server Actions — Phase 3 + v1.2
 */

"use server";

import { revalidatePath } from "next/cache";
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
    aestheticSummary: row.aestheticSummary,
    aestheticPreferredStyles: row.aestheticPreferredStyles,
    aestheticPreferredColors: row.aestheticPreferredColors,
    aestheticPreferredLayouts: row.aestheticPreferredLayouts,
    aestheticPreferredComponents: row.aestheticPreferredComponents,
    aestheticAvoidedStyles: row.aestheticAvoidedStyles,
    aestheticKeywords: row.aestheticKeywords,
    aestheticAgentInstruction: row.aestheticAgentInstruction,
    aestheticGeneratedAt: row.aestheticGeneratedAt,
    aestheticSourceCount: row.aestheticSourceCount,
  };
}

export async function saveUserPreference(input: {
  preferredStyles: string[];
  dislikedStyles: string[];
  preferredColors: string[];
  preferredLayouts: string[];
  defaultTechStack: string[];
  defaultUiStyle: string;
}) {
  try {
    const existing = await db.userPreference.findFirst();

    const data = {
      preferredStyles: JSON.stringify(input.preferredStyles),
      dislikedStyles: JSON.stringify(input.dislikedStyles),
      preferredColors: JSON.stringify(input.preferredColors),
      preferredLayouts: JSON.stringify(input.preferredLayouts),
      defaultTechStack: JSON.stringify(input.defaultTechStack),
      defaultUiStyle: input.defaultUiStyle,
    };

    if (existing) {
      await db.userPreference.update({ where: { id: existing.id }, data });
    } else {
      await db.userPreference.create({ data });
    }

    revalidatePath("/settings");
    revalidatePath("/prompts");
    revalidatePath("/dashboard");

    return { success: true as const };
  } catch (error) {
    console.error("saveUserPreference error:", error);
    return { success: false as const, error: "保存失败，请重试" };
  }
}
