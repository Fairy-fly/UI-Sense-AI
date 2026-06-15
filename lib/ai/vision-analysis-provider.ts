/**
 * Vision Analysis Provider — v1.6
 *
 * Real multimodal image analysis via OpenAI-compatible vision API
 * (e.g. Alibaba Cloud Bailian / DashScope).
 *
 * Safety guarantees:
 * - Only reads local /uploads/ images
 * - No base64 logging
 * - No API key exposure
 * - Auto-degrades to TextAnalysisProvider on any failure
 *
 * Server-only.
 */

import "server-only";

import { readFileSync } from "fs";
import { join } from "path";
import { TextAnalysisProvider } from "@/lib/ai/text-analysis-provider";
import type { AnalysisProvider, AnalysisProviderInput, AnalysisProviderResult } from "@/lib/ai/analysis-provider";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

export class VisionAnalysisProvider implements AnalysisProvider {
  readonly name = "vision";

  private textProvider = new TextAnalysisProvider();

  async analyze(input: AnalysisProviderInput): Promise<{
    success: boolean;
    data?: AnalysisProviderResult;
    error?: string;
  }> {
    // ---- Pre-flight checks: degrade to text if any condition fails ----
    const visionModel = process.env.VISION_MODEL;
    const visionBaseUrl = process.env.VISION_API_BASE_URL;
    const visionKey = process.env.VISION_API_KEY;

    if (!visionModel || !visionBaseUrl || !visionKey) {
      return this.degradeToText(input);
    }

    if (!input.imagePath) {
      return this.degradeToText(input);
    }

    if (!input.imagePath.startsWith("/uploads/")) {
      return this.degradeToText(input);
    }

    // ---- Read and validate image file ----
    const localPath = join(process.cwd(), "public", input.imagePath);

    let imageBuffer: Buffer;
    try {
      const fs = await import("fs");
      if (!fs.existsSync(localPath)) {
        return this.degradeToText(input);
      }
      const stat = fs.statSync(localPath);
      if (stat.size > MAX_IMAGE_BYTES) {
        return this.degradeToText(input);
      }
      imageBuffer = readFileSync(localPath);
    } catch {
      return this.degradeToText(input);
    }

    // Determine MIME type from extension
    const ext = localPath.slice(localPath.lastIndexOf(".")).toLowerCase();
    const mimeType = ALLOWED_MIME_TYPES[ext];
    if (!mimeType) {
      return this.degradeToText(input);
    }

    // ---- Build base64 data URL ----
    const base64 = imageBuffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // ---- Build prompts ----
    const systemPrompt = `你是一名资深 UI/UX 设计分析师和前端架构顾问。你的任务是分析这张 UI 截图，生成一份高度具体、可执行的结构化中文设计分析报告。

核心原则：
- 必须基于截图中真实可见的内容，不确定时用"可能"或"倾向于"
- 不要编造截图中看不到的 UI 元素
- 每个字段至少 80 字、最多 260 字，避免空泛描述
- 优先提取可复用到 Tailwind / shadcn / Next.js 项目的具体信息
- 参考标题和标签只能作为辅助线索，截图观察优先

输出格式：
- 只输出合法 JSON，不要输出 Markdown 或代码块
- 不要输出解释文字或 \`\`\`json 标记
- 所有字段值使用简体中文
- designKeywords 使用中文，允许保留 SaaS、AI、CRM、B2B 等行业缩写`;

    const userPrompt = `请分析这张 UI 截图的设计特征。

${input.title ? `参考标题：${input.title}` : ""}
${input.projectType ? `项目类型：${input.projectType}` : ""}
${input.tags.length > 0 ? `参考标签：${input.tags.join("、")}` : ""}
${input.notes ? `用户备注：${input.notes}（辅助参考，不可当作截图事实）` : ""}

## JSON 格式（每个字段 80-260 字）

{
  "colorAnalysis": "配色分析：主背景色倾向、主/次文字颜色、品牌强调色、按钮/标签/提示状态色、对比度强弱、适配 Tailwind/shadcn 的配色建议。至少提到 2 个截图可见细节。",
  "layoutAnalysis": "布局分析：页面整体结构（导航方式+内容区排布）、信息层级、卡片/列表/表格/筛选区排列、留白节奏、是否适配移动端。可复用的布局实现建议。至少提到 2 个截图可见细节。",
  "componentAnalysis": "组件分析：真实可见的组件清单及视觉特征（Sidebar/Header/Card/Tabs/Badge/Button/Input/Search/Table/Toast/EmptyState 等）、圆角/边框/阴影/密度感、哪些体现高级感或廉价感。至少提到 3 个组件。",
  "styleSummary": "风格总结：整体设计风格判断、适合什么类型产品、最值得借鉴的 3 个设计特征、对用户项目的迁移建议、偏高级克制/工具型/信息密集/营销感/移动端中的哪种。",
  "designKeywords": "设计关键词（10-20个中文逗号分隔）：避免泛词如美观/好看/清晰，推荐：低饱和配色、卡片网格、左侧导航、轻量阴影、高信息密度、shadcn风格、SaaS仪表盘、AI工具界面、克制圆角、分组标题、状态标签、紧凑列表等"
}

注意：
1. 每个字段至少 80 字，不确定的用"可能"或"倾向于"
2. 不要输出 Markdown、代码块或解释文字
3. 只输出 JSON`;

    // ---- Call vision API ----
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      const res = await fetch(`${visionBaseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${visionKey}`,
        },
        body: JSON.stringify({
          model: visionModel,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: userPrompt },
                { type: "image_url", image_url: { url: dataUrl } },
              ],
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const status = res.status;
        // 400 may indicate model doesn't support images — degrade silently
        if (status === 400) {
          return this.degradeToText(input);
        }
        // Auth/rate-limit/server errors — degrade
        return this.degradeToText(input);
      }

      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content?.trim();

      if (!content) {
        return this.degradeToText(input);
      }

      // Parse JSON from response with resilience
      let cleaned = content
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();

      // If model wrapped JSON in extra text, extract just the { ... } block
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(cleaned);

      if (!parsed.colorAnalysis || !parsed.layoutAnalysis || !parsed.componentAnalysis || !parsed.styleSummary || !parsed.designKeywords) {
        return this.degradeToText(input);
      }

      return {
        success: true,
        data: {
          colorAnalysis: String(parsed.colorAnalysis).slice(0, 500),
          layoutAnalysis: String(parsed.layoutAnalysis).slice(0, 500),
          componentAnalysis: String(parsed.componentAnalysis).slice(0, 500),
          styleSummary: String(parsed.styleSummary).slice(0, 500),
          designKeywords: String(parsed.designKeywords).slice(0, 300),
          analysisMode: "vision",
        },
      };
    } catch {
      // Network error, timeout, JSON parse failure — all degrade
      return this.degradeToText(input);
    }
  }

  private async degradeToText(
    input: AnalysisProviderInput,
  ): Promise<{
    success: boolean;
    data?: AnalysisProviderResult;
    error?: string;
  }> {
    const result = await this.textProvider.analyze(input);
    if (result.success && result.data) {
      return {
        success: true,
        data: {
          ...result.data,
          analysisMode: "text",
        },
      };
    }
    return result as { success: false; error: string };
  }
}
