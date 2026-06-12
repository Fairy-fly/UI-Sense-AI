# CLAUDE.md — UI Sense AI

## Project

**UI Sense AI** — 个人 UI 灵感采集、审美偏好学习、Prompt 生成平台。
核心流程：收藏 UI 截图 → 分析设计风格 → 沉淀个人审美 → 生成 Claude Code / Codex 可执行的 UI 开发提示词。

## Tech Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS 4 + shadcn/ui (base-nova, neutral palette)
- Prisma + SQLite (`file:./dev.db`)
- DeepSeek API (openai SDK, server-side only, model: deepseek-v4-flash)
- Sonner (toast), Zod (validation), Lucide React (icons)
- Image upload → `public/uploads/YYYY-MM-DD/`

## Quick Start

```bash
npm run dev       # Dev server (pick a free port)
npm run build     # Production build
npx tsc --noEmit  # Type check
npm run lint      # ESLint
npx prisma studio # Browse DB
npx prisma db seed # Re-seed
```

## Environment

Copy `.env.example` to `.env.local`. Required: `DATABASE_URL`. Optional: `DEEPSEEK_API_KEY` (Prompt generator works without it via local templates).

## All Phases Complete (0-7)

| Phase | Key Deliverables |
|-------|-----------------|
| 0 | Next.js + TS + Tailwind + shadcn/ui init |
| 1 | AppShell, Sidebar, Header, PageHeading, StatCard, EmptyState |
| 2 | All 7 pages static UI, MockPreview, 8 mock inspirations with analysis |
| 3 | Prisma + SQLite migration, seed, actions, DB-read pages |
| 4 | Upload API, create/edit/delete inspirations, tag CRUD, real image display |
| 5 | Local template prompt builder, prompt CRUD, scroll-to-top, accordion form |
| 6 | DeepSeek client, AI optimizer, test API, Settings AI card, AI toggle, timeout + fallback |
| 7 | Chinese labels, display-labels mapping, rating stars, button alignment, docs |

## Page Map

| Route | Data Source | Key Notes |
|-------|------------|-----------|
| `/` | Static | Landing page |
| `/dashboard` | SQLite | Stats, recent, tags, prompts |
| `/inspirations` | SQLite | Grid with filter bar |
| `/inspirations/new` | Upload + SQLite | RatingInput stars, real upload |
| `/inspirations/[id]` | SQLite | Real image or MockPreview |
| `/inspirations/[id]/edit` | SQLite | Pre-filled InspirationForm |
| `/prompts` | SQLite + AI | Accordion form, AI toggle, tabs output |
| `/prompts/[id]` | SQLite | Saved prompt detail |
| `/settings` | Static + Server | AI status from server, display labels |

## Key Implementation Details

- **Button**: `rounded-[12px]`, `items-center justify-center`, text in `<span className="inline-flex items-center leading-none">`
- **Rating**: `RatingInput` (clickable stars) for input, `RatingDisplay` for read-only
- **Chinese labels**: `displayStyleTag()`, `displayColor()`, `displayLayout()`, `displayProjectType()` in `lib/display-labels.ts`
- **Prompt save**: `createPromptRecordFromGenerated()` — no AI re-call
- **AI fallback**: 45s timeout, auto fallback to local template with toast
- **Scroll**: `ScrollToTop` in `(app)/layout.tsx`, `data-app-scroll-container` on main
- **API Key**: Server-side only, `getAIProviderStatus()` returns `configured: boolean`
- **GET /api/ai/test**: 405; **GET /api/upload**: 405
- **No `asChild`** on shadcn components (not supported); use `buttonVariants()` for Link-styled buttons

## Critical Rules

- ❌ Never `rm -rf`, `git reset --hard`, `taskkill //F //IM node.exe`
- ❌ Never delete `app/`, `components/`, `lib/`, `docs/`, `prisma/`
- ❌ Never expose DEEPSEEK_API_KEY to frontend or docs
- ❌ Never change Chinese UI copy to English
- ❌ Never use `asChild` on shadcn components
- ❌ Never create a migration named `init` (already exists)
- ✅ Always run `npm run build && npx tsc --noEmit && npm run lint` after changes
