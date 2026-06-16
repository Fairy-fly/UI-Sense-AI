/**
 * Aesthetic Memory Builder — v1.7
 *
 * Generates a local rule-based aesthetic profile from:
 * - High-rated inspirations (rating >= 4)
 * - UserPreference preferred/avoided styles
 * - AiAnalysis results (color, layout, component, style, keywords)
 * - Tag usage patterns
 *
 * Server-only.
 */

import "server-only";

import { db } from "@/lib/db";
import { displayLabel } from "@/lib/display-labels";

export interface AestheticProfile {
  summary: string;
  preferredStyles: string[];
  preferredColors: string[];
  preferredLayouts: string[];
  preferredComponents: string[];
  avoidedStyles: string[];
  keywords: string[];
  agentInstruction: string;
  sourceCount: number;
}

export async function buildAestheticMemory(): Promise<AestheticProfile | null> {
  // 1. Fetch data
  const [inspirations, pref] = await Promise.all([
    db.inspiration.findMany({
      where: { rating: { gte: 4 } },
      include: { tags: { include: { tag: true } }, analysis: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.userPreference.findFirst(),
  ]);

  if (inspirations.length < 3) {
    return null; // Not enough data
  }

  // 2. Collect tags from high-rated inspirations
  const allTags = inspirations.flatMap((i) => i.tags.map((it) => it.tag.name));
  const tagFreq = countFreq(allTags);

  // 3. Collect keywords from AiAnalysis designKeywords
  const allKeywords = inspirations
    .flatMap((i) => (i.analysis?.designKeywords ?? "").split(/[,，、]/))
    .map((k) => k.trim())
    .filter(Boolean);
  const keywordFreq = countFreq(allKeywords);

  // 4. Extract color/style/layout/component signals from analysis text
  const analysisTexts = inspirations
    .map((i) => [i.analysis?.colorAnalysis, i.analysis?.layoutAnalysis, i.analysis?.componentAnalysis, i.analysis?.styleSummary].filter(Boolean).join(" "))
    .filter(Boolean);

  const combinedAnalysis = analysisTexts.join(" ");

  const preferredStyles = extractStyles(pref, tagFreq, keywordFreq);
  const preferredColors = extractColors(pref, combinedAnalysis);
  const preferredLayouts = extractLayouts(pref, combinedAnalysis);
  const preferredComponents = extractComponents(combinedAnalysis);
  const avoidedStyles = extractAvoided(pref);
  const keywords = Object.keys(keywordFreq).slice(0, 15);

  // 5. Build summary (80-160 chars) with Chinese display labels
  const summary = `${inspirations.length} 个高评分灵感、${inspirations.filter((i) => i.analysis).length} 条 AI 分析生成。偏好风格倾向于${preferredStyles.slice(0, 3).map(displayLabel).join("、")}，配色偏好${preferredColors.slice(0, 3).map(displayLabel).join("、")}，布局偏好${preferredLayouts.slice(0, 2).map(displayLabel).join("、")}。`.slice(0, 180);

  // 6. Build Agent instruction (80-180 chars) with Chinese display labels
  const agentInstruction = `请优先采用${preferredColors.slice(0, 2).map(displayLabel).join("、")}、${preferredLayouts.slice(0, 2).map(displayLabel).join("、")}、克制圆角、轻量阴影。${avoidedStyles.length > 0 ? `避免${avoidedStyles.slice(0, 3).map(displayLabel).join("、")}。` : ""}整体应接近 Linear / Vercel / Raycast 的高级工具感，不要廉价后台模板风格。`.slice(0, 200);

  return {
    summary,
    preferredStyles: preferredStyles.slice(0, 8),
    preferredColors: preferredColors.slice(0, 8),
    preferredLayouts: preferredLayouts.slice(0, 8),
    preferredComponents: preferredComponents.slice(0, 8),
    avoidedStyles: avoidedStyles.slice(0, 8),
    keywords: keywords.slice(0, 12),
    agentInstruction,
    sourceCount: inspirations.length,
  };
}

// ---- Helpers ----

function countFreq(items: string[]): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const item of items) {
    freq[item] = (freq[item] ?? 0) + 1;
  }
  return freq;
}

function safeParse(str: string | null): string[] {
  if (!str) return [];
  try { return JSON.parse(str); } catch { return []; }
}

function extractStyles(
  pref: { preferredStyles: string | null } | null,
  tagFreq: Record<string, number>,
  keywordFreq: Record<string, number>,
): string[] {
  const prefStyles = safeParse(pref?.preferredStyles ?? null);
  const tagStyles = Object.entries(tagFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k]) => k);
  const kwStyles = Object.entries(keywordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  // Unique merge: preferences first, then frequent tags, then keywords
  const seen = new Set<string>();
  const result: string[] = [];
  for (const s of [...prefStyles, ...tagStyles, ...kwStyles]) {
    if (!seen.has(s) && s.length > 1) {
      seen.add(s);
      result.push(s);
    }
  }
  return result.slice(0, 8);
}

const COLOR_SIGNALS = ["低饱和", "中性色", "Slate", "Zinc", "Cool Gray", "Warm Gray", "黑白灰", "蓝紫", "柔和背景", "高对比", "深色模式", "暗色主题", "Neutral", "Muted Purple", "暖灰"];
const LAYOUT_SIGNALS = ["Sidebar", "Content", "Card Grid", "Split Panel", "双栏", "三列", "顶部导航", "Tabs", "侧边栏", "内容区", "网格", "瀑布流"];
const COMPONENT_SIGNALS = ["Card", "Button", "Badge", "Sidebar", "Header", "Tabs", "SearchInput", "FilterBar", "Dialog", "EmptyState", "Skeleton", "Table", "Toast", "Banner", "StatCard"];

function extractColors(pref: { preferredColors: string | null } | null, text: string): string[] {
  const prefColors = safeParse(pref?.preferredColors ?? null);
  const signalColors = COLOR_SIGNALS.filter((s) => text.includes(s));
  const seen = new Set([...prefColors, ...signalColors]);
  return [...seen].slice(0, 6);
}

function extractLayouts(pref: { preferredLayouts: string | null } | null, text: string): string[] {
  const prefLayouts = safeParse(pref?.preferredLayouts ?? null);
  const signalLayouts = LAYOUT_SIGNALS.filter((s) => text.includes(s));
  const seen = new Set([...prefLayouts, ...signalLayouts]);
  return [...seen].slice(0, 6);
}

function extractComponents(text: string): string[] {
  return COMPONENT_SIGNALS.filter((c) => text.includes(c)).slice(0, 8);
}

function extractAvoided(pref: { dislikedStyles: string | null } | null): string[] {
  const avoided = safeParse(pref?.dislikedStyles ?? null);
  if (avoided.length > 0) return avoided.slice(0, 5);
  return ["廉价蓝白后台", "过度渐变", "大阴影", "塑料感按钮"];
}
