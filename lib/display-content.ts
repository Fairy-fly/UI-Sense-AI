/**
 * Display Content Helpers — legacy seed/demo display layer.
 *
 * These functions map common English seed/demo text to Chinese for
 * display only. They are NOT general-purpose translators — real user
 * input that doesn't match legacy seed phrases is returned as-is.
 */

// ---- Legacy text mapper ----

const legacyTextMap: Record<string, string> = {
  // insp-001
  "Clean task management interface with keyboard-first navigation, subtle hover states, and a calming dark sidebar.":
    "清爽的任务管理界面，强调键盘优先导航、细腻悬停状态和冷静的深色侧边栏。",
  "Exceptional use of whitespace. The command menu (Cmd+K) pattern is worth referencing for any productivity tool.":
    "留白运用优秀，Cmd+K 命令菜单模式很适合效率工具参考。",
  // insp-002
  "Developer-focused deployment dashboard with real-time logs, preview URLs, and a satisfying dark code-block aesthetic.":
    "面向开发者的部署仪表盘，实时日志、预览链接，配合令人愉悦的暗色代码块美学。",
  "The dark terminal-style log viewer is iconic. Preview deployment cards with instant screenshot thumbnails.":
    "暗色终端风格的日志查看器堪称标志性，部署预览卡片带有即时截图缩略图。",
  // insp-003
  "Lightning-fast command palette with rich previews, nested actions, and a floating panel that feels native to macOS.":
    "极速命令面板，丰富的预览、嵌套操作和原生感十足的悬浮面板。",
  "The floating panel design is brilliant for tools that need to overlay other apps.":
    "悬浮面板设计非常出色，适合需要覆盖在其他应用之上的工具。",
  // insp-004
  "Flexible database with multiple view modes, inline editing, and a content-first approach that makes data feel approachable.":
    "灵活的数据库界面，支持多种视图模式和行内编辑，以内容优先的方式让复杂数据更容易理解。",
  "The board view is particularly well-designed. Cards feel lightweight despite containing complex data.":
    "看板视图设计得很出色，即使卡片承载复杂数据，整体依然显得轻盈易读。",
  // insp-005
  "Complex financial settings made clear through progressive disclosure, inline validation, and thoughtful empty states.":
    "复杂的财务设置通过渐进披露、行内校验和精心设计的空状态变得清晰易懂。",
  "Excellent handling of complex forms. Each section is collapsible. Inline validation is immediate and helpful.":
    "复杂表单处理出色，每个区域可折叠，行内校验即时且有用。",
  // insp-006
  "Creative tool file browser with thumbnail-heavy grid, team sharing indicators, and an inspiring yet functional layout.":
    "创意工具的文件浏览器，缩略图网格、团队分享标识，兼具灵感和实用性。",
  "The thumbnail previews are the star — each file shows a mini version of the actual design.":
    "缩略图预览是最大亮点，每个文件都展示了实际设计的迷你版本。",
  // insp-007
  "Reimagined browser chrome with vertical tabs, spaces, and a split-view that makes tab overload manageable.":
    "重新设计的浏览器界面，竖向标签页、空间管理和分屏视图让标签不再杂乱。",
  "The sidebar-based tab management is a paradigm shift. Spaces feature lets you context-switch.":
    "基于侧边栏的标签管理是一次范式转变，空间功能让你轻松切换上下环境。",
  // insp-008
  "Developer hub with activity graph, repository cards, and a feed that balances information density with readability.":
    "开发者中心，活跃度图表、仓库卡片和信息流在信息密度和可读性之间取得了平衡。",
  "The contribution graph is iconic. File tree with icons helps navigation.":
    "贡献图表堪称标志性，带图标的文件树让导航更便捷。",
};

/** Map legacy seed/demo English text to Chinese. Returns original text if no mapping exists. */
export function displayLegacyText(text: string | null | undefined): string | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (legacyTextMap[trimmed]) return legacyTextMap[trimmed];
  // Check if this looks like legacy English content (long ASCII text with no CJK)
  const cjkCount = (trimmed.match(/[一-鿿]/g) ?? []).length;
  if (cjkCount === 0 && trimmed.length > 50) {
    // Try partial mapping: check if the text starts with a known seed prefix
    for (const [key, value] of Object.entries(legacyTextMap)) {
      if (trimmed.startsWith(key.slice(0, 40))) return value;
    }
  }
  return trimmed;
}

// ---- Design keyword mapper ----

const keywordMap: Record<string, string> = {
  // Styles
  Minimal: "极简",
  "Minimal SaaS": "极简 SaaS",
  Calm: "冷静",
  Clean: "清爽",
  Modern: "现代",
  Playful: "有趣",
  Premium: "高级",
  Focused: "专注",
  Elegant: "优雅",
  Trustworthy: "可信赖",
  "Keyboard-first": "键盘优先",
  "Drag-and-drop": "拖拽交互",
  // Colors
  Neutrals: "中性色",
  "Neutral Palette": "中性色调",
  "Dark Gray": "深灰",
  "Soft gradient": "柔和渐变",
  // Layouts
  Sidebar: "侧边栏",
  "Card layout": "卡片布局",
  "Card UI": "卡片 UI",
  "Grid Layout": "网格布局",
  "Three-column layout": "三栏布局",
  "Card-based Layout": "卡片式布局",
  Whitespace: "留白",
  // Components
  "Command Menu": "命令菜单",
  "Rounded corners": "圆角",
  // Product types
  Dashboard: "仪表盘",
  CRM: "CRM",
  SaaS: "SaaS",
  AI: "AI",
  B2B: "B2B",
  Productivity: "效率工具",
  "Data visualization": "数据可视化",
  "Developer Tool": "开发者工具",
  // Legacy seed specific
  "developer-hub": "开发者中心",
  "activity-graph": "活跃图表",
  "file-tree": "文件树",
  "semantic-color": "语义色彩",
  markdown: "Markdown",
  "diff-viewer": "差异查看器",
  "sidebar-layout": "侧边栏布局",
  "card-grid": "卡片网格",
  "warm-neutral": "温暖中性",
  "calm-productivity": "平静效率",
  "premium-tool": "高级工具",
  "low-saturation": "低饱和",
  "command-menu": "命令菜单",
  "status-board": "状态看板",
  "keyboard-shortcuts": "键盘快捷键",
  "deep-work": "深度工作",
  "card-ui": "卡片 UI",
  "split-panel": "分屏面板",
  "neutral-palette": "中性色调",
  "soft-shadows": "柔和阴影",
  typography: "字体排印",
  "collaboration-tool": "协作工具",
  "priority-matrix": "优先级矩阵",
  "bento-grid": "便当盒网格",
};

/** Display a single design keyword with Chinese mapping. */
export function displayDesignKeyword(keyword: string): string {
  const trimmed = keyword.trim();
  if (!trimmed) return trimmed;
  const mapped = keywordMap[trimmed];
  if (mapped) return mapped;
  // Try case-insensitive
  const lower = trimmed.toLowerCase();
  for (const [key, value] of Object.entries(keywordMap)) {
    if (key.toLowerCase() === lower) return value;
  }
  return trimmed;
}

/** Display a comma-separated keyword string as an array of Chinese-mapped keywords. */
export function displayKeywordList(keywords: string): string[] {
  return keywords
    .split(/[,，、]/)
    .map((kw) => kw.trim())
    .filter(Boolean)
    .map(displayDesignKeyword);
}
