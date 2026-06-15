# UI Sense AI — Project Memory

> Last updated: 2026-06-15  
> Current version: v1.3.3.1  
> Default branch: main  

---

## Project Goal

Personal UI inspiration collection + design taste learning + Agent prompt generation platform.
Turns collected UI screenshots into structured, executable prompts for Claude Code / Codex.
Key mission: reduce the cheap, AI-generated, generic admin-panel feel of AI Agent outputs.

## Tech Stack

Next.js 15 · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma + SQLite · DeepSeek API · Local file upload · Zod · Sonner · Lucide React

## Version History

### v1.0 — MVP (tag: v1.0-ui-sense-ai-mvp)
- 7 phases: init, design, static UI, database, upload CRUD, prompt generator, AI integration
- Landing page, Dashboard, Inspiration grid, Upload, Detail, Edit, Prompt workspace, Settings
- DeepSeek AI optimization with timeout + fallback
- Chinese-first UI with display-labels mapping
- Rating stars, button alignment, scroll-to-top

### v1.1 — Search & Filters (merged to main)
- Real-time search (title, source, notes, projectType, tags)
- Chinese display search (e.g., 开发者工具 matches Developer Tool)
- Project type chips filter, tag multi-select filter, rating filter
- Sort by newest/oldest/rating
- Clear all filters, empty result state
- Pure filter functions in `lib/filters/inspirations.ts`

### v1.2 — Settings Persist & Markdown Export (tag: v1.2)
- Settings preferences save to `UserPreference` table (upsert)
- Editable chips: preferred styles, disliked styles, colors, layouts, tech stack, UI style
- Save with loading state and Chinese toast
- Prompt generator reads latest preferences
- `/prompts` and `/prompts/[id]` export Markdown via Blob download
- Markdown export includes full prompt, design system, pages, components sections
- `tsconfig.tsbuildinfo` removed from git tracking, added to `.gitignore`

### v1.2.1 — Visual Regression & i18n Polish (tag: v1.2.1)
- Updated all outdated phase labels to v1.2 (landing, sidebar, prompts, AI hint)
- Added safe `getHostname()` to prevent URL() crash on invalid source URLs
- Localized all user-visible tags, project types with display helpers
- Fixed button text alignment in filter bar
- Removed dead code in SettingsForm

### v1.3 — Inspiration Collections (current)
- New `Collection` and `InspirationCollection` tables (many-to-many)
- Full CRUD for collections: `/collections`, `/collections/new`, `/collections/[id]`, `/collections/[id]/edit`
- Collection cards with cover color, inspiration count, last updated
- Add-to-collection panel on inspiration detail page
- Add/remove inspirations from collections with instant chip UI
- Delete collection does NOT delete inspirations
- Prompt generator supports filtering inspirations by collection
- Sidebar navigation updated: 总览 → UI 灵感库 → 收藏集 → 上传灵感 → Prompt 生成器 → 设置

### v1.3.1 — Collections Experience Polish (current)
- Fixed collection card name truncation for long names
- Fixed collection filter Select displaying UUID instead of collection name
- Verified delete dialog clearly states inspirations are not deleted
- Verified all empty states display natural Chinese prompts
- Full regression: Prompt generation, save, export unaffected

### v1.3.2 — Prompt Template Presets (current)
- 6 template presets: SaaS Dashboard, Landing Page, Mobile App, Developer Tool, AI Product, Minimal Portfolio
- Each template provides structure hints, component suggestions, and style avoidance guidance
- Template selector in `/prompts` with auto-suggest based on project type
- Template info embedded in generated prompt and passed to DeepSeek AI context
- Template name included in Markdown export
- No database changes — pure code constants in `lib/prompt-templates.ts`

### v1.3.3 — URL Metadata Fetch (current)
- `POST /api/metadata` fetches webpage title, description, favicon, og:image
- Safe URL validation: http/https only, 8s timeout, User-Agent header
- `/inspirations/new` "读取网页信息" button with loading state
- Auto-fills title only when empty; never overwrites user input
- Preview card shows favicon, hostname, title, description
- Error handling: structured Chinese error messages, no crashes
- No database changes — metadata used only for form pre-fill

### v1.3.3.1 — URL Metadata Security Hardening (current)
- SSRF prevention: block localhost, 127.0.0.1, ::1, 0.0.0.0, all private IPv4 ranges
- Block internal hostnames: .local, .internal, .lan
- `redirect: "manual"` — no automatic redirect following; 3xx returns user-friendly prompt
- Response body capped at 1MB via `readResponseBodyLimited()` streaming reader
- Existing functionality preserved: https://linear.app still works normally

## Feature Status

| Feature | Status |
|---------|--------|
| Inspiration CRUD (upload, edit, delete) | ✅ |
| Real image display + MockPreview fallback | ✅ |
| Tag management (create/reuse) | ✅ |
| Dashboard with live stats | ✅ |
| Search, filter, sort inspirations | ✅ (v1.1) |
| Local template prompt generation | ✅ |
| DeepSeek AI prompt optimization | ✅ |
| Prompt save/copy/history | ✅ |
| Prompt Markdown export | ✅ (v1.2) |
| Settings preferences persistence | ✅ (v1.2) |
| Inspiration collections | ✅ (v1.3) |
| AI image analysis | ❌ (v2.0) |
| Login / multi-user | ❌ (v2.0) |
| Cloud storage | ❌ (v2.0) |
| Browser extension | ❌ (v2.0) |

## Security Rules

- `.env.local`, `prisma/dev.db`, `public/uploads/` user images: NEVER commit
- DEEPSEEK_API_KEY: NEVER write to docs, README, CLAUDE.md, or any tracked file
- Default branch: `main`
- Never force push, never `git reset --hard`, never `rm -rf`

## Recommended Next Versions

- **v1.3.1**: Prompt templates, URL auto-fetch, collection UX polish
- **v2.0**: AI image analysis, browser extension, cloud sync, multi-user login
