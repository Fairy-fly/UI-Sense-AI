"use server";

/**
 * Aesthetic Memory Server Actions — v1.7
 */

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { buildAestheticMemory } from "@/lib/aesthetic-memory";

export async function generateAestheticMemory() {
  try {
    const profile = await buildAestheticMemory();

    const pref = await db.userPreference.findFirst();

    if (!profile) {
      // Not enough data — clear aesthetic memory
      if (pref) {
        await db.userPreference.update({
          where: { id: pref.id },
          data: {
            aestheticSummary: null,
            aestheticAgentInstruction: null,
            aestheticGeneratedAt: null,
            aestheticSourceCount: 0,
          },
        });
      }
      return { success: true as const, data: null, message: "灵感数量不足（需要至少 3 个高评分灵感），请先收藏更多参考。" };
    }

    if (pref) {
      await db.userPreference.update({
        where: { id: pref.id },
        data: {
          aestheticSummary: profile.summary,
          aestheticPreferredStyles: JSON.stringify(profile.preferredStyles),
          aestheticPreferredColors: JSON.stringify(profile.preferredColors),
          aestheticPreferredLayouts: JSON.stringify(profile.preferredLayouts),
          aestheticPreferredComponents: JSON.stringify(profile.preferredComponents),
          aestheticAvoidedStyles: JSON.stringify(profile.avoidedStyles),
          aestheticKeywords: JSON.stringify(profile.keywords),
          aestheticAgentInstruction: profile.agentInstruction,
          aestheticGeneratedAt: new Date(),
          aestheticSourceCount: profile.sourceCount,
        },
      });
    } else {
      await db.userPreference.create({
        data: {
          aestheticSummary: profile.summary,
          aestheticPreferredStyles: JSON.stringify(profile.preferredStyles),
          aestheticPreferredColors: JSON.stringify(profile.preferredColors),
          aestheticPreferredLayouts: JSON.stringify(profile.preferredLayouts),
          aestheticPreferredComponents: JSON.stringify(profile.preferredComponents),
          aestheticAvoidedStyles: JSON.stringify(profile.avoidedStyles),
          aestheticKeywords: JSON.stringify(profile.keywords),
          aestheticAgentInstruction: profile.agentInstruction,
          aestheticGeneratedAt: new Date(),
          aestheticSourceCount: profile.sourceCount,
        },
      });
    }

    revalidatePath("/settings");

    return { success: true as const, data: profile };
  } catch (error) {
    console.error("generateAestheticMemory error:", error instanceof Error ? error.message : "unknown");
    return { success: false as const, error: "生成审美记忆失败，请重试" };
  }
}
