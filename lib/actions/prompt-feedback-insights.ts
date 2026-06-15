"use server";

import { computePromptFeedbackInsights } from "@/lib/prompt-feedback-insights";

export async function getPromptFeedbackInsights() {
  return computePromptFeedbackInsights();
}
