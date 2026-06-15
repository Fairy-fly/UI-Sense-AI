/**
 * Prompt Server Actions — Phase 5 CRUD + Generate
 */

"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { promptFormSchema, type PromptFormInput } from "@/lib/validations/prompt";
import { optimizePromptWithAI } from "@/lib/ai/prompt-optimizer";
import { getUserPreference } from "@/lib/actions/preferences";
import type { PromptRecord } from "@/types";

// ---- Phase 3 queries ----

export async function getRecentPromptRecords(limit = 5): Promise<PromptRecord[]> {
  const rows = await db.promptRecord.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapPromptRecord);
}

export async function getPromptCount(): Promise<number> {
  return db.promptRecord.count();
}

// ---- Phase 5: Generate ----

export async function generatePrompt(input: PromptFormInput & { useAI?: boolean }) {
  try {
    const parsed = promptFormSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false as const, error: parsed.error.errors[0].message };
    }

    const data = parsed.data;

    // Fetch selected inspirations
    const inspirations = await db.inspiration.findMany({
      where: { id: { in: data.selectedInspirationIds } },
      include: { tags: { include: { tag: true } }, analysis: true },
    });

    if (inspirations.length === 0) {
      return { success: false as const, error: "未找到选中的参考灵感" };
    }

    // Fetch user preferences
    const pref = await getUserPreference();

    const userPreferences = pref
      ? {
          preferredStyles: safeParse(pref.preferredStyles),
          preferredColors: safeParse(pref.preferredColors),
          preferredLayouts: safeParse(pref.preferredLayouts),
          dislikedStyles: safeParse(pref.dislikedStyles),
          defaultTechStack: safeParse(pref.defaultTechStack),
        }
      : undefined;

    // Extract aesthetic memory from UserPreference
    const aestheticMemory = pref?.aestheticSummary
      ? {
          summary: pref.aestheticSummary,
          preferredStyles: safeParse(pref.aestheticPreferredStyles),
          preferredColors: safeParse(pref.aestheticPreferredColors),
          preferredLayouts: safeParse(pref.aestheticPreferredLayouts),
          preferredComponents: safeParse(pref.aestheticPreferredComponents),
          avoidedStyles: safeParse(pref.aestheticAvoidedStyles),
          keywords: safeParse(pref.aestheticKeywords),
          agentInstruction: pref.aestheticAgentInstruction ?? undefined,
        }
      : undefined;

    const sections = await optimizePromptWithAI({
      projectName: data.projectName,
      projectType: data.projectType,
      targetUsers: data.targetUsers,
      selectedInspirations: inspirations.map((i) => ({
        id: i.id,
        title: i.title,
        projectType: i.projectType,
        rating: i.rating,
        notes: i.notes,
        analysis: i.analysis as unknown as import("@/types").AiAnalysis | null,
        tags: i.tags.map((it) => ({
          id: it.tag.id,
          name: it.tag.name,
          category: it.tag.category as "style" | "color" | "layout" | "component" | "mood" | "project_type" | null,
          color: it.tag.color,
          createdAt: it.tag.createdAt,
          updatedAt: it.tag.updatedAt,
        })),
      })),
      desiredStyle: data.desiredStyle,
      avoidedStyles: data.avoidedStyles,
      techStack: data.techStack,
      pageList: data.pageList,
      additionalNotes: data.additionalNotes,
      promptTemplateId: data.promptTemplateId,
      aestheticMemory,
      userPreferences,
      useAI: data.useAI ?? false,
    });

    return { success: true as const, data: sections };
  } catch (error) {
    console.error("generatePrompt error:", error);
    return { success: false as const, error: "生成失败，请重试" };
  }
}

// ---- Phase 5: CRUD ----

/**
 * Save already-generated prompt content directly — no re-generation, no AI call.
 * Used by PromptWorkspace handleSave to avoid duplicate DeepSeek calls.
 */
