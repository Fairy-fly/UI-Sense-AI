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
