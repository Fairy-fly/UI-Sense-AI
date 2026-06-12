/**
 * Inspiration Server Actions — Phase 4 CRUD
 */

"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { inspirationFormSchema, type InspirationFormInput } from "@/lib/validations/inspiration";
import { getOrCreateTags } from "@/lib/actions/tags";
import type { Inspiration } from "@/types";

// ---- Queries (Phase 3) ----

export async function getInspirations(): Promise<Inspiration[]> {
  const rows = await db.inspiration.findMany({
    include: {
      tags: { include: { tag: true } },
      analysis: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapInspiration);
}

export async function getInspirationById(id: string): Promise<Inspiration | null> {
  const row = await db.inspiration.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      analysis: true,
    },
  });
  if (!row) return null;
  return mapInspiration(row);
}

export async function getRecentInspirations(limit = 4): Promise<Inspiration[]> {
  const rows = await db.inspiration.findMany({
    include: {
      tags: { include: { tag: true } },
      analysis: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapInspiration);
}

export async function getDashboardStats() {
  const [totalInspirations, highRatedCount, tagCount, promptCount] = await Promise.all([
    db.inspiration.count(),
    db.inspiration.count({ where: { rating: { gte: 4 } } }),
    db.tag.count(),
    db.promptRecord.count(),
  ]);
  return { totalInspirations, highRatedCount, tagCount, promptCount };
}

// ---- Mutations (Phase 4) ----

export async function createInspiration(input: InspirationFormInput) {
  try {
    const parsed = inspirationFormSchema.safeParse(input);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      return { success: false as const, error: firstError.message };
    }

    const data = parsed.data;

    const inspiration = await db.inspiration.create({
      data: {
        title: data.title,
        description: data.description || null,
        sourceUrl: data.sourceUrl || null,
        imageUrl: data.imageUrl || "",
        previewVariant: data.previewVariant || "linear",
        projectType: data.projectType || null,
        rating: data.rating,
        notes: data.notes || null,
      },
    });

    // Handle tags
    if (data.tags && data.tags.length > 0) {
      const uniqueTags = [...new Set(data.tags.map((t) => t.trim()).filter(Boolean))];
      const tagRecords = await getOrCreateTags(uniqueTags);

      for (const tag of tagRecords) {
        await db.inspirationTag.create({
          data: { inspirationId: inspiration.id, tagId: tag.id },
        });
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/inspirations");

    return { success: true as const, id: inspiration.id };
  } catch (error) {
    console.error("createInspiration error:", error);
    return { success: false as const, error: "保存失败，请重试" };
  }
}

export async function updateInspiration(id: string, input: InspirationFormInput) {
  try {
    const existing = await db.inspiration.findUnique({ where: { id } });
    if (!existing) {
      return { success: false as const, error: "灵感不存在" };
    }

    const parsed = inspirationFormSchema.safeParse(input);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      return { success: false as const, error: firstError.message };
    }

    const data = parsed.data;

    await db.inspiration.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        sourceUrl: data.sourceUrl || null,
        imageUrl: data.imageUrl || existing.imageUrl,
        previewVariant: existing.previewVariant,
        projectType: data.projectType || null,
        rating: data.rating,
        notes: data.notes || null,
      },
    });

    // Update tags: remove old associations, create new ones
    await db.inspirationTag.deleteMany({ where: { inspirationId: id } });

    if (data.tags && data.tags.length > 0) {
      const uniqueTags = [...new Set(data.tags.map((t) => t.trim()).filter(Boolean))];
      const tagRecords = await getOrCreateTags(uniqueTags);

      for (const tag of tagRecords) {
        await db.inspirationTag.create({
          data: { inspirationId: id, tagId: tag.id },
        });
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/inspirations");
    revalidatePath(`/inspirations/${id}`);

    return { success: true as const };
  } catch (error) {
    console.error("updateInspiration error:", error);
    return { success: false as const, error: "更新失败，请重试" };
  }
}

export async function deleteInspiration(id: string) {
  try {
    const existing = await db.inspiration.findUnique({ where: { id } });
    if (!existing) {
      return { success: false as const, error: "灵感不存在" };
    }

    // Delete children first
    await db.inspirationTag.deleteMany({ where: { inspirationId: id } });
    await db.aiAnalysis.deleteMany({ where: { inspirationId: id } });
    await db.inspiration.delete({ where: { id } });

    revalidatePath("/dashboard");
    revalidatePath("/inspirations");

    return { success: true as const };
  } catch (error) {
    console.error("deleteInspiration error:", error);
    return { success: false as const, error: "删除失败，请重试" };
  }
}

export async function getInspirationForEdit(id: string) {
  const row = await db.inspiration.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
    },
  });
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    sourceUrl: row.sourceUrl ?? "",
    imageUrl: row.imageUrl,
    previewVariant: row.previewVariant,
    projectType: row.projectType ?? "",
    rating: row.rating,
    notes: row.notes ?? "",
    tags: row.tags.map((it) => it.tag.name),
  };
}

// ---- Mapper ----

type InspirationRow = NonNullable<Awaited<ReturnType<typeof db.inspiration.findUnique>>> & {
  tags: {
    tag: {
      id: string;
      name: string;
      category: string | null;
      color: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
  analysis: {
    id: string;
    inspirationId: string;
    colorAnalysis: string | null;
    layoutAnalysis: string | null;
    componentAnalysis: string | null;
    styleSummary: string | null;
    designKeywords: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

function mapInspiration(row: NonNullable<InspirationRow>): Inspiration {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    sourceUrl: row.sourceUrl,
    imageUrl: row.imageUrl,
    previewVariant: row.previewVariant,
    projectType: row.projectType,
    rating: row.rating,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    tags: row.tags.map((it) => ({
      id: it.tag.id,
      name: it.tag.name,
      category: it.tag.category as TagCategory | null,
      color: it.tag.color,
      createdAt: it.tag.createdAt,
      updatedAt: it.tag.updatedAt,
    })),
    analysis: row.analysis
      ? {
          id: row.analysis.id,
          inspirationId: row.analysis.inspirationId,
          colorAnalysis: row.analysis.colorAnalysis,
          layoutAnalysis: row.analysis.layoutAnalysis,
          componentAnalysis: row.analysis.componentAnalysis,
          styleSummary: row.analysis.styleSummary,
          designKeywords: row.analysis.designKeywords,
          createdAt: row.analysis.createdAt,
          updatedAt: row.analysis.updatedAt,
        }
      : null,
  };
}

type TagCategory = "style" | "color" | "layout" | "component" | "mood" | "project_type";
