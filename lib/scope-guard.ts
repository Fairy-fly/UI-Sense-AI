/**
 * Scope Guard — Rule-based page/module classifier for prompt generation.
 *
 * v2.1a: Prevents prompt bloat by distinguishing main pages (routes)
 * from in-page modules, with development-phase-aware constraints.
 */

export type DevelopmentPhase = "v0.1" | "v0.2" | "v1.0";

export const developmentPhases: { value: DevelopmentPhase; label: string; maxPages: number }[] = [
  { value: "v0.1", label: "v0.1 — 原型阶段（2-3 个主页面）", maxPages: 3 },
  { value: "v0.2", label: "v0.2 — 功能完善（3-5 个主页面）", maxPages: 5 },
  { value: "v1.0", label: "v1.0 — 正式版本（完整功能）", maxPages: 99 },
];

export interface ScopeItem {
  name: string;
  type: "page" | "module";
  reason?: string;
}

export interface ScopeGuardResult {
  /** All parsed items with classification */
  items: ScopeItem[];
  /** Items classified as main pages (routes) */
  mainPages: string[];
  /** Items classified as in-page modules */
  modules: string[];
  /** Advisory warnings for the user */
  warnings: string[];
  /** Suggested main pages for the current phase (top N by page priority) */
  mustBuildNow: string[];
  /** Pages to defer to next phase */
  deferToNext: string[];
  /** Modules to keep inside pages (not separate routes) */
  modulesAsComponents: string[];
}

/**
 * Keywords strongly indicating an in-page module rather than a standalone route.
 * Matched case-insensitively against item text.
 */
const MODULE_KEYWORDS = [
  // English
  "checklist", "log", "note", "tracker", "timer", "feed", "comment",
  "notification", "activity", "status-badge", "reminder", "suggestion",
  "history", "changelog", "quick-action", "onboarding", "wizard-step",
  "chat", "thread", "review",
  // Design tool / moodboard (v2.1.4)
  "palette", "color palette", "swatch", "typography",
  "font", "fonts", "style tags", "side panel", "notes",
  "favorite", "saved", "export", "share card",
  // Chinese
  "清单", "验收", "日志", "笔记", "备注", "提醒", "风险",
  "下一步", "建议", "通知", "动态", "评论", "讨论",
  "快捷操作", "引导", "状态", "时间线", "阶段", "版本",
  "提交记录", "最近", "更新", "记录",
  // Design tool / moodboard Chinese (v2.1.4)
  "色卡", "色彩", "配色", "主色", "辅助色", "色板", "调色板",
  "颜色提取", "色卡提取",
  "字体", "字体偏好", "字体预览", "字体感受",
  "标签", "风格标签",
  "灵感详情", "灵感信息",
  "检查器", "右侧面板", "详情面板",
  "收藏", "收藏状态", "评分",
  "导出", "导出卡片", "分享卡片",
];

/**
 * Keywords strongly indicating a main page / route.
 * Matched case-insensitively against item text.
 */
const PAGE_KEYWORDS = [
  // English
  "dashboard", "settings", "project", "analytics", "home", "profile",
  "search", "library", "marketplace", "admin", "workspace", "detail",
  "editor", "explorer", "prompt", "inspiration", "collection", "upload",
  "calendar", "inbox", "team", "billing", "integration",
  // Chinese
  "仪表盘", "总览", "概览", "设置", "配置", "项目",
  "分析", "统计", "首页", "个人", "用户", "库",
  "市场", "管理", "工作区", "详情", "编辑器",
  "浏览", "提示词", "灵感", "收藏", "上传",
  "日历", "团队", "集成", "登录", "注册",
];

/**
 * Specific phrases that are ALWAYS in-page modules, even if they also
 * match broad PAGE_KEYWORDS like "详情" or "灵感".
 * These are checked before the normal module/page classification.
 */
const FORCE_MODULE_PATTERNS = [
  // Chinese
  "灵感详情", "灵感信息", "选中详情",
  "右侧面板", "详情面板", "检查器",
  // English equivalents (v2.1.4)
  "inspiration detail", "inspiration info", "selected detail",
  "detail panel", "inspector detail", "side panel",
];

/**
 * Keywords in user's additionalNotes that signal "keep these as modules".
 */
const USER_HINT_MODULE_SIGNALS = [
  "作为页面内模块", "不要拆成独立页面", "不要创建独立路由",
  "放入右侧", "放入详情页", "页面内模块",
];

