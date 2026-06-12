/**
 * AI Provider abstraction layer.
 *
 * This module provides a unified interface for AI-powered UI analysis
 * and prompt generation. Phase 6 will implement the actual provider.
 *
 * Supported providers (future):
 * - DeepSeek
 * - OpenAI
 * - Claude (Anthropic)
 * - Gemini (Google)
 */

export type { AiProvider, AiAnalysisResult, PromptBuilderInput, PromptBuilderOutput } from "@/types";

// Phase 6 will implement:
// export { deepseekProvider } from "./deepseek";
// export { createAiProvider } from "./factory";
