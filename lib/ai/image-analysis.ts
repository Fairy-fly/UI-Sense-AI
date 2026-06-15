/**
 * AI Image Analysis — v1.5
 *
 * Thin wrapper that delegates to the analysis provider factory.
 * All provider logic lives in lib/ai/analysis-provider.ts and
 * its implementations (text-analysis-provider, vision-analysis-provider).
 *
 * Server-only.
 */

import "server-only";

import { getAnalysisProvider } from "@/lib/ai/analysis-provider";
import type { AnalysisProviderInput } from "@/lib/ai/analysis-provider";

/** Re-export for backward compatibility */
export type { AnalysisProviderInput as AnalysisInput } from "@/lib/ai/analysis-provider";

export interface AnalysisResult {
  colorAnalysis: string;
  layoutAnalysis: string;
  componentAnalysis: string;
  styleSummary: string;
  designKeywords: string;
  analysisMode?: "text" | "vision";
}

export async function generateImageAnalysis(input: AnalysisProviderInput): Promise<{
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}> {
  const provider = getAnalysisProvider();
  return provider.analyze(input);
}
