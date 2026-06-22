/**
 * Display label mappings — Chinese-friendly UI labels.
 * Maps English tag names / project types to Chinese for display only.
 */

const styleTagMap: Record<string, string> = {
  "Minimal SaaS": "极简 SaaS",
  "Soft Dashboard": "柔和仪表盘",
  "Dense but Clean": "紧凑但清爽",
  "Neutral Palette": "中性色调",
  "Premium Tool": "高级工具",
  "Calm Productivity": "平静效率",
  "AI Native": "AI 原生",
  "Card-based Layout": "卡片式布局",
  "Low-saturation": "低饱和",
  "Developer Tool": "开发者工具",
  "Command Menu": "命令菜单",
  "Dark": "深色风格",
  "Grid": "网格布局",
  "Kanban": "看板布局",
  "Sidebar": "侧边栏",
  "Warm": "温暖柔和",
  "Sharp": "锐利明快",
  "Table": "表格布局",
};

const colorMap: Record<string, string> = {
  Slate: "石板灰",
  Neutral: "中性色",
  Zinc: "锌灰",
  "Muted Purple": "柔和紫",
  "Cool Gray": "冷灰",
  "Warm Gray": "暖灰",
};

const layoutMap: Record<string, string> = {
  "Sidebar + Content": "侧边栏 + 内容",
  "Card Grid": "卡片网格",
  "Split Panel": "分栏面板",
  "Content": "内容区",
};

const projectTypeMap: Record<string, string> = {
  SaaS: "SaaS 平台",
  "AI Tool": "AI 工具",
  Dashboard: "仪表盘",
  "Landing Page": "落地页",
  "Mobile App": "移动应用",
  Portfolio: "作品集",
  "Admin Panel": "管理后台",
  "Design Tool": "设计工具",
  "Desktop App": "桌面应用",
  "Developer Tool": "开发者工具",
};

const componentMap: Record<string, string> = {
  Card: "卡片",
  Button: "按钮",
  Badge: "徽标",
  Tabs: "标签页",
  Sidebar: "侧边栏",
  Header: "顶栏",
  SearchInput: "搜索输入",
  FilterBar: "筛选栏",
  Dialog: "弹窗",
  EmptyState: "空状态",
  Skeleton: "骨架屏",
  Table: "表格",
  Toast: "轻提示",
  Banner: "横幅提示",
  StatCard: "统计卡片",
  Input: "输入框",
  Textarea: "文本区域",
  Select: "选择器",
};

/** Try all category maps; returns the input if no mapping found. */
export function displayLabel(value: string): string {
  return styleTagMap[value] ?? colorMap[value] ?? layoutMap[value] ?? componentMap[value] ?? value;
}

export function displayStyleTag(tag: string): string {
  return styleTagMap[tag] ?? tag;
}

export function displayColor(color: string): string {
  return colorMap[color] ?? color;
}

export function displayLayout(layout: string): string {
  return layoutMap[layout] ?? layout;
}

export function displayProjectType(type: string): string {
  return projectTypeMap[type] ?? type;
}

// ---- Text-inline replacement ----

/** Merged map of all display labels for text replacement. Sorted longest key first to avoid partial matches. */
const ALL_LABELS: Record<string, string> = { ...styleTagMap, ...colorMap, ...layoutMap, ...componentMap };

const SORTED_LABEL_ENTRIES = Object.entries(ALL_LABELS).sort(
  (a, b) => b[0].length - a[0].length,
);

/**
 * Replace known English internal values in a text string with Chinese display labels.
 * Longest-key-first to prevent "Card" from replacing within "Card Grid".
 * NOTE: This function is intended for controlled aesthetic memory text (summary, agent instruction).
 * Do NOT use on arbitrary user content or full-length prompt text.
 */
export function displayLabelInText(text: string): string {
  let result = text;
  for (const [raw, label] of SORTED_LABEL_ENTRIES) {
    // Use global replace with word-boundary awareness for short keys
    result = result.split(raw).join(label);
  }
  return result;
}
