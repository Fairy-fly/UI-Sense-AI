/**
 * POST /api/metadata — v1.3.3
 *
 * Fetch and extract metadata (title, description, favicon, og:image)
 * from a given URL.
 */
import { NextResponse } from "next/server";
import { normalizeUrl, isSafeHttpUrl, extractMetadataFromHtml } from "@/lib/metadata";

const FETCH_TIMEOUT_MS = 8000;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const url = body?.url;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json({ success: false, error: "请提供有效的网页链接" }, { status: 400 });
    }

    const normalized = normalizeUrl(url);
    if (!normalized || !isSafeHttpUrl(normalized)) {
      return NextResponse.json({ success: false, error: "仅支持 http/https 链接" }, { status: 400 });
    }

    // Fetch HTML with timeout
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
        redirect: "follow",
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        return NextResponse.json({ success: false, error: "读取超时，请手动填写" }, { status: 200 });
      }
      return NextResponse.json({ success: false, error: "无法访问该网页，请检查链接是否正确" }, { status: 200 });
    }
    clearTimeout(timeoutId);

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

    const html = await response.text();
    if (!html || html.length < 100) {
      return NextResponse.json({ success: false, error: "网页内容为空，请手动填写" }, { status: 200 });
    }

    const metadata = extractMetadataFromHtml(html, normalized);

    return NextResponse.json({ success: true, data: metadata });
  } catch {
    return NextResponse.json({ success: false, error: "读取失败，请重试" }, { status: 500 });
  }
}
