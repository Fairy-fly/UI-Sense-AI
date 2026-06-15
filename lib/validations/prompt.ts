import { z } from "zod";

export const promptFormSchema = z.object({
  projectName: z
    .string()
    .min(2, "项目名称至少 2 个字符")
    .max(80, "项目名称最多 80 个字符"),
  projectType: z.string().min(1, "请选择项目类型"),
  targetUsers: z
    .string()
    .min(2, "目标用户至少 2 个字符")
    .max(120, "目标用户最多 120 个字符"),
  selectedInspirationIds: z
    .array(z.string())
    .min(1, "请至少选择一个参考灵感")
    .max(6, "最多选择 6 个参考灵感"),
  desiredStyle: z.string().max(200, "期望风格最多 200 个字符").optional().default(""),
  avoidedStyles: z.array(z.string()).max(12, "避免风格最多 12 个").optional().default([]),
  techStack: z.array(z.string()).min(1, "请至少填写一个技术栈").max(12, "技术栈最多 12 个"),
  pageList: z
    .string()
    .min(1, "请填写需要生成的页面")
    .max(600, "页面描述最多 600 个字符"),
  additionalNotes: z
    .string()
    .max(1000, "补充说明最多 1000 个字符")
    .optional()
    .default(""),
  useAI: z.boolean().optional().default(false),
  promptTemplateId: z.string().optional(),
});

export type PromptFormInput = z.infer<typeof promptFormSchema>;
