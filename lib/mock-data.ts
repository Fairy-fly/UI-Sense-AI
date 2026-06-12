/**
 * UI Sense AI — Mock Data
 *
 * Phase 2 static UI mock data. All fields match the Prisma schema types.
 * Replace with database queries in Phase 3.
 */

import type { Inspiration, Tag, PromptRecord } from "@/types";

// ---- Mock Inspirations (8 items) ----
export const mockInspirations: Inspiration[] = [
  {
    id: "insp-001",
    title: "Linear — Project Dashboard",
    description:
      "Clean task management interface with keyboard-first navigation, subtle hover states, and a calming dark sidebar.",
    sourceUrl: "https://linear.app",
    imageUrl: "/mock/preview-linear.svg",
    projectType: "SaaS",
    rating: 5,
    notes:
      "Exceptional use of whitespace. The command menu (Cmd+K) pattern is worth referencing for any productivity tool. Border colors are extremely subtle — almost invisible until hover.",
    createdAt: new Date("2026-06-01T08:00:00Z"),
    updatedAt: new Date("2026-06-01T08:00:00Z"),
    tags: [
      { id: "t1", name: "Minimal SaaS", category: "style", color: "neutral", createdAt: new Date(), updatedAt: new Date() },
      { id: "t2", name: "Neutral Palette", category: "color", color: "zinc", createdAt: new Date(), updatedAt: new Date() },
      { id: "t3", name: "Sidebar", category: "layout", color: "slate", createdAt: new Date(), updatedAt: new Date() },
      { id: "t4", name: "Command Menu", category: "component", color: "indigo", createdAt: new Date(), updatedAt: new Date() },
      { id: "t5", name: "Calm", category: "mood", color: "stone", createdAt: new Date(), updatedAt: new Date() },
    ],
    analysis: {
      id: "a1",
      inspirationId: "insp-001",
      colorAnalysis: "Neutral grayscale with zinc-900 backgrounds and slate accents. Primary actions use near-black (#18181B). Status indicators use muted indigo and emerald dots.",
      layoutAnalysis: "Three-column layout: collapsible sidebar (240px), main list view (flexible), right detail panel (480px). Generous 24px padding throughout.",
      componentAnalysis: "Keyboard-first command menu, subtle checkbox animations, drag-and-drop rows with 2px drop indicators, skeleton loading states.",
      styleSummary: "Minimal SaaS dashboard with exceptional information density control. Prioritizes content hierarchy through font weight and spacing rather than color.",
      designKeywords: "minimal, keyboard-first, high-density, subtle borders, monochrome, command-palette",
      createdAt: new Date("2026-06-01T08:00:00Z"),
      updatedAt: new Date("2026-06-01T08:00:00Z"),
    },
  },
  {
    id: "insp-002",
    title: "Vercel — Deployment Overview",
    description:
      "Developer-focused deployment dashboard with real-time logs, preview URLs, and a satisfying dark code-block aesthetic.",
    sourceUrl: "https://vercel.com/dashboard",
    imageUrl: "/mock/preview-vercel.svg",
    projectType: "Dashboard",
    rating: 5,
    notes:
      "The dark terminal-style log viewer is iconic. Preview deployment cards with instant screenshot thumbnails create a strong developer tool feel.",
    createdAt: new Date("2026-05-28T10:30:00Z"),
    updatedAt: new Date("2026-05-28T10:30:00Z"),
    tags: [
      { id: "t6", name: "Developer Tool", category: "style", color: "zinc", createdAt: new Date(), updatedAt: new Date() },
      { id: "t7", name: "Dark", category: "color", color: "neutral", createdAt: new Date(), updatedAt: new Date() },
      { id: "t1", name: "Minimal SaaS", category: "style", color: "neutral", createdAt: new Date(), updatedAt: new Date() },
    ],
    analysis: {
      id: "a2",
      inspirationId: "insp-002",
      colorAnalysis: "Black (#000) and white (#FFF) base with slate-800 code panels. Accent uses geist-inspired purple (#7928CA) sparingly for CTAs only.",
      layoutAnalysis: "Top nav (56px) + content area with max-width 1200px. Deployment cards in 2-column grid. Log viewer uses full-width monospace panel.",
      componentAnalysis: "Real-time streaming log viewer, instant preview thumbnails, domain configuration cards with copy-to-clipboard, branch selector dropdown.",
      styleSummary: "Premium developer tool aesthetic. Dark panels contrast with light UI. Typography-forward design with Geist font family throughout.",
      designKeywords: "developer-tool, dark-mode, monospace, terminal, real-time, preview-thumbnails",
      createdAt: new Date("2026-05-28T10:30:00Z"),
      updatedAt: new Date("2026-05-28T10:30:00Z"),
    },
  },
  {
    id: "insp-003",
    title: "Raycast — Quick Search",
    description:
      "Lightning-fast command palette with rich previews, nested actions, and a floating panel that feels native to macOS.",
    sourceUrl: "https://raycast.com",
    imageUrl: "/mock/preview-raycast.svg",
    projectType: "AI Tool",
    rating: 4,
    notes:
      "The floating panel design is brilliant for tools that need to overlay other apps. Rich extension previews with images, colors, and formatted text.",
    createdAt: new Date("2026-05-25T14:00:00Z"),
    updatedAt: new Date("2026-05-25T14:00:00Z"),
    tags: [
      { id: "t8", name: "AI Native", category: "style", color: "violet", createdAt: new Date(), updatedAt: new Date() },
      { id: "t9", name: "Grid", category: "layout", color: "slate", createdAt: new Date(), updatedAt: new Date() },
      { id: "t5", name: "Calm", category: "mood", color: "stone", createdAt: new Date(), updatedAt: new Date() },
    ],
    analysis: {
      id: "a3",
      inspirationId: "insp-003",
      colorAnalysis: "Warm gray background (#F5F5F4) with glass-morphism floating panel. Search input uses #1A1A1A text on white. Extension icons provide color accents.",
      layoutAnalysis: "Floating panel (640px wide) centered on screen. Search bar at top, results in scrollable list with rich preview panels. Nested actions use slide-in subpanels.",
      componentAnalysis: "Command palette with fuzzy search, extension store with rich previews, snippet expansion, quick-link launcher, clipboard history browser.",
      styleSummary: "Efficiency tool aesthetic — form follows function. Glass panel with subtle backdrop blur. Everything optimized for keyboard navigation speed.",
      designKeywords: "command-palette, floating-panel, keyboard-first, glass-morphism, quick-search, efficiency",
      createdAt: new Date("2026-05-25T14:00:00Z"),
      updatedAt: new Date("2026-05-25T14:00:00Z"),
    },
  },
  {
    id: "insp-004",
    title: "Notion — Database View",
    description:
      "Flexible database with multiple view modes, inline editing, and a content-first approach that makes data feel approachable.",
    sourceUrl: "https://notion.so",
    imageUrl: "/mock/preview-notion.svg",
    projectType: "SaaS",
    rating: 4,
    notes:
      "The board view is particularly well-designed. Cards feel lightweight despite containing complex data. Inline editing with slash commands is a great pattern.",
    createdAt: new Date("2026-05-20T09:15:00Z"),
    updatedAt: new Date("2026-05-20T09:15:00Z"),
    tags: [
      { id: "t10", name: "Card-based Layout", category: "layout", color: "stone", createdAt: new Date(), updatedAt: new Date() },
      { id: "t11", name: "Soft Dashboard", category: "style", color: "violet", createdAt: new Date(), updatedAt: new Date() },
      { id: "t12", name: "Warm", category: "mood", color: "amber", createdAt: new Date(), updatedAt: new Date() },
    ],
    analysis: {
      id: "a4",
      inspirationId: "insp-004",
      colorAnalysis: "Warm off-white (#FFFBFA) background with subtle gray separators. Property tags use muted pastels. Emoji icons add personality without clutter.",
      layoutAnalysis: "Sidebar (240px) + flexible content area. Database views: table, board, timeline, calendar, gallery, list. Each view reflows content intelligently.",
      componentAnalysis: "Multi-view database, inline property editing, slash command menu, drag-and-drop rows, nested pages with breadcrumbs, real-time collaboration cursors.",
      styleSummary: "Content-first design that makes databases feel like documents. Low visual noise with strategic use of icons and pastel property tags.",
      designKeywords: "database, multi-view, inline-editing, content-first, pastel-tags, slash-commands",
      createdAt: new Date("2026-05-20T09:15:00Z"),
      updatedAt: new Date("2026-05-20T09:15:00Z"),
    },
  },
  {
    id: "insp-005",
    title: "Stripe — Payment Settings",
    description:
      "Complex financial settings made clear through progressive disclosure, inline validation, and thoughtful empty states.",
    sourceUrl: "https://dashboard.stripe.com",
    imageUrl: "/mock/preview-stripe.svg",
    projectType: "Admin Panel",
    rating: 3,
    notes:
      "Excellent handling of complex forms. Each section is collapsible. Inline validation is immediate and helpful. The sidebar navigation is well-organized.",
    createdAt: new Date("2026-05-15T16:45:00Z"),
    updatedAt: new Date("2026-05-15T16:45:00Z"),
    tags: [
      { id: "t13", name: "Dense but Clean", category: "style", color: "zinc", createdAt: new Date(), updatedAt: new Date() },
      { id: "t14", name: "Table", category: "component", color: "slate", createdAt: new Date(), updatedAt: new Date() },
      { id: "t15", name: "Sharp", category: "mood", color: "neutral", createdAt: new Date(), updatedAt: new Date() },
    ],
    analysis: {
      id: "a5",
      inspirationId: "insp-005",
      colorAnalysis: "White background with indigo-600 primary CTAs. Success states use emerald-500. Data tables use zebra striping with blue-50 hover rows.",
      layoutAnalysis: "Two-tier sidebar (org-level + section-level) + main content. Forms use single-column max-width 720px. Data tables fill available width.",
      componentAnalysis: "Progressive disclosure sections, inline validation with icon feedback, copy-to-clipboard for API keys, collapsible sidebar sections, searchable selects.",
      styleSummary: "Enterprise admin panel done right — complex data feels manageable. Progressive disclosure prevents cognitive overload. Validation is constructive, not punitive.",
      designKeywords: "enterprise, progressive-disclosure, form-validation, data-tables, admin-panel, inline-feedback",
      createdAt: new Date("2026-05-15T16:45:00Z"),
      updatedAt: new Date("2026-05-15T16:45:00Z"),
    },
  },
  {
    id: "insp-006",
    title: "Figma — Design File Browser",
    description:
      "Creative tool file browser with thumbnail-heavy grid, team sharing indicators, and a inspiring yet functional layout.",
    sourceUrl: "https://figma.com",
    imageUrl: "/mock/preview-figma.svg",
    projectType: "Design Tool",
    rating: 4,
    notes:
      "The thumbnail previews are the star — each file shows a mini version of the actual design. Team avatars on thumbnails create social proof and easy navigation.",
    createdAt: new Date("2026-05-10T11:20:00Z"),
    updatedAt: new Date("2026-05-10T11:20:00Z"),
    tags: [
      { id: "t10", name: "Card-based Layout", category: "layout", color: "stone", createdAt: new Date(), updatedAt: new Date() },
      { id: "t16", name: "Low-saturation", category: "color", color: "neutral", createdAt: new Date(), updatedAt: new Date() },
      { id: "t17", name: "Premium Tool", category: "style", color: "zinc", createdAt: new Date(), updatedAt: new Date() },
    ],
    analysis: {
      id: "a6",
      inspirationId: "insp-006",
      colorAnalysis: "Near-black (#1E1E1E) sidebar with white content area. File thumbnails provide organic color. Team avatars add human color accents. Selection uses subtle blue.",
      layoutAnalysis: "Resizable sidebar (240-360px) + flexible thumbnail grid (3-5 columns). Grid auto-fills based on container width. Detail panel slides in from right.",
      componentAnalysis: "Thumbnail grid with live previews, team avatar stacks, context menus, drag-to-select, breadcrumb navigation, search with recent files.",
      styleSummary: "Creative tool browser that balances inspiration with organization. Dark sidebar grounds the light content area. Thumbnails are the primary navigation element.",
      designKeywords: "creative-tool, thumbnail-grid, dark-sidebar, design-browser, team-avatars, file-previews",
      createdAt: new Date("2026-05-10T11:20:00Z"),
      updatedAt: new Date("2026-05-10T11:20:00Z"),
    },
  },
  {
    id: "insp-007",
    title: "Arc Browser — Tab Management",
    description:
      "Reimagined browser chrome with vertical tabs, spaces, and a split-view that makes tab overload manageable.",
    sourceUrl: "https://arc.net",
    imageUrl: "/mock/preview-arc.svg",
    projectType: "Desktop App",
    rating: 5,
    notes:
      "The sidebar-based tab management is a paradigm shift. Spaces feature lets you context-switch between work/personal. The auto-archive reduces cognitive load.",
    createdAt: new Date("2026-05-05T08:30:00Z"),
    updatedAt: new Date("2026-05-05T08:30:00Z"),
    tags: [
      { id: "t1", name: "Minimal SaaS", category: "style", color: "neutral", createdAt: new Date(), updatedAt: new Date() },
      { id: "t3", name: "Sidebar", category: "layout", color: "slate", createdAt: new Date(), updatedAt: new Date() },
      { id: "t18", name: "Kanban", category: "layout", color: "indigo", createdAt: new Date(), updatedAt: new Date() },
    ],
    analysis: {
      id: "a7",
      inspirationId: "insp-007",
      colorAnalysis: "Gradient-based theming that adapts to the current website. Default uses muted mauve and slate. Sidebar background adapts based on content.",
      layoutAnalysis: "Vertical tab sidebar (36px tabs) + split-view content areas. Spaces as top-level organizational units. Command bar for quick actions.",
      componentAnalysis: "Vertical tabs with favicon + title truncation, spaces switcher, split-view resizer, auto-archive timeline, peek preview on hover.",
      styleSummary: "Browser reimagined as a design tool. Adaptive color theming creates visual harmony. Vertical tabs reduce cognitive overhead compared to horizontal.",
      designKeywords: "vertical-tabs, adaptive-theming, split-view, browser, spaces, auto-archive",
      createdAt: new Date("2026-05-05T08:30:00Z"),
      updatedAt: new Date("2026-05-05T08:30:00Z"),
    },
  },
  {
    id: "insp-008",
    title: "GitHub — Repository Overview",
    description:
      "Developer hub with activity graph, repository cards, and a feed that balances information density with readability.",
    sourceUrl: "https://github.com",
    imageUrl: "/mock/preview-github.svg",
    projectType: "Developer Tool",
    rating: 4,
    notes:
      "The contribution graph is iconic. File tree with icons helps navigation. The dark mode is well-implemented with proper contrast ratios throughout.",
    createdAt: new Date("2026-04-28T13:00:00Z"),
    updatedAt: new Date("2026-04-28T13:00:00Z"),
    tags: [
      { id: "t6", name: "Developer Tool", category: "style", color: "zinc", createdAt: new Date(), updatedAt: new Date() },
      { id: "t13", name: "Dense but Clean", category: "style", color: "zinc", createdAt: new Date(), updatedAt: new Date() },
      { id: "t9", name: "Grid", category: "layout", color: "slate", createdAt: new Date(), updatedAt: new Date() },
    ],
    analysis: {
      id: "a8",
      inspirationId: "insp-008",
      colorAnalysis: "Light mode: #FFFFFF background with blue-500 links. Success green, danger red, warning amber for status. Activity graph uses green intensity scale.",
      layoutAnalysis: "Two-column: main content (flexible) + right sidebar (300px). Repository tabs: Code, Issues, PRs, Actions, Projects, Wiki, Security.",
      componentAnalysis: "Contribution activity graph, file tree browser, markdown renderer, diff viewer with syntax highlighting, issue/PR list with labels and milestones.",
      styleSummary: "Developer hub that handles extreme information density gracefully. Color is used semantically (green=merged, red=closed). Typography hierarchy is clear even at small sizes.",
      designKeywords: "developer-hub, activity-graph, file-tree, semantic-color, markdown, diff-viewer",
      createdAt: new Date("2026-04-28T13:00:00Z"),
      updatedAt: new Date("2026-04-28T13:00:00Z"),
    },
  },
];

