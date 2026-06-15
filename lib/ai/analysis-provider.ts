/**
 * Analysis Provider Interface — v1.5
 *
 * Abstraction layer for AI UI analysis.
 * Supports text-based analysis (current default) and future vision-based analysis.
 * Provider selection is automatic based on configuration.
 *
 * Server-only.
 */

import "server-only";

import { TextAnalysisProvider } from "@/lib/ai/text-analysis-provider";
import { VisionAnalysisProvider } from "@/lib/ai/vision-analysis-provider";

export interface AnalysisProviderInput {
  title: string;
  projectType: string | null;
  tags: string[];
  notes: string | null;
  sourceUrl: string | null;
  /** Local image path (public/uploads/...) for vision analysis. */
  imagePath?: string | null;
}

export interface AnalysisProviderResult {
  colorAnalysis: string;
  layoutAnalysis: string;
  componentAnalysis: string;
  styleSummary: string;
  designKeywords: string;
  /** Analysis mode: "text" or "vision". */
  analysisMode: "text" | "vision";
}

export interface AnalysisProvider {
  readonly name: string;
  analyze(input: AnalysisProviderInput): Promise<{
    success: boolean;
    data?: AnalysisProviderResult;
    error?: string;
  }>;
}

// ---- Factory ----

let cachedProvider: AnalysisProvider | null = null;

/** Get the appropriate analysis provider based on configuration. */
export function getAnalysisProvider(): AnalysisProvider {
  if (cachedProvider) return cachedProvider;

  const mode = process.env.AI_ANALYSIS_MODE || "text";

  if (mode === "vision") {
    cachedProvider = new VisionAnalysisProvider();
  } else {
    cachedProvider = new TextAnalysisProvider();
  }

  return cachedProvider;
}
