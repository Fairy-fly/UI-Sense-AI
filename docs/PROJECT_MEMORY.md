# UI Sense AI — Project Memory

> Last updated: 2026-06-15  
> Current version: v1.9  
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

### v1.4 — AI Analysis for Inspirations (current)
- Text-based AI analysis using inspiration metadata (title, tags, notes, project type)
- Reuses existing `AiAnalysis` table (colorAnalysis, layoutAnalysis, componentAnalysis, styleSummary, designKeywords)
- "开始 AI 分析" button on inspiration detail page; analysis persists after refresh
- "重新分析" support for updating existing analysis
- Structured for future multimodal model upgrade in `lib/ai/image-analysis.ts`
- No database schema changes needed

### v1.4.1 — AI Analysis Experience Polish (current)
- Button alignment fix: "重新分析" icon `shrink-0` + text `<span>` wrapper
- Verified "AI 基础分析" title + "基础文本分析 · 非视觉识别" subtitle clarity
- Verified no duplicate analysis rendering in InspirationDetail
- Verified 16 seed descriptions/notes fully mapped to Chinese
- Full regression: analysis generation, persistence, legacy filtering intact

### v1.4.2 — AI Analysis → Prompt Generation (current)
- AI analysis results feed into both local template and DeepSeek AI prompt generation
- "AI 基础分析参考" section added to generated prompts when inspirations have analysis
- Legacy seed English analysis filtered via `isLegacySeedAnalysis` before prompt injection
- Analysis context includes: styleSummary, colorAnalysis, layoutAnalysis, componentAnalysis, designKeywords
- `getInspirations()` and `actions/prompts.ts` now include `analysis: true` in queries

### v1.4.3 — Prompt Analysis Enhancement Indicators (current)
- "已分析" badge on inspiration cards in prompt workspace selector
- Light hint text: "已生成 AI 基础分析的灵感会自动增强 Prompt 质量。"
- Legacy seed English analysis excluded from badge display

### v1.5 — Vision Analysis Provider Foundation (current)
- Pluggable analysis provider architecture: `AnalysisProvider` interface
- `TextAnalysisProvider`: migrated existing v1.4 text-based analysis logic
- `VisionAnalysisProvider`: placeholder with safe degradation to text
- Auto-degrade: no vision config → text; no image → text; API failure → text
- Image safety: only `/uploads/` local paths, ≤5MB, no base64 logging
- `AI_ANALYSIS_MODE=text` env var for future vision model activation
- No database schema changes; all providers write to existing AiAnalysis table

### v1.5.1 — Provider & Metadata Regression Validation (current)
- Verified URL Metadata: decodeHtmlEntities, getAutoFillTitle, readHtmlHeadLimited
- Verified Provider: TextAnalysisProvider default, VisionAnalysisProvider safe degradation
- Verified Prompt: "已分析" badge, AI 基础分析参考 injection, legacy filtering
- All security boundaries intact: SSRF, localhost, private IP, redirect blocking
- Zero code changes — pure regression validation

### v1.6 — Real Vision Analysis via Bailian (current)
- `VisionAnalysisProvider` now calls OpenAI-compatible vision API with real image analysis
- Supports any OpenAI-compatible multimodal endpoint (Alibaba Bailian, OpenAI, etc.)
- Image safety: only `/uploads/` local images, ≤5MB, MIME whitelist (png/jpeg/webp)
- Base64 data URL encoding with no logging of image content
- 9 degradation paths: missing config, no image, invalid path, file not found, too large, bad MIME, API errors (400/401/429/500), model unsupported, JSON parse failure
- `analysisMode: "vision"` vs `"text"` for quality tracking
- Config via `VISION_MODEL` / `VISION_API_BASE_URL` / `VISION_API_KEY` env vars
- No database schema changes

### v1.6.1 — Vision Analysis Feedback (current)
- `analyzeInspiration` now returns `analysisMode: "vision" | "text"`
- Toast feedback: "视觉分析完成" for vision, "已使用基础文本分析" for text/degraded
- Mode is ephemeral (not persisted) — cleared on page refresh
- Analysis results persist normally in AiAnalysis table

### v1.6.2 — Vision Analysis Quality Optimization (current)
- Enhanced vision prompt: per-field 80-260 word range, minimum 2 visible details per field
- Forbidden Markdown/code blocks/verbose explanations in model output
- Resilient JSON parsing: extracts `{...}` block from surrounding text
- Prompt Builder analysis section reformatted as actionable instructions
- No database schema changes

### v1.6.3 — Prompt Output Experience Polish (current)
- Section 1: "角色设定" → "任务目标与角色" with explicit quality targets
- Section 3.5: AI analysis reformatted as "可迁移设计决策" with usage guidance
- Section 6: "页面要求" → "页面结构建议" with template-aware suggestions
- Section 9: Development order simplified with key principles
- Section 10: Acceptance criteria converted to checklist format
- No database schema changes

### v1.7 — Aesthetic Memory (current)
- Extended `UserPreference` with aesthetic memory fields (migration: add_aesthetic_memory)
- `buildAestheticMemory()`: rule-based profile from high-rated inspirations, AI analysis, tags
- `/settings` page: AestheticMemoryPanel with generate/regenerate button
- Profile chips: preferred styles, colors, layouts, components, avoided styles
- Agent instruction paragraph generated for Prompt Builder §4.5 injection
- Data threshold: requires ≥3 high-rated (≥4) inspirations

### v1.7.1 — Aesthetic Memory Experience Polish (current)
- Unified data threshold text to "3 个以上" matching code logic
- Enforced chip limits: 8 per category in UI and data layer
- Summary capped at 180 chars, Agent instruction at 200 chars
- Array limits: styles/colors/layouts/components/avoided ≤8, keywords ≤12
- No schema changes or migrations

### v1.7.2 — Full Regression Validation (current)
- All links verified: Dashboard, Inspirations, Collections, Settings, Prompts
- Aesthetic memory: generate/regenerate/empty states confirmed
- Prompt builder: §4.5 injection, no double 基于, no empty fields
- AI analysis: Provider chain, vision degradation, text fallback
- URL Metadata: SSRF protection, entity decode, large page head reading
- Zero code changes — pure validation pass

### v1.8 — Prompt History Feedback (current)
- Extended `PromptRecord` with 6 feedback fields (migration: add_prompt_feedback)
- `updatePromptFeedback` action: rating (1-5), label (useful/average/needs_improvement), tags, notes, favorites
- `/prompts/[id]` detail page: PromptFeedbackPanel with star ratings, quick labels, tag chips, notes
- Bookmark button for marking prompts as favorites
- All feedback fields nullable with safe defaults — old records don't break
- No impact on prompt generation, Markdown export, or aesthetic memory

### v1.8.1 — Prompt Feedback Regression Validation (current)
- Verified all feedback fields backward-compatible with old Prompt records
- Confirmed Zod validation, save/refresh round-trip, feedback panel states
- Confirmed history list badges, filter, SelectableChip dedup and onClick
- Zero lint warnings, zero code changes — pure validation pass

### v1.9 — Feedback-Driven Prompt Strategy (current)
- `computePromptFeedbackInsights()` analyzes PromptRecord feedback for strategy patterns
- `/settings` page: PromptFeedbackInsightsPanel with metrics, positive/negative tags, agent strategy
- Prompt Builder §4.6 injects "历史 Prompt 反馈参考" when ≥2 feedback records exist
- Pure rule-based: no AI calls, no schema changes, no PromptRecord modifications
- Does NOT embed old Prompt text — only summarizes user-preferred Prompt characteristics

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
