/**
 * Vision Analysis Provider — v1.5
 *
 * Placeholder for future multimodal image analysis.
 * Current implementation: auto-degrades to text analysis if:
 * - No vision model configured
 * - No local image available
 * - Vision API call fails
 *
 * Safe image handling:
 * - Only reads local public/uploads/ images
 * - Does NOT read arbitrary file paths
 * - Does NOT read remote URLs
 * - Does NOT log image base64 content
 *
 * Server-only.
 */

import "server-only";

import { existsSync, statSync } from "fs";
import { join } from "path";
import { TextAnalysisProvider } from "@/lib/ai/text-analysis-provider";
import type { AnalysisProvider, AnalysisProviderInput, AnalysisProviderResult } from "@/lib/ai/analysis-provider";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

export class VisionAnalysisProvider implements AnalysisProvider {
  readonly name = "vision";

  private textProvider = new TextAnalysisProvider();

  async analyze(input: AnalysisProviderInput): Promise<{
    success: boolean;
    data?: AnalysisProviderResult;
    error?: string;
  }> {
    const visionModel = process.env.VISION_MODEL;
    const visionKey = process.env.VISION_API_KEY;

    // Degrade to text if no vision config or no image
    if (!visionModel || !visionKey) {
      return this.degradeToText(input, "未配置视觉模型，已使用基础文本分析");
    }

    if (!input.imagePath) {
      return this.degradeToText(input, "无本地图片，已使用基础文本分析");
    }

    // Safety: only allow local uploads path
    const imagePath = input.imagePath;
    if (!imagePath.startsWith("/uploads/")) {
      return this.degradeToText(input, "仅支持本地上传图片分析");
    }

    // Safety: resolve to public directory and check existence
    const localPath = join(process.cwd(), "public", imagePath);
    if (!existsSync(localPath)) {
      return this.degradeToText(input, "图片文件不存在，已使用基础文本分析");
    }

    // Safety: check file size
    try {
      const stat = statSync(localPath);
      if (stat.size > MAX_IMAGE_BYTES) {
        return this.degradeToText(input, "图片过大（超过 5MB），已使用基础文本分析");
      }
    } catch {
      return this.degradeToText(input, "无法读取图片，已使用基础文本分析");
    }

    // Vision API call not yet implemented — degrade safely
    return this.degradeToText(input, "视觉分析模块尚未接入，已使用基础文本分析");
  }

  private async degradeToText(
    input: AnalysisProviderInput,
    reason: string,
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
    return { success: false, error: `${reason}；文本分析也失败：${result.error ?? "未知错误"}` };
  }
}
