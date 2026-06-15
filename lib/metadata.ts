/**
 * URL Metadata utilities — v1.3.3.1
 *
 * URL validation, HTML fetching, metadata extraction, and security hardening.
 * Server-only — uses fetch with server-side User-Agent.
 */

export interface UrlMetadata {
  title: string;
  description: string | null;
  hostname: string;
  faviconUrl: string | null;
  ogImage: string | null;
}

// ---- URL validation ----

/** Check if a URL uses a safe protocol and is publicly accessible. */
export function isSafePublicHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

    const hostname = parsed.hostname.toLowerCase();

    // Block IP-based localhost and private ranges
    if (isBlockedHostname(hostname)) return false;
    if (isPrivateIPv4(hostname)) return false;

    // Block IPv6 localhost
    if (hostname === "::1") return false;

    return true;
  } catch {
    return false;
  }
}

/** Normalize a URL — add https:// if missing, trim whitespace. */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

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

// ---- Hostname / IP blocking ----

/** Check if hostname is a known internal/private name. */
export function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();

  // Exact matches
  if (["localhost", "0.0.0.0", "::1"].includes(lower)) return true;

  // Internal TLD-like suffixes
  if (lower.endsWith(".local") || lower.endsWith(".internal") || lower.endsWith(".lan")) return true;

  return false;
}

/** Check if a hostname is a private/internal IPv4 address. */
export function isPrivateIPv4(hostname: string): boolean {
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = hostname.match(ipv4Regex);
  if (!match) return false;

  const octets = [match[1], match[2], match[3], match[4]].map(Number);

  // Validate each octet
  if (octets.some((o) => isNaN(o) || o < 0 || o > 255)) return false;

  const [a, b] = octets;

  // 10.0.0.0/8
  if (a === 10) return true;
  // 172.16.0.0/12
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.168.0.0/16
  if (a === 192 && b === 168) return true;
  // 169.254.0.0/16 (link-local)
  if (a === 169 && b === 254) return true;
  // 127.0.0.0/8 (loopback)
  if (a === 127) return true;
  // 0.0.0.0
  if (a === 0 && b === 0 && octets[2] === 0 && octets[3] === 0) return true;

  return false;
}

// ---- URL resolution ----

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

// ---- HTML body reading with size limit ----

const MAX_BODY_BYTES = 1_048_576; // 1MB

export async function readResponseBodyLimited(response: Response): Promise<{ text: string; truncated: boolean }> {
  const reader = response.body?.getReader();
  if (!reader) {
    // Fallback: no stream available
    const text = await response.text();
    return { text: text.slice(0, MAX_BODY_BYTES), truncated: text.length > MAX_BODY_BYTES };
  }

  const decoder = new TextDecoder();
  let result = "";
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.length;
    if (totalBytes > MAX_BODY_BYTES) {
      // Read only up to the limit
      const remaining = MAX_BODY_BYTES - (totalBytes - value.length);
      if (remaining > 0) {
        result += decoder.decode(value.slice(0, remaining), { stream: true });
      }
      reader.cancel();
      return { text: result, truncated: true };
    }
    result += decoder.decode(value, { stream: true });
  }

  // Final flush
  result += decoder.decode();
  return { text: result.slice(0, MAX_BODY_BYTES), truncated: false };
}

// ---- Metadata extraction ----

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
  const iconMatch =
    html.match(/<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["'][^>]*>/i) ??
    html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>/i);

  if (iconMatch?.[1]) {
    faviconUrl = resolveUrl(baseUrl, iconMatch[1]);
  }

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

  const revRegex = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${escapedValue}["'][^>]*>`,
    "i",
  );
  const revMatch = html.match(revRegex);
  return revMatch?.[1]?.trim() ?? null;
}
