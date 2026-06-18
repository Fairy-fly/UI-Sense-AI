# CLAUDE.md — UI Sense AI

## Project

**UI Sense AI** — 个人 UI 灵感采集、审美偏好学习、Agent 提示词生成平台。
核心流程：收藏 UI 截图 → 分析设计风格 → 学习个人审美 → 生成 Claude Code / Codex 可执行的高质量 UI 开发 Prompt。

**当前版本：v2.1.0** · Scope Guard & Page/Module Split (v2.1a)

目标：减少 AI Agent 生成项目时的廉价感、AI 味、普通后台感。

> 这不是商业化 SaaS 产品。登录、多用户、云同步、浏览器插件仍是未来方向。

## Tech Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS 4 + shadcn/ui (base-nova, neutral palette)
- Prisma + SQLite (`file:./dev.db`)
- DeepSeek API (openai SDK, server-side only, model: deepseek-v4-flash, 45s timeout)
- Sonner (toast), Zod (validation), Lucide React (icons)
- Image upload → `public/uploads/YYYY-MM-DD/`

## Quick Start

```bash
npm run dev       # Dev server
npm run build     # Production build
npx tsc --noEmit  # Type check
npm run lint      # ESLint
npx prisma studio # Browse DB
npx prisma db seed # Re-seed
```

## Environment

Copy `.env.example` to `.env.local`. Required: `DATABASE_URL`. Optional: `DEEPSEEK_API_KEY`.

## Version History

| Version | Key Deliverables |
|---------|-----------------|
| v1.0 | MVP — 7 phases complete (init, design, UI, DB, upload, prompts, AI) |
| v1.1 | Search/filter inspirations (title, tags, type, rating, sort, Chinese display search) |
| v1.2 | Settings persistence (save to UserPreference), Markdown export (prompt + history) |
| v1.2.1 | Visual regression polish, Chinese i18n, URL safety fix |
| v1.3 | Inspiration collections with add/remove/group support |
| v1.3.1 | Collections UX polish: truncation, Select label, empty states |
| v1.3.2 | Prompt template presets (6 templates, auto-suggest, AI-aware) |
| v1.3.3 | URL metadata fetch (auto-fill title/description, favicon preview) |
| v1.3.3.1 | URL metadata security hardening (SSRF prevention, body size limit) |
| v1.4 | AI analysis for inspirations (text-based, metadata-driven) |
| v1.4.1 | AI analysis UX polish (button alignment, subtitle clarity) |
| v1.4.2 | AI analysis feeds into prompt generation (local + DeepSeek) |
| v1.4.3 | Prompt analysis enhancement indicators (badge + hint) |
| v1.5 | Vision analysis provider foundation (pluggable architecture) |
| v1.5.1 | Provider + metadata regression validation |
| v1.6 | Real vision analysis via OpenAI-compatible API (Bailian) |
| v1.6.1 | Vision analysis feedback (toast distinguishes vision vs text) |
| v1.6.2 | Vision analysis quality: detailed prompts, JSON resilience, builder integration |
| v1.6.3 | Prompt output polish (actionable Agent instructions, checklist format) |
| v1.7 | Aesthetic memory generation (auto profile from inspirations + analysis) |
| v1.7.1 | Aesthetic memory experience polish (chip limits, text consistency) |
| v1.7.2 | Full regression validation (all links intact) |
| v1.8 | Prompt history feedback with ratings, labels, favorites |
| v1.8.1 | Prompt feedback regression validation |
| v1.9 | Feedback-driven prompt strategy (insights from feedback data) |
| v1.9.1 | Feedback insights experience polish & regression |
| v2.0 | Local product polish: full regression, docs, empty states, stable MVP |
| v2.0.1 | GitHub README showcase polish |
| v2.0.2 | README table rendering and version display fix |
| v2.0.3 | Move planning document to docs/ for cleaner repo root |
| v2.0.4 | Project memory update after local tool phase completion |
| v2.0.5 | Add reusable Agent workflow skills document |
| v2.0.6 | README version display and milestone sync |
| v2.0.7 | 中文展示标签治理 |
| v2.1.0 | Scope Guard & Page/Module Split (v2.1a) — prevent prompt scope bloat |