// ---- Mock Tags ----
export const mockTags: Tag[] = [
  { id: "t1", name: "Minimal SaaS", category: "style", color: "neutral", createdAt: new Date(), updatedAt: new Date() },
  { id: "t2", name: "Neutral Palette", category: "color", color: "zinc", createdAt: new Date(), updatedAt: new Date() },
  { id: "t3", name: "Sidebar", category: "layout", color: "slate", createdAt: new Date(), updatedAt: new Date() },
  { id: "t4", name: "Command Menu", category: "component", color: "indigo", createdAt: new Date(), updatedAt: new Date() },
  { id: "t5", name: "Calm", category: "mood", color: "stone", createdAt: new Date(), updatedAt: new Date() },
  { id: "t6", name: "Developer Tool", category: "style", color: "zinc", createdAt: new Date(), updatedAt: new Date() },
  { id: "t7", name: "Dark", category: "color", color: "neutral", createdAt: new Date(), updatedAt: new Date() },
  { id: "t8", name: "AI Native", category: "style", color: "violet", createdAt: new Date(), updatedAt: new Date() },
  { id: "t9", name: "Grid", category: "layout", color: "slate", createdAt: new Date(), updatedAt: new Date() },
  { id: "t10", name: "Card-based Layout", category: "layout", color: "stone", createdAt: new Date(), updatedAt: new Date() },
  { id: "t11", name: "Soft Dashboard", category: "style", color: "violet", createdAt: new Date(), updatedAt: new Date() },
  { id: "t12", name: "Warm", category: "mood", color: "amber", createdAt: new Date(), updatedAt: new Date() },
  { id: "t13", name: "Dense but Clean", category: "style", color: "zinc", createdAt: new Date(), updatedAt: new Date() },
  { id: "t14", name: "Table", category: "component", color: "slate", createdAt: new Date(), updatedAt: new Date() },
  { id: "t15", name: "Sharp", category: "mood", color: "neutral", createdAt: new Date(), updatedAt: new Date() },
  { id: "t16", name: "Low-saturation", category: "color", color: "neutral", createdAt: new Date(), updatedAt: new Date() },
  { id: "t17", name: "Premium Tool", category: "style", color: "zinc", createdAt: new Date(), updatedAt: new Date() },
  { id: "t18", name: "Kanban", category: "layout", color: "indigo", createdAt: new Date(), updatedAt: new Date() },
];

