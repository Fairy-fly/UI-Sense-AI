/**
 * UI Sense AI — Database Seed
 *
 * Seeds the SQLite database with mock inspirations, tags, analysis,
 * prompt records, and user preferences.
 *
 * Run: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding UI Sense AI database...");

  // Clear existing data in correct order (children first)
  await db.inspirationTag.deleteMany();
  await db.aiAnalysis.deleteMany();
  await db.promptRecord.deleteMany();
  await db.inspiration.deleteMany();
  await db.tag.deleteMany();
  await db.userPreference.deleteMany();

  // ---- Tags ----
  const tagData = [
    // style
    { id: "t1", name: "Minimal SaaS", category: "style", color: "neutral" },
    { id: "t6", name: "Developer Tool", category: "style", color: "zinc" },
    { id: "t8", name: "AI Native", category: "style", color: "violet" },
    { id: "t11", name: "Soft Dashboard", category: "style", color: "violet" },
    { id: "t13", name: "Dense but Clean", category: "style", color: "zinc" },
    { id: "t17", name: "Premium Tool", category: "style", color: "zinc" },
    // color
    { id: "t2", name: "Neutral Palette", category: "color", color: "neutral" },
    { id: "t7", name: "Dark", category: "color", color: "neutral" },
    { id: "t16", name: "Low-saturation", category: "color", color: "neutral" },
    // layout
    { id: "t3", name: "Sidebar", category: "layout", color: "slate" },
    { id: "t9", name: "Grid", category: "layout", color: "slate" },
    { id: "t10", name: "Card-based Layout", category: "layout", color: "stone" },
    { id: "t18", name: "Kanban", category: "layout", color: "indigo" },
    // component
    { id: "t4", name: "Command Menu", category: "component", color: "indigo" },
    { id: "t14", name: "Table", category: "component", color: "slate" },
    // mood
    { id: "t5", name: "Calm", category: "mood", color: "stone" },
    { id: "t12", name: "Warm", category: "mood", color: "amber" },
    { id: "t15", name: "Sharp", category: "mood", color: "neutral" },
  ];

  for (const t of tagData) {
    await db.tag.create({ data: t });
  }
  console.log(`  ✓ ${tagData.length} tags created`);

  // ---- Inspirations ----
  const inspirationData = [
    {
      id: "insp-001",
      title: "Linear — Project Dashboard",
      description:
        "Clean task management interface with keyboard-first navigation, subtle hover states, and a calming dark sidebar.",
      sourceUrl: "https://linear.app",
      imageUrl: "",
      previewVariant: "linear",
      projectType: "SaaS",
      rating: 5,
      notes:
        "Exceptional use of whitespace. The command menu (Cmd+K) pattern is worth referencing for any productivity tool.",
      createdAt: new Date("2026-06-01T08:00:00Z"),
    },
    {
      id: "insp-002",
      title: "Vercel — Deployment Overview",
      description:
        "Developer-focused deployment dashboard with real-time logs, preview URLs, and a satisfying dark code-block aesthetic.",
      sourceUrl: "https://vercel.com/dashboard",
      imageUrl: "",
      previewVariant: "vercel",
      projectType: "Dashboard",
      rating: 5,
      notes: "The dark terminal-style log viewer is iconic. Preview deployment cards with instant screenshot thumbnails.",
      createdAt: new Date("2026-05-28T10:30:00Z"),
    },
    {
      id: "insp-003",
      title: "Raycast — Quick Search",
      description:
        "Lightning-fast command palette with rich previews, nested actions, and a floating panel that feels native to macOS.",
      sourceUrl: "https://raycast.com",
      imageUrl: "",
      previewVariant: "raycast",
      projectType: "AI Tool",
      rating: 4,
      notes: "The floating panel design is brilliant for tools that need to overlay other apps.",
      createdAt: new Date("2026-05-25T14:00:00Z"),
    },
    {
      id: "insp-004",
      title: "Notion — Database View",
      description:
        "Flexible database with multiple view modes, inline editing, and a content-first approach that makes data feel approachable.",
      sourceUrl: "https://notion.so",
      imageUrl: "",
      previewVariant: "notion",
      projectType: "SaaS",
      rating: 4,
      notes: "The board view is particularly well-designed. Cards feel lightweight despite containing complex data.",
      createdAt: new Date("2026-05-20T09:15:00Z"),
    },
    {
      id: "insp-005",
      title: "Stripe — Payment Settings",
      description:
        "Complex financial settings made clear through progressive disclosure, inline validation, and thoughtful empty states.",
      sourceUrl: "https://dashboard.stripe.com",
      imageUrl: "",
      previewVariant: "stripe",
      projectType: "Admin Panel",
      rating: 3,
      notes: "Excellent handling of complex forms. Each section is collapsible. Inline validation is immediate and helpful.",
      createdAt: new Date("2026-05-15T16:45:00Z"),
    },
    {
      id: "insp-006",
      title: "Figma — Design File Browser",
      description:
        "Creative tool file browser with thumbnail-heavy grid, team sharing indicators, and an inspiring yet functional layout.",
      sourceUrl: "https://figma.com",
      imageUrl: "",
      previewVariant: "figma",
      projectType: "Design Tool",
      rating: 4,
      notes: "The thumbnail previews are the star — each file shows a mini version of the actual design.",
      createdAt: new Date("2026-05-10T11:20:00Z"),
    },
    {
      id: "insp-007",
      title: "Arc Browser — Tab Management",
      description:
        "Reimagined browser chrome with vertical tabs, spaces, and a split-view that makes tab overload manageable.",
      sourceUrl: "https://arc.net",
      imageUrl: "",
      previewVariant: "arc",
      projectType: "Desktop App",
      rating: 5,
      notes: "The sidebar-based tab management is a paradigm shift. Spaces feature lets you context-switch.",
      createdAt: new Date("2026-05-05T08:30:00Z"),
    },
    {
      id: "insp-008",
      title: "GitHub — Repository Overview",
      description:
        "Developer hub with activity graph, repository cards, and a feed that balances information density with readability.",
      sourceUrl: "https://github.com",
      imageUrl: "",
      previewVariant: "github",
      projectType: "Developer Tool",
      rating: 4,
      notes: "The contribution graph is iconic. File tree with icons helps navigation.",
      createdAt: new Date("2026-04-28T13:00:00Z"),
    },
  ];

  for (const insp of inspirationData) {
    await db.inspiration.create({ data: insp });
  }
  console.log(`  ✓ ${inspirationData.length} inspirations created`);

  // ---- Inspiration-Tag associations ----
  const associations: [string, string][] = [
    ["insp-001", "t1"], ["insp-001", "t2"], ["insp-001", "t3"], ["insp-001", "t4"], ["insp-001", "t5"],
    ["insp-002", "t6"], ["insp-002", "t7"], ["insp-002", "t1"],
    ["insp-003", "t8"], ["insp-003", "t9"], ["insp-003", "t5"],
    ["insp-004", "t10"], ["insp-004", "t11"], ["insp-004", "t12"],
    ["insp-005", "t13"], ["insp-005", "t14"], ["insp-005", "t15"],
    ["insp-006", "t10"], ["insp-006", "t16"], ["insp-006", "t17"],
    ["insp-007", "t1"], ["insp-007", "t3"], ["insp-007", "t18"],
    ["insp-008", "t6"], ["insp-008", "t13"], ["insp-008", "t9"],
  ];

  for (const [inspirationId, tagId] of associations) {
    await db.inspirationTag.create({
      data: { inspirationId, tagId },
    });
  }
  console.log(`  ✓ ${associations.length} inspiration-tag associations created`);

  // ---- AI Analysis ----
  const analysisData = [
    {
      inspirationId: "insp-001",
      colorAnalysis: "Neutral grayscale with zinc-900 backgrounds and slate accents. Primary actions use near-black (#18181B).",
      layoutAnalysis: "Three-column layout: collapsible sidebar (240px), main list view, right detail panel (480px). Generous 24px padding throughout.",
      componentAnalysis: "Keyboard-first command menu, subtle checkbox animations, drag-and-drop rows with 2px drop indicators.",
      styleSummary: "Minimal SaaS dashboard with exceptional information density control. Prioritizes content hierarchy through font weight and spacing.",
      designKeywords: "minimal, keyboard-first, high-density, subtle-borders, monochrome, command-palette",
    },
    {
      inspirationId: "insp-002",
      colorAnalysis: "Black and white base with slate-800 code panels. Accent uses geist-inspired purple sparingly for CTAs.",
      layoutAnalysis: "Top nav (56px) + content area with max-width 1200px. Deployment cards in 2-column grid.",
      componentAnalysis: "Real-time streaming log viewer, instant preview thumbnails, domain configuration cards with copy-to-clipboard.",
      styleSummary: "Premium developer tool aesthetic. Dark panels contrast with light UI. Typography-forward design with Geist font.",
      designKeywords: "developer-tool, dark-mode, monospace, terminal, real-time, preview-thumbnails",
    },
    {
      inspirationId: "insp-003",
      colorAnalysis: "Warm gray background with glass-morphism floating panel. Search input uses #1A1A1A text on white.",
      layoutAnalysis: "Floating panel (640px wide) centered on screen. Search bar at top, results in scrollable list.",
      componentAnalysis: "Command palette with fuzzy search, extension store with rich previews, snippet expansion.",
      styleSummary: "Efficiency tool aesthetic — form follows function. Glass panel with subtle backdrop blur.",
      designKeywords: "command-palette, floating-panel, keyboard-first, glass-morphism, quick-search, efficiency",
    },
    {
      inspirationId: "insp-004",
      colorAnalysis: "Warm off-white background with subtle gray separators. Property tags use muted pastels.",
      layoutAnalysis: "Sidebar (240px) + flexible content area. Database views: table, board, timeline, calendar, gallery, list.",
      componentAnalysis: "Multi-view database, inline property editing, slash command menu, drag-and-drop rows.",
      styleSummary: "Content-first design that makes databases feel like documents. Low visual noise with strategic use of icons.",
      designKeywords: "database, multi-view, inline-editing, content-first, pastel-tags, slash-commands",
    },
    {
      inspirationId: "insp-005",
      colorAnalysis: "White background with indigo-600 primary CTAs. Data tables use zebra striping with blue-50 hover rows.",
      layoutAnalysis: "Two-tier sidebar + main content. Forms use single-column max-width 720px.",
      componentAnalysis: "Progressive disclosure sections, inline validation with icon feedback, copy-to-clipboard for API keys.",
      styleSummary: "Enterprise admin panel done right — complex data feels manageable. Progressive disclosure prevents cognitive overload.",
      designKeywords: "enterprise, progressive-disclosure, form-validation, data-tables, admin-panel, inline-feedback",
    },
    {
      inspirationId: "insp-006",
      colorAnalysis: "Near-black sidebar with white content area. File thumbnails provide organic color.",
      layoutAnalysis: "Resizable sidebar (240-360px) + flexible thumbnail grid (3-5 columns).",
      componentAnalysis: "Thumbnail grid with live previews, team avatar stacks, context menus, drag-to-select.",
      styleSummary: "Creative tool browser that balances inspiration with organization. Dark sidebar grounds the light content area.",
      designKeywords: "creative-tool, thumbnail-grid, dark-sidebar, design-browser, team-avatars, file-previews",
    },
    {
      inspirationId: "insp-007",
      colorAnalysis: "Gradient-based theming that adapts to the current website. Default uses muted mauve and slate.",
      layoutAnalysis: "Vertical tab sidebar (36px tabs) + split-view content areas. Spaces as top-level organizational units.",
      componentAnalysis: "Vertical tabs with favicon + title truncation, spaces switcher, split-view resizer, auto-archive timeline.",
      styleSummary: "Browser reimagined as a design tool. Adaptive color theming creates visual harmony.",
      designKeywords: "vertical-tabs, adaptive-theming, split-view, browser, spaces, auto-archive",
    },
    {
      inspirationId: "insp-008",
      colorAnalysis: "Light mode: #FFFFFF background with blue-500 links. Activity graph uses green intensity scale.",
      layoutAnalysis: "Two-column: main content (flexible) + right sidebar (300px). Repository tabs for navigation.",
      componentAnalysis: "Contribution activity graph, file tree browser, markdown renderer, diff viewer with syntax highlighting.",
      styleSummary: "Developer hub that handles extreme information density gracefully. Color is used semantically.",
      designKeywords: "developer-hub, activity-graph, file-tree, semantic-color, markdown, diff-viewer",
    },
  ];

  for (const analysis of analysisData) {
    await db.aiAnalysis.create({ data: analysis });
  }
  console.log(`  ✓ ${analysisData.length} AI analyses created`);

  // ---- Prompt Records ----
  const promptData = [
    {
      id: "pr-001",
      title: "SaaS Dashboard v1",
      targetProject: "AI Research Hub",
      projectType: "SaaS",
      selectedInspirationIds: JSON.stringify(["insp-001", "insp-002"]),
      generatedPrompt: "Mock prompt content — Phase 5 will generate real prompts.",
      createdAt: new Date("2026-06-08T14:30:00Z"),
    },
    {
      id: "pr-002",
      title: "Landing Page Redesign",
      targetProject: "OpenSource AI Toolkit",
      projectType: "Landing Page",
      selectedInspirationIds: JSON.stringify(["insp-004", "insp-007"]),
      generatedPrompt: "Mock prompt content — Phase 5 will generate real prompts.",
      createdAt: new Date("2026-06-06T09:00:00Z"),
    },
    {
      id: "pr-003",
      title: "Admin Panel UI Kit",
      targetProject: "Internal Tools Platform",
      projectType: "Admin Panel",
      selectedInspirationIds: JSON.stringify(["insp-005"]),
      generatedPrompt: "Mock prompt content — Phase 5 will generate real prompts.",
      createdAt: new Date("2026-06-03T16:45:00Z"),
    },
  ];

  for (const pr of promptData) {
    await db.promptRecord.create({ data: pr });
  }
  console.log(`  ✓ ${promptData.length} prompt records created`);

  // ---- User Preference ----
  await db.userPreference.create({
    data: {
      id: "pref-001",
      preferredStyles: JSON.stringify(["Minimal SaaS", "Soft Dashboard", "Dense but Clean", "Premium Tool", "Calm Productivity"]),
      dislikedStyles: JSON.stringify(["廉价蓝白后台", "过度渐变", "大阴影", "塑料感按钮", "拥挤表格"]),
      preferredColors: JSON.stringify(["Slate", "Neutral", "Zinc", "Muted Purple", "Cool Gray"]),
      preferredLayouts: JSON.stringify(["Sidebar + Content", "Card Grid", "Split Panel"]),
      defaultTechStack: JSON.stringify(["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "SQLite", "Prisma"]),
      defaultUiStyle: "Minimal SaaS",
    },
  });
  console.log("  ✓ User preference created");

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
