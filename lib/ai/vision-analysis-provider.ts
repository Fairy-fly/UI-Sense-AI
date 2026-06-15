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
    const systemPrompt = `你是一名资深 UI/UX 设计分析师和前端架构顾问。你的任务是分析这张 UI 截图，生成结构化的中文设计分析报告。

分析规则：
1. 观察页面整体结构、导航方式、内容排布
2. 识别卡片、表格、列表、按钮、输入框等 UI 组件
3. 分析配色方案、对比度、留白、圆角、阴影等视觉特征
4. 判断字体层级、信息密度和阅读节奏
5. 判断整体视觉风格（SaaS、AI 工具、Dashboard、移动端、作品集等）
6. 总结值得借鉴的设计优点
7. 提取设计关键词

注意：
- 所有输出使用简体中文
- 分析应该具体、专业，基于截图中真实可见的内容
- 不要编造截图中看不到的元素
- designKeywords 使用中文关键词，允许保留 SaaS、AI、CRM、B2B 等行业缩写
- 输出必须是合法 JSON`;

    const userPrompt = `请分析这张 UI 截图的设计特征。

${input.title ? `参考标题：${input.title}` : ""}
${input.projectType ? `项目类型：${input.projectType}` : ""}
${input.tags.length > 0 ? `参考标签：${input.tags.join("、")}` : ""}
${input.notes ? `用户备注：${input.notes}` : ""}

请只输出合法 JSON，格式如下：

{
  "colorAnalysis": "配色分析（50-200字简体中文）：主色调、对比度、色彩情绪、明暗模式",
  "layoutAnalysis": "布局分析（50-200字简体中文）：整体结构、导航方式、网格系统、空间分配",
  "componentAnalysis": "组件分析（50-200字简体中文）：关键UI组件类型及其视觉特征",
  "styleSummary": "风格总结（50-200字简体中文）：整体美学方向、设计语言、产品气质",
  "designKeywords": "设计关键词（使用中文逗号分隔，10-20个中文关键词，允许SaaS/AI/B2B等缩写）"
}`;

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

      // Parse JSON from response
      const cleaned = content
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();

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
