/**
 * AI Analysis Server Actions — Phase 3 (placeholder)
 */

import "server-only";

import { db } from "@/lib/db";
import type { AiAnalysis } from "@/types";

export async function getAnalysisByInspirationId(inspirationId: string): Promise<AiAnalysis | null> {
  const row = await db.aiAnalysis.findUnique({
    where: { inspirationId },
  });

  if (!row) return null;

  return {
    id: row.id,
    inspirationId: row.inspirationId,
    colorAnalysis: row.colorAnalysis,
    layoutAnalysis: row.layoutAnalysis,
    componentAnalysis: row.componentAnalysis,
    styleSummary: row.styleSummary,
    designKeywords: row.designKeywords,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