## Page Map

| Route | Key Notes |
|-------|-----------|
| `/` | Landing page |
| `/dashboard` | Stats, recent inspirations, tags, prompts |
| `/inspirations` | Grid + search/filter/sort (v1.1) |
| `/inspirations/new` | Upload + RatingInput stars |
| `/inspirations/[id]` | Detail: image, analysis, edit/delete |
| `/inspirations/[id]/edit` | Edit form (pre-filled) |
| `/collections` | Collection grid with cards |
| `/collections/new` | Create collection (name, description, color) |
| `/collections/[id]` | Collection detail with inspirations |
| `/collections/[id]/edit` | Edit collection |
| `/prompts` | Workspace: form, AI toggle, generate, export MD |
| `/prompts/[id]` | Saved prompt: tabs, copy, export MD, delete |
| `/settings` | Editable preferences + AI config card |

## Key Implementation Details

- **Button**: `rounded-[12px]`, text in `<span className="inline-flex items-center leading-none">`
- **Rating**: `RatingInput` (clickable stars) input, `RatingDisplay` read-only
- **Chinese**: `displayStyleTag()`, `displayColor()`, `displayLayout()`, `displayProjectType()` in `lib/display-labels.ts`
- **Prompt save**: `createPromptRecordFromGenerated()` — no AI re-call
- **AI**: Server-side only, `getAIProviderStatus()` returns `configured: boolean`, 45s timeout fallback
- **Search**: `lib/filters/inspirations.ts` — searches raw + Chinese display values
- **Markdown export**: `lib/export/markdown.ts` — Blob download, UTF-8
- **Collection actions**: `lib/actions/collections.ts` — CRUD + inspiration-collection relations
- **Collection management**: `add-to-collection-panel.tsx` in inspiration detail page
- **Collection filter**: `/prompts` supports filtering inspirations by collection
- **Prompt templates**: `lib/prompt-templates.ts` — 6 presets with structure/component/avoid hints, auto-suggest by project type
- **URL metadata**: `lib/metadata.ts` + `POST /api/metadata` — auto-fill title/description from webpage, favicon preview
- **AI analysis**: `lib/ai/analysis-provider.ts` (factory) + `text-analysis-provider.ts` + `vision-analysis-provider.ts` — pluggable architecture, auto-degrade vision→text
- **Scroll**: `ScrollToTop` in `(app)/layout.tsx`, `data-app-scroll-container` on main
- **No `asChild`**: Use `buttonVariants()` for Link-styled buttons

## Workflow

```bash
git checkout main && git pull origin main
git checkout -b v1.x-feature-name
# develop → build → tsc → lint → manual test
git add -A && git commit -m "feat: ..."
git push -u origin v1.x-feature-name
# Create PR → review → merge to main → tag
```

## Critical Rules

- ❌ Never `rm -rf`, `git reset --hard`, force push without permission
- ❌ Never commit `.env.local`, `prisma/dev.db`, `public/uploads/` user images
- ❌ Never expose DEEPSEEK_API_KEY to frontend, docs, or git
- ❌ Never use `asChild` on shadcn components
- ❌ Never change Chinese UI copy to English
- ✅ Always render user-visible built-in labels (styles, colors, layouts, components) through `displayLabel()` — never show raw English internal values
- ✅ Technical terms (AI, Prompt, URL, GitHub, Claude Code, Codex, DeepSeek, API) may remain in English
- ✅ Always `npm run build && npx tsc --noEmit && npm run lint` before commit
- ✅ `main` is the default branch

## Development Workflows

For standard feature development, documentation-only releases, git safety, validation, UI quality review, and release checklists, follow `docs/AGENT_WORKFLOW_SKILLS.md`.

## Next Steps

项目已进入真实使用阶段，建议：

- 用 UI Sense AI 为下一个真实项目生成 UI Prompt
- 持续收集 10-20 个喜欢/不喜欢的 UI 案例
- 观察审美记忆和 Feedback Insights 是否随使用越来越准
- v2.1 可考虑 Demo 数据 + 演示截图 + Prompt 质量报告
- v3.0+ 可考虑可选云同步、多用户、浏览器插件（长期未来方向）
