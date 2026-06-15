"use server";

/**
 * AI Analysis Server Actions — v1.4
 *
 * Orchestrates AI analysis generation and persistence to AiAnalysis table.
 */

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { generateImageAnalysis } from "@/lib/ai/image-analysis";

export async function analyzeInspiration(inspirationId: string) {
  try {
    // 1. Fetch inspiration with tags
    const inspiration = await db.inspiration.findUnique({
      where: { id: inspirationId },
      include: { tags: { include: { tag: true } } },
    });

    if (!inspiration) {
      return { success: false as const, error: "灵感不存在" };
    }

    // 2. Build analysis input from inspiration metadata
    const input = {
      title: inspiration.title,
      projectType: inspiration.projectType,
      tags: inspiration.tags.map((it) => it.tag.name),
      notes: inspiration.notes,
      sourceUrl: inspiration.sourceUrl,
      // Only pass local upload paths for vision analysis safety
      imagePath: inspiration.imageUrl?.startsWith("/uploads/") ? inspiration.imageUrl : undefined,
    };

    // 3. Generate analysis via AI
    const result = await generateImageAnalysis(input);

    if (!result.success || !result.data) {
      return { success: false as const, error: result.error ?? "AI 分析生成失败" };
    }

    const analysisMode = result.data.analysisMode ?? "text";

    // 4. Upsert to AiAnalysis table (one-to-one per inspiration)
    const saved = await db.aiAnalysis.upsert({
      where: { inspirationId },
      create: {
        inspirationId,
        colorAnalysis: result.data.colorAnalysis,
        layoutAnalysis: result.data.layoutAnalysis,
        componentAnalysis: result.data.componentAnalysis,
        styleSummary: result.data.styleSummary,
        designKeywords: result.data.designKeywords,
      },
      update: {
        colorAnalysis: result.data.colorAnalysis,
        layoutAnalysis: result.data.layoutAnalysis,
        componentAnalysis: result.data.componentAnalysis,
        styleSummary: result.data.styleSummary,
        designKeywords: result.data.designKeywords,
      },
    });

    revalidatePath(`/inspirations/${inspirationId}`);

    const analysis = {
      id: saved.id,
      inspirationId: saved.inspirationId,
      colorAnalysis: saved.colorAnalysis,
      layoutAnalysis: saved.layoutAnalysis,
      componentAnalysis: saved.componentAnalysis,
      styleSummary: saved.styleSummary,
      designKeywords: saved.designKeywords,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };

    return { success: true as const, analysisMode, analysis };
  } catch {
    return { success: false as const, error: "AI 分析失败，请重试" };
  }
}
