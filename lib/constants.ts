import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Images,
  UploadCloud,
  Wand2,
  Settings,
} from "lucide-react";

// ---- Application ----
export const APP_NAME = "UI Sense AI";
export const APP_TAGLINE = "为 AI Agent 沉淀审美";
export const APP_DESCRIPTION =
  "Personal UI inspiration system for AI Agent workflows — Collect, analyze, and turn UI taste into better Claude Code / Codex prompts.";

// ---- Navigation ----
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "总览", icon: LayoutDashboard },
  { href: "/inspirations", label: "UI 灵感库", icon: Images },
  { href: "/inspirations/new", label: "上传灵感", icon: UploadCloud },
  { href: "/prompts", label: "Prompt 生成器", icon: Wand2 },
  { href: "/settings", label: "设置", icon: Settings },
];

// ---- Project Types ----
export const projectTypes = [
  "SaaS 平台",
  "AI 工具",
  "仪表盘",
  "落地页",
  "移动应用",
  "作品集",
  "管理后台",
  "设计工具",
] as const;

// ---- Default Style Tags ----
export const defaultStyleTags = [
  "极简 SaaS",
  "柔和仪表盘",
  "紧凑但清爽",
  "中性色调",
  "高级工具",
  "平静效率",
  "AI 原生",
  "卡片式布局",
  "低饱和",
  "开发者工具",
] as const;

// ---- Default Tech Stack ----
export const defaultTechStack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "SQLite",
  "Prisma",
] as const;

// ---- Disliked Style Examples ----
export const dislikedStyleExamples = [
  "廉价蓝白后台",
  "过度渐变",
  "大阴影",
  "塑料感按钮",
  "拥挤表格",
  "默认模板感",
  "信息层级混乱",
  "过多彩色标签",
] as const;

// ---- Preferred Colors ----
export const preferredColorExamples = [
  "Slate",
  "Neutral",
  "Zinc",
  "Muted Purple",
  "Cool Gray",
  "Warm Gray",
] as const;

// ---- Preferred Layouts ----
export const preferredLayoutExamples = [
  "Sidebar + Content",
  "Card Grid",
  "Split Panel",
  "Single Column",
  "Magazine",
] as const;

// ---- Rating ----
export const MIN_RATING = 1;
export const MAX_RATING = 5;
export const DEFAULT_RATING = 3;

export const ratingLabels: Record<number, string> = {
  1: "一般",
  2: "还行",
  3: "不错",
  4: "很好",
  5: "惊艳",
};

// ---- Layout ----
export const PAGE_MAX_WIDTH = "max-w-[1280px]";
export const PAGE_PADDING = "px-6 sm:px-8";
export const CARD_PADDING = "p-5 sm:p-6";

// ---- Upload ----
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

// ---- Current Phase Badge ----
export const PHASE_BADGE = "Phase 1 · Local MVP";
