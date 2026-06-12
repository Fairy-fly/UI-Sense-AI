# UI Sense AI — Project Memory

> Last updated: 2026-06-12
> Current version: v1.2
> Status: Settings persistence + Markdown export complete

---

## Project Goal

Personal UI inspiration collection + design taste learning + prompt generation platform.
Turns collected UI screenshots into structured prompts for Claude Code / Codex.

## Tech Stack

Next.js 15 · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma + SQLite · DeepSeek API · Local file upload

## Completed Phases (0-7)

| Phase | Summary |
|-------|---------|
| 0 | Project init — Next.js + TS + Tailwind + shadcn/ui + docs |
| 1 | Design system — AppShell, Sidebar, Header, PageHeading, StatCard, EmptyState |
| 2 | Static UI — 7 pages, MockPreview, 8 mock inspirations with full analysis |
| 3 | Database — Prisma + SQLite, migration, seed, read queries |
| 4 | Upload & CRUD — `/api/upload`, create/edit/delete inspirations, tags, real images |
| 5 | Prompt generator — local template builder, 4-tab output, save/copy, scroll-to-top |
| 6 | AI integration — DeepSeek client, AI optimizer, Settings AI card, timeout + fallback |
| 7 | MVP polish — Chinese labels, rating stars, button alignment, docs final |

## Feature Status

| Feature | Status |
|---------|--------|
| Inspiration CRUD | ✅ |
| Local image upload | ✅ |
| Real image display + MockPreview fallback | ✅ |
| Tag management (create/reuse) | ✅ |
| Dashboard with live stats | ✅ |
| Local template prompt generation | ✅ |
| DeepSeek AI prompt optimization | ✅ |
| Prompt save/copy/history | ✅ |
| Settings persistence + Markdown export | ✅ |
| AI image analysis | ❌ |
| Login / multi-user | ❌ |
| Cloud storage | ❌ |

## Environment

`.env.local` (never committed) must contain:
- `DATABASE_URL="file:./dev.db"`
- `DEEPSEEK_API_KEY` (optional — templates work without it)
- `DEEPSEEK_MODEL="deepseek-v4-flash"`

## Key Architecture Notes

- `lib/display-labels.ts` — Chinese display mapping layer
- `lib/prompt-builder.ts` — local template generator (always available)
- `lib/ai/` — DeepSeek client, optimizer, config (server-only)
- `createPromptRecordFromGenerated()` — saves without re-calling AI
- `ScrollToTop` — mounted in `(app)/layout.tsx`
- Button pattern: `<Icon className="shrink-0" />` + `<span className="inline-flex items-center leading-none">text</span>`
