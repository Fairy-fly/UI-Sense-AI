/**
 * URL Metadata utilities — v1.3.3
 *
 * URL validation, HTML fetching, and metadata extraction.
 * Server-only — uses fetch with server-side User-Agent.
 */

export interface UrlMetadata {
  title: string;
  description: string | null;
  hostname: string;
  faviconUrl: string | null;
  ogImage: string | null;
}

/** Check if a URL uses a safe protocol. */
export function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Normalize a URL — add https:// if missing, trim whitespace. */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Add protocol if missing
  let url = trimmed;
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed.href;
  } catch {
    return null;
  }
}

/** Resolve a potentially relative URL against a base URL. */
export function resolveUrl(base: string, path: string | null | undefined): string | null {
  if (!path) return null;
  try {
    return new URL(path, base).href;
  } catch {
    return null;
  }
}

/** Generate a fallback favicon URL using Google's favicon service. */
export function getFallbackFaviconUrl(hostname: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=32`;
}

/** Extract metadata from raw HTML string. */
export function extractMetadataFromHtml(html: string, baseUrl: string): UrlMetadata {
  const hostname = new URL(baseUrl).hostname;

  // Extract <title>
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const rawTitle = titleMatch?.[1]?.trim() ?? "";

  // Extract meta tags
  const ogTitle = getMetaContent(html, "property", "og:title");
  const ogDescription = getMetaContent(html, "property", "og:description");
  const metaDescription = getMetaContent(html, "name", "description");
  const ogImage = getMetaContent(html, "property", "og:image");

  const title = ogTitle || rawTitle || hostname;
  const description = ogDescription || metaDescription || null;

  // Extract favicon
  let faviconUrl: string | null = null;
  const iconMatch = html.match(
    /<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["'][^>]*>/i,
  ) ||
    html.match(
      /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>/i,
    );

  if (iconMatch?.[1]) {
    faviconUrl = resolveUrl(baseUrl, iconMatch[1]);
  }

  // Fallback favicon
  if (!faviconUrl) {
    faviconUrl = getFallbackFaviconUrl(hostname);
  }

  return {
    title: title.slice(0, 200),
    description: description?.slice(0, 500) ?? null,
    hostname,
    faviconUrl,
    ogImage: ogImage ? resolveUrl(baseUrl, ogImage) : null,
  };
}

/** Helper: extract content from a meta tag by attribute. */
function getMetaContent(html: string, attr: string, value: string): string | null {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `<meta[^>]*${attr}=["']${escapedValue}["'][^>]*content=["']([^"']*)["'][^>]*>`,
    "i",
  );
  const match = html.match(regex);
  if (match?.[1]) return match[1].trim();

  // Try reversed order: content before property/name
  const revRegex = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${escapedValue}["'][^>]*>`,
    "i",
  );
  const revMatch = html.match(revRegex);
  return revMatch?.[1]?.trim() ?? null;
}
