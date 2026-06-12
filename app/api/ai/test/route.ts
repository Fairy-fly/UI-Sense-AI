/**
 * AI Test API
 * POST /api/ai/test — test DeepSeek connection
 * GET — 405 Method Not Allowed
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method Not Allowed" },
    { status: 405 },
  );
}

export async function POST() {
  // Dynamic import to avoid module-level openai loading on GET
  const { testDeepSeekConnection } = await import("@/lib/ai/deepseek");
  const result = await testDeepSeekConnection();

  if (!result.success) {
    let status = 500;
    if (result.error?.includes("未配置")) status = 400;
    else if (result.error?.includes("无效")) status = 401;
    else if (result.error?.includes("频繁") || result.error?.includes("额度")) status = 429;
    else if (result.error?.includes("不可用")) status = 503;

    return NextResponse.json({ success: false, error: result.error }, { status });
  }

  return NextResponse.json({
    success: true,
    model: result.model,
    message: result.content,
    usage: result.usage,
  });
}

export const dynamic = "force-dynamic";
