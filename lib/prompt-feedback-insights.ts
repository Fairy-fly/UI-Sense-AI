/**
 * Prompt Feedback Insights — v1.9
 *
 * Analyzes PromptRecord feedback data to generate strategy recommendations.
 * Uses only existing v1.8 feedback fields — no schema changes needed.
 *
 * Server-only.
 */

import "server-only";

import { db } from "@/lib/db";

export interface PromptFeedbackInsights {
  totalFeedbackCount: number;
  favoriteCount: number;
  usefulCount: number;
  needsImprovementCount: number;
  averageRating: number | null;
  positiveTags: string[];
  negativeTags: string[];
  strategySummary: string;
  agentInstruction: string;
}

export async function computePromptFeedbackInsights(): Promise<PromptFeedbackInsights | null> {
  // Fetch records with feedback
  const records = await db.promptRecord.findMany({
    where: {
      OR: [
        { feedbackRating: { not: null } },
        { feedbackLabel: { not: null } },
        { isFavorite: true },
      ],
    },
    select: {
      feedbackRating: true,
      feedbackLabel: true,
      feedbackTags: true,
      isFavorite: true,
    },
    orderBy: { feedbackUpdatedAt: "desc" },
    take: 100,
  });

  if (records.length < 2) return null;

  // Count metrics
  const totalFeedbackCount = records.length;
  const favoriteCount = records.filter((r) => r.isFavorite).length;
  const usefulCount = records.filter((r) => r.feedbackLabel === "useful").length;
  const needsImprovementCount = records.filter((r) => r.feedbackLabel === "needs_improvement").length;

  // Average rating
  const ratings = records
    .map((r) => r.feedbackRating)
    .filter((r): r is number => r !== null);
  const averageRating = ratings.length > 0
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
    : null;

  // Tag frequency
  const allTags = records.flatMap((r) => {
    if (!r.feedbackTags) return [];
    try { return JSON.parse(r.feedbackTags) as string[]; } catch { return []; }
  });

  const tagFreq: Record<string, number> = {};
  for (const t of allTags) { tagFreq[t] = (tagFreq[t] ?? 0) + 1; }

  const positiveKeywords = ["结构清楚", "UI 高级", "可执行性强", "适合复用"];
  const negativeKeywords = ["信息太多", "不够具体", "风格不准", "需要人工改写"];

  const positiveTags = Object.entries(tagFreq)
    .filter(([k]) => positiveKeywords.includes(k))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([k]) => k);

  const negativeTags = Object.entries(tagFreq)
    .filter(([k]) => negativeKeywords.includes(k))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([k]) => k);

  // Strategy summary
  const strategySummary = `${totalFeedbackCount} 条反馈中${usefulCount} 条标记为好用、${needsImprovementCount} 条需要改进${averageRating ? `、平均评分 ${averageRating}/5` : ""}。正面特征：${positiveTags.length > 0 ? positiveTags.join("、") : "暂无"}。需避免：${negativeTags.length > 0 ? negativeTags.join("、") : "暂无"}。`.slice(0, 180);

  // Agent instruction
  const agentInstruction = `后续生成 Prompt 时，优先保持${positiveTags.length > 0 ? positiveTags.slice(0, 3).join("、") : "结构清楚、分步骤、可执行"}; 避免${negativeTags.length > 0 ? negativeTags.slice(0, 3).join("、") : "过长、空泛、不可落地"}。${favoriteCount > 0 ? `其中 ${favoriteCount} 条被收藏为优质 Prompt，可优先参考其结构和细节粒度。` : ""}`.slice(0, 200);

  return {
    totalFeedbackCount,
    favoriteCount,
    usefulCount,
    needsImprovementCount,
    averageRating,
    positiveTags,
    negativeTags,
    strategySummary,
    agentInstruction,
  };
}
