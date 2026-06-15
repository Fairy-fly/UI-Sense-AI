/**
 * AI Image Analysis — v1.4
 *
 * Text-based UI analysis using inspiration metadata.
 * Current model (deepseek-v4-flash) is text-only, so analysis is
 * generated from title, tags, notes, project type, and source context.
 * Structured for future multimodal model upgrade.
 *
 * Server-only.
 */

import "server-only";

import { generateWithDeepSeek, isDeepSeekConfigured } from "@/lib/ai/deepseek";

export interface AnalysisInput {
  title: string;
  projectType: string | null;
  tags: string[];
  notes: string | null;
  sourceUrl: string | null;
}

export interface AnalysisResult {
  colorAnalysis: string;
  layoutAnalysis: string;
  componentAnalysis: string;
  styleSummary: string;
  designKeywords: string;
}

export async function generateImageAnalysis(input: AnalysisInput): Promise<{
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}> {
  if (!isDeepSeekConfigured()) {
    return { success: false, error: "未配置 DEEPSEEK_API_KEY，请在 .env.local 中设置" };
  }

  const systemPrompt = `你是一名资深 UI/UX 设计分析师。你的任务是根据提供的 UI 截图元信息，生成一份结构化的中文设计分析。

分析规则：
1. 从标题、标签、备注、项目类型中推断 UI 的设计风格
2. 基于标签和项目类型推断配色方案
3. 推断可能的布局结构（侧边栏、网格、卡片等）
4. 推断可能使用的 UI 组件
5. 总结整体设计风格
6. 提取设计关键词

注意：
- 分析应该具体、专业，不要空泛
- 所有输出使用简体中文
- designKeywords 字段请使用中文关键词（允许保留 SaaS、AI、CRM、B2B 等行业缩写，但不要输出整组英文关键词）
- 不要编造不存在的细节
- 基于元信息做合理推断`;

  const userPrompt = `请分析以下 UI 界面的设计特征：

## 基本信息
- 标题：${input.title}
- 项目类型：${input.projectType ?? "未知"}
${input.sourceUrl ? `- 来源：${input.sourceUrl}` : ""}
- 标签：${input.tags.length > 0 ? input.tags.join("、") : "无"}
${input.notes ? `- 备注：${input.notes}` : ""}

请只输出合法 JSON，格式如下：

{
  "colorAnalysis": "配色分析（50-150字简体中文）：主色调、对比度、色彩情绪",
  "layoutAnalysis": "布局分析（50-150字简体中文）：整体结构、网格系统、空间分配",
  "componentAnalysis": "组件分析（50-150字简体中文）：关键UI组件及其特征",
  "styleSummary": "风格总结（50-150字简体中文）：整体美学方向、设计语言",
  "designKeywords": "设计关键词（使用中文逗号分隔，8-15个中文关键词，允许保留SaaS/AI/CRM/B2B等行业缩写）"
}`;

  const result = await generateWithDeepSeek({
    systemPrompt,
    userPrompt,
    temperature: 0.5,
    maxTokens: 2000,
  });

  if (!result.success || !result.content) {
    return { success: false, error: result.error ?? "AI 分析生成失败" };
  }

  try {
    const cleaned = result.content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.colorAnalysis || !parsed.layoutAnalysis || !parsed.componentAnalysis || !parsed.styleSummary || !parsed.designKeywords) {
      return { success: false, error: "AI 返回格式不完整，请重试" };
    }

    return {
      success: true,
      data: {
        colorAnalysis: String(parsed.colorAnalysis).slice(0, 500),
        layoutAnalysis: String(parsed.layoutAnalysis).slice(0, 500),
        componentAnalysis: String(parsed.componentAnalysis).slice(0, 500),
        styleSummary: String(parsed.styleSummary).slice(0, 500),
        designKeywords: String(parsed.designKeywords).slice(0, 300),
      },
    };
  } catch {
    return { success: false, error: "AI 返回 JSON 解析失败，请重试" };
  }
}