export async function createPromptRecordFromGenerated(input: {
  projectName: string;
  projectType: string;
  selectedInspirationIds: string[];
  fullPrompt: string;
  designSystemPrompt: string;
  pageLevelPrompt: string;
  componentLevelPrompt: string;
}) {
  try {
    if (!input.projectName?.trim()) return { success: false as const, error: "项目名称不能为空" };
    if (!input.fullPrompt) return { success: false as const, error: "请先生成 Prompt" };
    if (!input.selectedInspirationIds?.length) return { success: false as const, error: "请选择参考灵感" };

    const record = await db.promptRecord.create({
      data: {
        title: `${input.projectName} UI 开发 Prompt`,
        targetProject: input.projectName,
        projectType: input.projectType || null,
        selectedInspirationIds: JSON.stringify(input.selectedInspirationIds),
        generatedPrompt: input.fullPrompt,
        designSystemPrompt: input.designSystemPrompt,
        pageLevelPrompt: input.pageLevelPrompt,
        componentLevelPrompt: input.componentLevelPrompt,
      },
    });

    revalidatePath("/prompts");
    revalidatePath("/dashboard");

    return { success: true as const, id: record.id };
  } catch (error) {
    console.error("createPromptRecordFromGenerated error:", error);
    return { success: false as const, error: "保存失败，请重试" };
  }
}

/**
 * Legacy: generates prompt THEN saves. Avoid in UI — use createPromptRecordFromGenerated
 * for the save-after-generate flow.
 */
export async function createPromptRecord(input: PromptFormInput) {
  try {
    const parsed = promptFormSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false as const, error: parsed.error.errors[0].message };
    }

    const data = parsed.data;

    // Generate prompt sections first
    const genResult = await generatePrompt(input);
    if (!genResult.success) {
      return genResult;
    }

    const sections = genResult.data!;

    const record = await db.promptRecord.create({
      data: {
        title: `${data.projectName} UI 开发 Prompt`,
        targetProject: data.projectName,
        projectType: data.projectType,
        selectedInspirationIds: JSON.stringify(data.selectedInspirationIds),
        generatedPrompt: sections.fullPrompt,
        designSystemPrompt: sections.designSystemPrompt,
        pageLevelPrompt: sections.pageLevelPrompt,
        componentLevelPrompt: sections.componentLevelPrompt,
      },
    });

    revalidatePath("/prompts");
    revalidatePath("/dashboard");

    return { success: true as const, id: record.id };
  } catch (error) {
    console.error("createPromptRecord error:", error);
    return { success: false as const, error: "保存失败，请重试" };
  }
}

export async function getPromptRecordById(id: string): Promise<PromptRecord | null> {
  const row = await db.promptRecord.findUnique({ where: { id } });
  if (!row) return null;
  return mapPromptRecord(row);
}

export async function getPromptRecords(): Promise<PromptRecord[]> {
  const rows = await db.promptRecord.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapPromptRecord);
}

export async function deletePromptRecord(id: string) {
  try {
    const existing = await db.promptRecord.findUnique({ where: { id } });
    if (!existing) {
      return { success: false as const, error: "记录不存在" };
    }
    await db.promptRecord.delete({ where: { id } });
    revalidatePath("/prompts");
    revalidatePath("/dashboard");
    return { success: true as const };
  } catch (error) {
    console.error("deletePromptRecord error:", error);
    return { success: false as const, error: "删除失败，请重试" };
  }
}

// ---- Mapper ----

function mapPromptRecord(row: {
  id: string;
  title: string;
  targetProject: string;
  projectType: string | null;
  selectedInspirationIds: string;
  generatedPrompt: string;
  designSystemPrompt: string | null;
  pageLevelPrompt: string | null;
  componentLevelPrompt: string | null;
  createdAt: Date;
  updatedAt: Date;
}): PromptRecord {
  return {
    id: row.id,
    title: row.title,
    targetProject: row.targetProject,
    projectType: row.projectType,
    selectedInspirationIds: row.selectedInspirationIds,
    generatedPrompt: row.generatedPrompt,
    designSystemPrompt: row.designSystemPrompt,
    pageLevelPrompt: row.pageLevelPrompt,
    componentLevelPrompt: row.componentLevelPrompt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function safeParse(str: string | null): string[] {
  if (!str) return [];
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}