// ---- Mock Prompt Records ----
export const mockPromptRecords: PromptRecord[] = [
  {
    id: "pr-001",
    title: "SaaS Dashboard v1",
    targetProject: "AI Research Hub",
    projectType: "SaaS",
    selectedInspirationIds: JSON.stringify(["insp-001", "insp-002"]),
    generatedPrompt: "",
    designSystemPrompt: null,
    pageLevelPrompt: null,
    componentLevelPrompt: null,
    createdAt: new Date("2026-06-08T14:30:00Z"),
    updatedAt: new Date("2026-06-08T14:30:00Z"),
  },
  {
    id: "pr-002",
    title: "Landing Page Redesign",
    targetProject: "OpenSource AI Toolkit",
    projectType: "Landing Page",
    selectedInspirationIds: JSON.stringify(["insp-004", "insp-007"]),
    generatedPrompt: "",
    designSystemPrompt: null,
    pageLevelPrompt: null,
    componentLevelPrompt: null,
    createdAt: new Date("2026-06-06T09:00:00Z"),
    updatedAt: new Date("2026-06-06T09:00:00Z"),
  },
  {
    id: "pr-003",
    title: "Admin Panel UI Kit",
    targetProject: "Internal Tools Platform",
    projectType: "Admin Panel",
    selectedInspirationIds: JSON.stringify(["insp-005"]),
    generatedPrompt: "",
    designSystemPrompt: null,
    pageLevelPrompt: null,
    componentLevelPrompt: null,
    createdAt: new Date("2026-06-03T16:45:00Z"),
    updatedAt: new Date("2026-06-03T16:45:00Z"),
  },
];

// ---- Mock User Preferences ----
export const mockUserPreferences = {
  preferredStyles: ["Minimal SaaS", "Soft Dashboard", "Dense but Clean", "Premium Tool", "Calm Productivity"],
  dislikedStyles: ["廉价蓝白后台", "过度渐变", "大阴影", "塑料感按钮", "拥挤表格"],
  preferredColors: ["Slate", "Neutral", "Zinc", "Muted Purple", "Cool Gray"],
  preferredLayouts: ["Sidebar + Content", "Card Grid", "Split Panel"],
  defaultTechStack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "SQLite", "Prisma"],
};

// ---- Helper: Get inspiration by ID ----
export function getMockInspiration(id: string): Inspiration | undefined {
  return mockInspirations.find((insp) => insp.id === id);
}
