/**
 * DeepSeek AI Client
 *
 * Server-side only. Uses OpenAI-compatible API via openai SDK.
 * Never import this in client components.
 */

import "server-only";

import OpenAI from "openai";

// ---- Config from env ----
function getConfig() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
  const temperature = parseFloat(process.env.DEEPSEEK_TEMPERATURE || "0.4");
  const maxTokens = parseInt(process.env.DEEPSEEK_MAX_TOKENS || "6000", 10);
  const timeoutMs = parseInt(process.env.DEEPSEEK_TIMEOUT_MS || "45000", 10);

  return { apiKey, baseURL, model, temperature, maxTokens, timeoutMs };
}

// ---- Types ----
export interface AICallResult {
  success: boolean;
  content?: string;
  model?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  error?: string;
}

// ---- Test Connection ----
export async function testDeepSeekConnection(): Promise<AICallResult> {
  const config = getConfig();

  if (!config.apiKey) {
    return { success: false, error: "未配置 DEEPSEEK_API_KEY，请在 .env.local 中设置" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    const client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });

    const response = await client.chat.completions.create(
      {
        model: config.model,
        messages: [{ role: "user", content: "请只回复：连接成功" }],
        max_tokens: 20,
        temperature: 0,
      },
      { signal: controller.signal },
    );

    clearTimeout(timeout);
    const content = response.choices[0]?.message?.content?.trim() || "";

    return {
      success: true,
      content,
      model: response.model,
      usage: {
        promptTokens: response.usage?.prompt_tokens ?? undefined,
        completionTokens: response.usage?.completion_tokens ?? undefined,
        totalTokens: response.usage?.total_tokens ?? undefined,
      },
    };
  } catch (error: unknown) {
    return handleAIError(error);
  }
}

// ---- Generate with DeepSeek ----
export interface GenerateOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export async function generateWithDeepSeek(options: GenerateOptions): Promise<AICallResult> {
  const config = getConfig();

  if (!config.apiKey) {
    return { success: false, error: "未配置 DEEPSEEK_API_KEY" };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    const client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });

    const response = await client.chat.completions.create(
      {
        model: config.model,
        messages: [
          { role: "system", content: options.systemPrompt },
          { role: "user", content: options.userPrompt },
        ],
        temperature: options.temperature ?? config.temperature,
        max_tokens: options.maxTokens ?? config.maxTokens,
      },
      { signal: controller.signal },
    );

    clearTimeout(timeout);
    const content = response.choices[0]?.message?.content?.trim() || "";

    return {
      success: true,
      content,
      model: response.model,
      usage: {
        promptTokens: response.usage?.prompt_tokens ?? undefined,
        completionTokens: response.usage?.completion_tokens ?? undefined,
        totalTokens: response.usage?.total_tokens ?? undefined,
      },
    };
  } catch (error: unknown) {
    return handleAIError(error);
  }
}

// ---- Error Handler ----
function handleAIError(error: unknown): AICallResult {
  // Don't log full error object — may contain API key in request headers
  if (error && typeof error === "object" && "status" in error) {
    const e = error as { status?: number; message?: string };
    const status = e.status;

    if (status === 401) {
      console.error("DeepSeek API: 401 Unauthorized (invalid key)");
      return { success: false, error: "API Key 无效，请检查 DEEPSEEK_API_KEY 配置" };
    }
    if (status === 429) {
      console.error("DeepSeek API: 429 Rate limited");
      return { success: false, error: "请求过于频繁或 API 额度不足，请稍后重试" };
    }
    if (status === 500 || status === 502 || status === 503) {
      console.error(`DeepSeek API: ${status} Server error`);
      return { success: false, error: "DeepSeek 服务暂时不可用，请稍后重试" };
    }
  }

  if (error && typeof error === "object" && "name" in error) {
    const e = error as { name?: string };
    if (e.name === "AbortError" || e.name === "TimeoutError") {
      console.error("DeepSeek API: Request timed out");
      return { success: false, error: "DeepSeek 响应超时，已使用本地模板" };
    }
  }

  if (error && typeof error === "object" && "code" in error) {
    const e = error as { code?: string };
    if (e.code === "ETIMEDOUT" || e.code === "ECONNRESET") {
      console.error("DeepSeek API: Connection timeout");
      return { success: false, error: "连接超时，请检查网络后重试" };
    }
  }

  console.error("DeepSeek API: Unknown error");
  return { success: false, error: "AI 服务调用失败，请稍后重试" };
}

// ---- Check if API key is configured ----
export function isDeepSeekConfigured(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY);
}