/**
 * Classify a raw page list string into main pages and modules.
 *
 * Heuristics:
 * 1. Split by comma / ideographic comma / Chinese comma / newline
 * 2. If an item matches FORCE_MODULE_PATTERNS → always module
 * 3. If an item matches MODULE_KEYWORDS but not PAGE_KEYWORDS → module
 * 4. If contextText contains module hints AND item matches MODULE_KEYWORDS → module (overrides PAGE_KEYWORDS)
 * 5. Otherwise → main page (default safe classification)
 * 6. Apply phase constraints for mustBuildNow / deferToNext
 */
export function classifyPageItems(
  rawInput: string,
  phase?: DevelopmentPhase,
  contextText?: string,
): ScopeGuardResult {
  const rawItems = rawInput
    .split(/[,，、\n]/)
    .map((p) => p.trim())
    .filter((p) => {
      if (!p) return false;
      // Filter out section headers / description lines (ending with colon)
      if (/[：:]$/.test(p)) return false;
      // Filter out known metadata labels that aren't page names
      const headerPatterns = /^(页面列表|页面清单|页面|主页面|模块|Pages?|Page List|Page)$/i;
      if (headerPatterns.test(p)) return false;
      return true;
    });

  if (rawItems.length === 0) {
    return {
      items: [],
      mainPages: [],
      modules: [],
      warnings: [],
      mustBuildNow: [],
      deferToNext: [],
      modulesAsComponents: [],
    };
  }

  // Detect user-specified module hints in contextText
  const userWantsModulesInline = contextText
    ? USER_HINT_MODULE_SIGNALS.some((signal) => contextText.includes(signal))
    : false;

  const items: ScopeItem[] = [];
  const mainPages: string[] = [];
  const modules: string[] = [];

  for (const item of rawItems) {
    const lower = item.toLowerCase();

    // Step 1: Force-module patterns always win
    const isForceModule = FORCE_MODULE_PATTERNS.some((kw) => lower.includes(kw.toLowerCase()));
    if (isForceModule) {
      items.push({ name: item, type: "module", reason: "匹配强制模块关键词" });
      modules.push(item);
      continue;
    }

    const matchedModule = MODULE_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
    const matchedPage = PAGE_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));

    // Step 2: If user explicitly wants modules inline, module keywords override page keywords
    if (userWantsModulesInline && matchedModule) {
      const triggeringKw = MODULE_KEYWORDS.find((kw) => lower.includes(kw.toLowerCase()));
      items.push({ name: item, type: "module", reason: triggeringKw ? `匹配模块关键词「${triggeringKw}」（用户已指定模块内聚）` : undefined });
      modules.push(item);
      continue;
    }

    // Step 3: Normal classification
    if (matchedModule && !matchedPage) {
      const triggeringKw = MODULE_KEYWORDS.find((kw) => lower.includes(kw.toLowerCase()));
      items.push({ name: item, type: "module", reason: triggeringKw ? `匹配模块关键词「${triggeringKw}」` : undefined });
      modules.push(item);
    } else {
      items.push({ name: item, type: "page" });
      mainPages.push(item);
    }
  }

  const warnings: string[] = [];

  // Phase-aware constraints
  const maxPages = phase
    ? (developmentPhases.find((p) => p.value === phase)?.maxPages ?? 99)
    : 99;

  if (phase === "v0.1" && mainPages.length > 3) {
    warnings.push(
      `原始输入包含 ${mainPages.length} 个页面候选，v0.1 已收口为 ${maxPages} 个主页面（${mainPages.slice(0, maxPages).join("、")}），${mainPages.length > maxPages ? `其余 ${mainPages.length - maxPages} 个暂缓到 v0.2` : "当前在 v0.1 范围内"}。`,
    );
  } else if (phase === "v0.2" && mainPages.length > 5) {
    warnings.push(
      `v0.2 阶段建议最多 5 个主页面，当前检测到 ${mainPages.length} 个。多余页面将标记为暂缓。`,
    );
  }

  if (modules.length > 0) {
    warnings.push(
      `检测到 ${modules.length} 个模块（${modules.join("、")}），建议作为页面内 Tab、Card、Drawer 或折叠面板实现，不作为独立路由。`,
    );
  }

  if (mainPages.length > 0 && modules.length > mainPages.length) {
    warnings.push(
      `模块数量（${modules.length}）较多（超过本阶段主页面数量），建议优先作为页面内 Tab、Card、Drawer 或折叠面板承载，不要拆成独立路由。`,
    );
  }

  // Split into mustBuildNow vs deferred
  const mustBuildNow = mainPages.slice(0, maxPages);
  const deferToNext = mainPages.slice(maxPages);
  const modulesAsComponents = modules; // all modules stay as in-page components

  return {
    items,
    mainPages,
    modules,
    warnings,
    mustBuildNow,
    deferToNext,
    modulesAsComponents,
  };
}
