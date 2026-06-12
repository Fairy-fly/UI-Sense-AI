/**
 * AI Configuration — Server-side only.
 * Read env vars and return safe status (no key exposure).
 */

import "server-only";

export function getAIProviderStatus() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";

  return {
    configured: Boolean(apiKey && apiKey.length > 0),
    provider: "DeepSeek" as const,
    baseURL,
    model,
  };
}
