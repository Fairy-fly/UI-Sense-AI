import { z } from "zod";

export const inspirationFormSchema = z.object({
  title: z
    .string()
    .min(2, "标题至少 2 个字符")
    .max(80, "标题最多 80 个字符"),
  description: z.string().max(300, "描述最多 300 个字符").optional().default(""),
  sourceUrl: z
    .string()
    .url("请输入有效的 URL")
    .optional()
    .or(z.literal("")),
  imageUrl: z.string().optional().default(""),
  previewVariant: z.string().optional().default("linear"),
  projectType: z.string().optional().default(""),
  rating: z.coerce.number().int().min(1, "评分最小为 1").max(5, "评分最大为 5"),
  notes: z.string().max(1000, "备注最多 1000 个字符").optional().default(""),
  tags: z
    .array(z.string().min(1, "标签不能为空").max(32, "单个标签最多 32 个字符"))
    .max(12, "最多 12 个标签")
    .optional()
    .default([]),
});

export type InspirationFormInput = z.infer<typeof inspirationFormSchema>;
