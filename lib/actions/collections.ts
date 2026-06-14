"use server";

/**
 * Collection Server Actions — v1.3
 * CRUD for inspiration collections + manage inspiration-collection relations.
 */

import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// ---- Schemas ----

const CollectionSchema = z.object({
  name: z.string().min(1, "请输入收藏集名称").max(60, "名称不能超过 60 个字符"),
  description: z.string().max(200, "描述不能超过 200 个字符").optional(),
  coverColor: z.string().optional(),
});

type CollectionInput = z.infer<typeof CollectionSchema>;

// ---- CRUD ----

export async function getCollections() {
  return db.collection.findMany({
    include: { _count: { select: { inspirations: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCollectionById(id: string) {
  const collection = await db.collection.findUnique({
    where: { id },
    include: {
      _count: { select: { inspirations: true } },
      inspirations: {
        include: {
          inspiration: {
            include: { tags: { include: { tag: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!collection) return null;

  // Flatten nested includes into a cleaner shape for the UI
  return {
    ...collection,
    inspirations: collection.inspirations.map((ic) => ({
      ...ic.inspiration,
      tags: ic.inspiration.tags.map((it) => it.tag),
    })),
  };
}

export async function createCollection(input: CollectionInput) {
  const parsed = CollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "输入不合法" };
  }
  try {
    const collection = await db.collection.create({ data: parsed.data });
    revalidatePath("/collections");
    return { success: true, data: collection };
  } catch {
    return { success: false, error: "创建收藏集失败" };
  }
}

export async function updateCollection(id: string, input: CollectionInput) {
  const parsed = CollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "输入不合法" };
  }
  try {
    const collection = await db.collection.update({ where: { id }, data: parsed.data });
    revalidatePath("/collections");
    revalidatePath(`/collections/${id}`);
    return { success: true, data: collection };
  } catch {
    return { success: false, error: "更新收藏集失败" };
  }
}

export async function deleteCollection(id: string) {
  try {
    // Delete association records first, then the collection itself.
    // Inspirations are NOT deleted (Cascade only on the join table).
    await db.inspirationCollection.deleteMany({ where: { collectionId: id } });
    await db.collection.delete({ where: { id } });
    revalidatePath("/collections");
    return { success: true };
  } catch {
    return { success: false, error: "删除收藏集失败" };
  }
}

// ---- Inspiration-Collection relations ----

export async function addInspirationToCollection(inspirationId: string, collectionId: string) {
  try {
    await db.inspirationCollection.create({
      data: { inspirationId, collectionId },
    });
    revalidatePath(`/inspirations/${inspirationId}`);
    revalidatePath(`/collections/${collectionId}`);
    return { success: true };
  } catch {
    return { success: false, error: "添加失败，可能已在此收藏集中" };
  }
}

export async function removeInspirationFromCollection(inspirationId: string, collectionId: string) {
  try {
    await db.inspirationCollection.deleteMany({
      where: { inspirationId, collectionId },
    });
    revalidatePath(`/inspirations/${inspirationId}`);
    revalidatePath(`/collections/${collectionId}`);
    return { success: true };
  } catch {
    return { success: false, error: "移除失败" };
  }
}

export async function getInspirationCollections(inspirationId: string) {
  return db.inspirationCollection.findMany({
    where: { inspirationId },
    include: { collection: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getInspirationsByCollection(collectionId: string) {
  const rows = await db.inspirationCollection.findMany({
    where: { collectionId },
    include: { inspiration: { include: { tags: { include: { tag: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => r.inspiration);
}
