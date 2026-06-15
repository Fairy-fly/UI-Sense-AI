/**
 * AI Analysis Utilities — v1.4
 *
 * Helpers for working with AiAnalysis data.
 */

import type { AiAnalysis } from "@/types";

/**
 * Detect legacy seed analysis — old English seed data written before v1.4.
 * These should not be displayed as if they were user-generated AI analysis.
 *
 * Returns true if the analysis is likely legacy seed data.
 */
export function isLegacySeedAnalysis(analysis: AiAnalysis | null | undefined): boolean {
  if (!analysis) return false;

  // Concatenate all analysis text fields
  const combined = [
    analysis.colorAnalysis ?? "",
    analysis.layoutAnalysis ?? "",
    analysis.componentAnalysis ?? "",
    analysis.styleSummary ?? "",
    analysis.designKeywords ?? "",
  ].join(" ");

  if (!combined.trim()) return false;

  // Count CJK characters — if more than a threshold, treat as user-generated Chinese analysis
  const cjkCount = (combined.match(/[一-鿿㐀-䶿]/g) ?? []).length;
  if (cjkCount >= 5) return false; // Has real Chinese content

  // Seed phrases commonly found in legacy English seed data
  const seedPhrases = [
    "Minimal SaaS dashboard",
    "Neutral grayscale",
    "Three-column layout",
    "Keyboard-first",
    "exceptional information density",
    "zinc-900",
    "command menu",
    "drag-and-drop",
    "activity-graph",
    "file-tree",
    "semantic-color",
    "markdown",
    "diff-viewer",
    "developer-hub",
    "sidebar-layout",
    "card-grid",
    "warm-neutral",
    "calm-productivity",
    "premium-tool",
    "low-saturation",
  ];

  const lower = combined.toLowerCase();
  for (const phrase of seedPhrases) {
    if (lower.includes(phrase.toLowerCase())) return true;
  }

  // If text is predominantly ASCII and has no CJK, treat as legacy
  const asciiCount = (combined.match(/[a-zA-Z]/g) ?? []).length;
  if (asciiCount > 20 && cjkCount === 0) return true;

  return false;
}
