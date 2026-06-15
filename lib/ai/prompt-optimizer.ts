/**
 * AI Prompt Optimizer
 *
 * Phase 6 — takes local template output and enhances it via DeepSeek.
 * Always falls back to local template on failure.
 */

import "server-only";

import { generatePromptSections, type PromptSections } from "@/lib/prompt-builder";
import { generateWithDeepSeek, isDeepSeekConfigured } from "@/lib/ai/deepseek";
import { getPromptTemplate } from "@/lib/prompt-templates";
import { isLegacySeedAnalysis } from "@/lib/ai-analysis-utils";
import type { Inspiration } from "@/types";

export interface OptimizeInput {
  projectName: string;
  projectType: string;
  targetUsers: string;
  selectedInspirations: Pick<Inspiration, "id" | "title" | "projectType" | "rating" | "notes" | "tags" | "analysis">[];
  desiredStyle: string;
  avoidedStyles: string[];
  techStack: string[];
  pageList: string;
  additionalNotes: string;
  promptTemplateId?: string;
  userPreferences?: {
    preferredStyles?: string[];
    preferredColors?: string[];
    preferredLayouts?: string[];
    dislikedStyles?: string[];
  };
  useAI: boolean;
}

export interface OptimizeResult extends PromptSections {
  usedAI: boolean;
  fallbackReason?: string;
  aiSummary?: string;
}

export async function optimizePromptWithAI(input: OptimizeInput): Promise<OptimizeResult> {
  // Step 1: Always generate local template baseline
  const baseline = generatePromptSections({
    projectName: input.projectName,
    projectType: input.projectType,
    targetUsers: input.targetUsers,
    selectedInspirations: input.selectedInspirations,
    desiredStyle: input.desiredStyle,
    avoidedStyles: input.avoidedStyles,
    techStack: input.techStack,
    pageList: input.pageList,
    additionalNotes: input.additionalNotes,
    promptTemplateId: input.promptTemplateId,
    userPreferences: input.userPreferences,
  });

  // Step 2: Skip AI if not requested or not configured
  if (!input.useAI) {
    return { ...baseline, usedAI: false };
  }

  if (!isDeepSeekConfigured()) {
    return { ...baseline, usedAI: false, fallbackReason: "未配置 DEEPSEEK_API_KEY" };
  }

  // Step 3: Build AI optimization prompt
  const inspSummary = input.selectedInspirations
    .map((i) => `- ${i.title} (${i.projectType ?? ""}, ${i.rating}/5): ${i.notes ?? ""}`)
    .join("\n");

  // Build analysis context from inspirations that have valid AI analysis
  const inspWithAnalysis = input.selectedInspirations.filter(
    (i) => i.analysis && !isLegacySeedAnalysis(i.analysis),
  );
  const analysisContext =
    inspWithAnalysis.length > 0
      ? `
## AI 基础分析参考
以下是对部分参考灵感已生成的 AI 基础分析（基于元信息的文本分析），请在优化时吸收其风格、配色和组件语言：

${inspWithAnalysis
    .map(
      (i) => `- ${i.title}：
  风格：${i.analysis!.styleSummary ?? "—"}
  配色：${i.analysis!.colorAnalysis ?? "—"}
  布局：${i.analysis!.layoutAnalysis ?? "—"}
  组件：${i.analysis!.componentAnalysis ?? "—"}
  关键词：${i.analysis!.designKeywords ?? "—"}`,
    )
    .join("\n\n")}
`
      : "";

  const prefSummary = input.userPreferences
    ? [
        input.userPreferences.preferredStyles?.length ? `偏好风格：${input.userPreferences.preferredStyles.join("、")}` : "",
        input.userPreferences.preferredColors?.length ? `偏好配色：${input.userPreferences.preferredColors.join("、")}` : "",
        input.userPreferences.preferredLayouts?.length ? `偏好布局：${input.userPreferences.preferredLayouts.join("、")}` : "",
      ]
        .filter(Boolean)
        .join("；")
    : "";

  const systemPrompt = `你是高级 UI/UX 设计师、SaaS 产品设计顾问、Next.js 前端工程架构师。你的任务是在不改变用户项目目标的前提下，优化一份给 Claude Code / Codex 使用的 UI 开发提示词。

要求：
1. 输出清晰、具体、可执行、结构化
2. 不要空泛的营销话术
3. 不要过度设计
4. 不要让界面变成廉价后台
5. 保留原有项目的所有技术栈要求
6. 保留原有参考灵感的所有要点
7. 增强设计系统细节的具体性
8. 增强页面要求的可执行性
9. 增强组件规范的实用性
10. 增强禁止风格的明确性`;

  const userPrompt = `请优化以下 UI 开发提示词。

## 项目信息
- 项目名称：${input.projectName}
- 项目类型：${input.projectType}
- 目标用户：${input.targetUsers}
${input.additionalNotes ? `- 补充说明：${input.additionalNotes}` : ""}

## 参考灵感
${inspSummary}

${analysisContext}
## 审美偏好
${prefSummary || "极简 SaaS、中性配色、冷静高效的工具风格"}

${input.promptTemplateId ? `## Prompt 模板
${(() => { const t = getPromptTemplate(input.promptTemplateId); return t ? `使用模板：${t.name} — ${t.description}` : ""; })()}` : ""}

## 避免风格
${input.avoidedStyles.length > 0 ? input.avoidedStyles.join("、") : "廉价蓝白后台、过度渐变、大阴影"}

## 技术栈
${input.techStack.join("、")}

## 需要生成的页面
${input.pageList}

## 需要优化的原始 Prompt

### 完整 Prompt
${baseline.fullPrompt}

请基于以上信息优化为更高质量、更具体、更可执行的版本。必须只输出合法 JSON，格式如下：

{
  "fullPrompt": "...完整优化后的提示词...",
  "designSystemPrompt": "...设计系统部分...",
  "pageLevelPrompt": "...页面要求部分...",
  "componentLevelPrompt": "...组件规范部分...",
  "aiSummary": "...一句话总结你做了哪些优化..."
}`;

  // Step 4: Call DeepSeek
  const result = await generateWithDeepSeek({
    systemPrompt,
    userPrompt,
    temperature: 0.4,
    maxTokens: 6000,
  });

  if (!result.success || !result.content) {
    return {
      ...baseline,
      usedAI: false,
      fallbackReason: result.error ?? "AI 服务返回为空",
    };
  }

  // Step 5: Parse JSON response
  try {
    // Strip markdown code fences if present
    const cleaned = result.content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.fullPrompt || !parsed.designSystemPrompt || !parsed.pageLevelPrompt || !parsed.componentLevelPrompt) {
      return { ...baseline, usedAI: false, fallbackReason: "AI 返回格式不完整，缺少必要字段" };
    }

    return {
      fullPrompt: parsed.fullPrompt,
      designSystemPrompt: parsed.designSystemPrompt,
      pageLevelPrompt: parsed.pageLevelPrompt,
      componentLevelPrompt: parsed.componentLevelPrompt,
      usedAI: true,
      aiSummary: parsed.aiSummary ?? "",
    };
  } catch {
    return { ...baseline, usedAI: false, fallbackReason: "AI 返回 JSON 解析失败，已使用本地模板" };
  }
}
