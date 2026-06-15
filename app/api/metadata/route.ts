/**
 * POST /api/metadata — v1.3.3.1
 *
 * Fetch and extract metadata (title, description, favicon, og:image)
 * from a given URL. Security hardened:
 * - Blocks localhost, private IPs, internal hostnames
 * - Blocks redirects (redirect: "manual")
 * - Limits response body to 1MB
 * - 8s timeout
 */
import { NextResponse } from "next/server";
import {
  normalizeUrl,
  isSafePublicHttpUrl,
  readResponseBodyLimited,
  extractMetadataFromHtml,
} from "@/lib/metadata";

const FETCH_TIMEOUT_MS = 8000;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const url = body?.url;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json({ success: false, error: "请提供有效的网页链接" }, { status: 400 });
    }

    const normalized = normalizeUrl(url);
    if (!normalized) {
      return NextResponse.json({ success: false, error: "仅支持 http/https 链接" }, { status: 400 });
    }

    if (!isSafePublicHttpUrl(normalized)) {
      return NextResponse.json({ success: false, error: "不支持访问本地或内网地址" }, { status: 400 });
    }

    // Fetch HTML with timeout, no auto-redirect
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(normalized, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; UISenseAI/1.0; +https://github.com/Fairy-fly/UI-Sense-AI)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "manual",
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        return NextResponse.json({ success: false, error: "读取超时，请手动填写" }, { status: 200 });
      }
      return NextResponse.json({ success: false, error: "无法访问该网页，请检查链接是否正确" }, { status: 200 });
    }
    clearTimeout(timeoutId);

    // Block redirect responses
    if (response.status >= 300 && response.status < 400) {
      return NextResponse.json(
        { success: false, error: "暂不支持重定向链接，请填写最终地址" },
        { status: 200 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `网页返回错误 (${response.status})` },
        { status: 200 },
      );
    }

    // Only parse HTML content
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return NextResponse.json({ success: false, error: "该链接不是网页，请手动填写" }, { status: 200 });
    }

    // Read body with 1MB limit
    const { text: html, truncated } = await readResponseBodyLimited(response);

    if (truncated) {
      return NextResponse.json({ success: false, error: "网页内容过大，请手动填写" }, { status: 200 });
    }

    if (!html || html.length < 100) {
      return NextResponse.json({ success: false, error: "网页内容为空，请手动填写" }, { status: 200 });
    }

    const metadata = extractMetadataFromHtml(html, normalized);

    return NextResponse.json({ success: true, data: metadata });
  } catch {
    return NextResponse.json({ success: false, error: "读取失败，请重试" }, { status: 500 });
  }
}
