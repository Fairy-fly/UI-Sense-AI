# UI Sense AI 鈥?Project Memory

> Last updated: 2026-06-16  
> Current version: v2.0.3  
> Default branch: main  
> Status: Personal local tool 鈥?core feature set complete

---

## Project Goal

Personal UI inspiration collection + design taste learning + Agent prompt generation platform.
Turns collected UI screenshots into structured, executable prompts for Claude Code / Codex.
Key mission: reduce the cheap, AI-generated, generic admin-panel feel of AI Agent outputs.

## Current Complete Feature Loop

鏀惰棌 UI 鐏垫劅 鈫?URL 鍏冧俊鎭鍙?鍥剧墖涓婁紶 鈫?AI 璁捐鍒嗘瀽 鈫?鏀惰棌闆嗙鐞?鈫?鐢熸垚涓汉瀹＄編璁板繂 鈫?Prompt 鐢熸垚鏃舵敞鍏ュ缇庤蹇?鍙嶉娲炲療 鈫?淇濆瓨 Prompt 鍘嗗彶 鈫?瀵?Prompt 璇勫垎/鏀惰棌/鍙嶉 鈫?浠庡弽棣堜腑鐢熸垚娲炲療 鈫?鍙嶅摵鍚庣画 Prompt 绛栫暐 鈫?鏈湴闀挎湡鑷敤銆?

**Note**: This is a personal local tool, not a commercial SaaS. Login, multi-user, cloud sync, and browser extensions remain future directions.

## Tech Stack

Next.js 15 路 TypeScript 路 Tailwind CSS 4 路 shadcn/ui 路 Prisma + SQLite 路 DeepSeek API 路 Local file upload 路 Zod 路 Sonner 路 Lucide React

## Version History

### v1.0 鈥?MVP (tag: v1.0-ui-sense-ai-mvp)
- 7 phases: init, design, static UI, database, upload CRUD, prompt generator, AI integration
- Landing page, Dashboard, Inspiration grid, Upload, Detail, Edit, Prompt workspace, Settings
- DeepSeek AI optimization with timeout + fallback
- Chinese-first UI with display-labels mapping
- Rating stars, button alignment, scroll-to-top

### v1.1 鈥?Search & Filters (merged to main)
- Real-time search (title, source, notes, projectType, tags)
- Chinese display search (e.g., 寮€鍙戣€呭伐鍏?matches Developer Tool)
- Project type chips filter, tag multi-select filter, rating filter
- Sort by newest/oldest/rating
- Clear all filters, empty result state
- Pure filter functions in `lib/filters/inspirations.ts`

### v1.2 鈥?Settings Persist & Markdown Export (tag: v1.2)
- Settings preferences save to `UserPreference` table (upsert)
- Editable chips: preferred styles, disliked styles, colors, layouts, tech stack, UI style
- Save with loading state and Chinese toast
- Prompt generator reads latest preferences
- `/prompts` and `/prompts/[id]` export Markdown via Blob download
- Markdown export includes full prompt, design system, pages, components sections
- `tsconfig.tsbuildinfo` removed from git tracking, added to `.gitignore`

### v1.2.1 鈥?Visual Regression & i18n Polish (tag: v1.2.1)
- Updated all outdated phase labels to v1.2 (landing, sidebar, prompts, AI hint)
- Added safe `getHostname()` to prevent URL() crash on invalid source URLs
- Localized all user-visible tags, project types with display helpers
- Fixed button text alignment in filter bar
- Removed dead code in SettingsForm

### v1.3 鈥?Inspiration Collections (current)
- New `Collection` and `InspirationCollection` tables (many-to-many)
- Full CRUD for collections: `/collections`, `/collections/new`, `/collections/[id]`, `/collections/[id]/edit`
- Collection cards with cover color, inspiration count, last updated
- Add-to-collection panel on inspiration detail page
- Add/remove inspirations from collections with instant chip UI
- Delete collection does NOT delete inspirations
- Prompt generator supports filtering inspirations by collection
- Sidebar navigation updated: 鎬昏 鈫?UI 鐏垫劅搴?鈫?鏀惰棌闆?鈫?涓婁紶鐏垫劅 鈫?Prompt 鐢熸垚鍣?鈫?璁剧疆

### v1.3.1 鈥?Collections Experience Polish (current)
- Fixed collection card name truncation for long names
- Fixed collection filter Select displaying UUID instead of collection name
- Verified delete dialog clearly states inspirations are not deleted
- Verified all empty states display natural Chinese prompts
- Full regression: Prompt generation, save, export unaffected

### v1.3.2 鈥?Prompt Template Presets (current)
- 6 template presets: SaaS Dashboard, Landing Page, Mobile App, Developer Tool, AI Product, Minimal Portfolio
- Each template provides structure hints, component suggestions, and style avoidance guidance
- Template selector in `/prompts` with auto-suggest based on project type
- Template info embedded in generated prompt and passed to DeepSeek AI context
- Template name included in Markdown export
- No database changes 鈥?pure code constants in `lib/prompt-templates.ts`

### v1.3.3 鈥?URL Metadata Fetch (current)
- `POST /api/metadata` fetches webpage title, description, favicon, og:image
- Safe URL validation: http/https only, 8s timeout, User-Agent header
- `/inspirations/new` "璇诲彇缃戦〉淇℃伅" button with loading state
- Auto-fills title only when empty; never overwrites user input
- Preview card shows favicon, hostname, title, description
- Error handling: structured Chinese error messages, no crashes
- No database changes 鈥?metadata used only for form pre-fill

### v1.3.3.1 鈥?URL Metadata Security Hardening (current)
- SSRF prevention: block localhost, 127.0.0.1, ::1, 0.0.0.0, all private IPv4 ranges
- Block internal hostnames: .local, .internal, .lan
- `redirect: "manual"` 鈥?no automatic redirect following; 3xx returns user-friendly prompt
- Response body capped at 1MB via `readResponseBodyLimited()` streaming reader
- Existing functionality preserved: https://linear.app still works normally

### v1.4 鈥?AI Analysis for Inspirations (current)
- Text-based AI analysis using inspiration metadata (title, tags, notes, project type)
- Reuses existing `AiAnalysis` table (colorAnalysis, layoutAnalysis, componentAnalysis, styleSummary, designKeywords)
- "寮€濮?AI 鍒嗘瀽" button on inspiration detail page; analysis persists after refresh
- "閲嶆柊鍒嗘瀽" support for updating existing analysis
- Structured for future multimodal model upgrade in `lib/ai/image-analysis.ts`
- No database schema changes needed

### v1.4.1 鈥?AI Analysis Experience Polish (current)
- Button alignment fix: "閲嶆柊鍒嗘瀽" icon `shrink-0` + text `<span>` wrapper
- Verified "AI 鍩虹鍒嗘瀽" title + "鍩虹鏂囨湰鍒嗘瀽 路 闈炶瑙夎瘑鍒? subtitle clarity
- Verified no duplicate analysis rendering in InspirationDetail
- Verified 16 seed descriptions/notes fully mapped to Chinese
- Full regression: analysis generation, persistence, legacy filtering intact

### v1.4.2 鈥?AI Analysis 鈫?Prompt Generation (current)
- AI analysis results feed into both local template and DeepSeek AI prompt generation
- "AI 鍩虹鍒嗘瀽鍙傝€? section added to generated prompts when inspirations have analysis
- Legacy seed English analysis filtered via `isLegacySeedAnalysis` before prompt injection
- Analysis context includes: styleSummary, colorAnalysis, layoutAnalysis, componentAnalysis, designKeywords
- `getInspirations()` and `actions/prompts.ts` now include `analysis: true` in queries

### v1.4.3 鈥?Prompt Analysis Enhancement Indicators (current)
- "宸插垎鏋? badge on inspiration cards in prompt workspace selector
- Light hint text: "宸茬敓鎴?AI 鍩虹鍒嗘瀽鐨勭伒鎰熶細鑷姩澧炲己 Prompt 璐ㄩ噺銆?
- Legacy seed English analysis excluded from badge display

### v1.5 鈥?Vision Analysis Provider Foundation (current)
- Pluggable analysis provider architecture: `AnalysisProvider` interface
- `TextAnalysisProvider`: migrated existing v1.4 text-based analysis logic
- `VisionAnalysisProvider`: placeholder with safe degradation to text
- Auto-degrade: no vision config 鈫?text; no image 鈫?text; API failure 鈫?text
- Image safety: only `/uploads/` local paths, 鈮?MB, no base64 logging
- `AI_ANALYSIS_MODE=text` env var for future vision model activation
- No database schema changes; all providers write to existing AiAnalysis table

### v1.5.1 鈥?Provider & Metadata Regression Validation (current)
- Verified URL Metadata: decodeHtmlEntities, getAutoFillTitle, readHtmlHeadLimited
- Verified Provider: TextAnalysisProvider default, VisionAnalysisProvider safe degradation
- Verified Prompt: "宸插垎鏋? badge, AI 鍩虹鍒嗘瀽鍙傝€?injection, legacy filtering
- All security boundaries intact: SSRF, localhost, private IP, redirect blocking
- Zero code changes 鈥?pure regression validation

### v1.6 鈥?Real Vision Analysis via Bailian (current)
- `VisionAnalysisProvider` now calls OpenAI-compatible vision API with real image analysis
- Supports any OpenAI-compatible multimodal endpoint (Alibaba Bailian, OpenAI, etc.)
- Image safety: only `/uploads/` local images, 鈮?MB, MIME whitelist (png/jpeg/webp)
- Base64 data URL encoding with no logging of image content
- 9 degradation paths: missing config, no image, invalid path, file not found, too large, bad MIME, API errors (400/401/429/500), model unsupported, JSON parse failure
- `analysisMode: "vision"` vs `"text"` for quality tracking
- Config via `VISION_MODEL` / `VISION_API_BASE_URL` / `VISION_API_KEY` env vars
- No database schema changes

### v1.6.1 鈥?Vision Analysis Feedback (current)
- `analyzeInspiration` now returns `analysisMode: "vision" | "text"`
- Toast feedback: "瑙嗚鍒嗘瀽瀹屾垚" for vision, "宸蹭娇鐢ㄥ熀纭€鏂囨湰鍒嗘瀽" for text/degraded
- Mode is ephemeral (not persisted) 鈥?cleared on page refresh
- Analysis results persist normally in AiAnalysis table

### v1.6.2 鈥?Vision Analysis Quality Optimization (current)
- Enhanced vision prompt: per-field 80-260 word range, minimum 2 visible details per field
- Forbidden Markdown/code blocks/verbose explanations in model output
- Resilient JSON parsing: extracts `{...}` block from surrounding text
- Prompt Builder analysis section reformatted as actionable instructions
- No database schema changes

### v1.6.3 鈥?Prompt Output Experience Polish (current)
- Section 1: "瑙掕壊璁惧畾" 鈫?"浠诲姟鐩爣涓庤鑹? with explicit quality targets
- Section 3.5: AI analysis reformatted as "鍙縼绉昏璁″喅绛? with usage guidance
- Section 6: "椤甸潰瑕佹眰" 鈫?"椤甸潰缁撴瀯寤鸿" with template-aware suggestions
- Section 9: Development order simplified with key principles
- Section 10: Acceptance criteria converted to checklist format
- No database schema changes

### v1.7 鈥?Aesthetic Memory (current)
- Extended `UserPreference` with aesthetic memory fields (migration: add_aesthetic_memory)
- `buildAestheticMemory()`: rule-based profile from high-rated inspirations, AI analysis, tags
- `/settings` page: AestheticMemoryPanel with generate/regenerate button
- Profile chips: preferred styles, colors, layouts, components, avoided styles
- Agent instruction paragraph generated for Prompt Builder 搂4.5 injection
- Data threshold: requires 鈮? high-rated (鈮?) inspirations

### v1.7.1 鈥?Aesthetic Memory Experience Polish (current)
- Unified data threshold text to "3 涓互涓? matching code logic
- Enforced chip limits: 8 per category in UI and data layer
- Summary capped at 180 chars, Agent instruction at 200 chars
- Array limits: styles/colors/layouts/components/avoided 鈮?, keywords 鈮?2
- No schema changes or migrations

### v1.7.2 鈥?Full Regression Validation (current)
- All links verified: Dashboard, Inspirations, Collections, Settings, Prompts
- Aesthetic memory: generate/regenerate/empty states confirmed
- Prompt builder: 搂4.5 injection, no double 鍩轰簬, no empty fields
- AI analysis: Provider chain, vision degradation, text fallback
- URL Metadata: SSRF protection, entity decode, large page head reading
- Zero code changes 鈥?pure validation pass

### v1.8 鈥?Prompt History Feedback (current)
- Extended `PromptRecord` with 6 feedback fields (migration: add_prompt_feedback)
- `updatePromptFeedback` action: rating (1-5), label (useful/average/needs_improvement), tags, notes, favorites
- `/prompts/[id]` detail page: PromptFeedbackPanel with star ratings, quick labels, tag chips, notes
- Bookmark button for marking prompts as favorites
- All feedback fields nullable with safe defaults 鈥?old records don't break
- No impact on prompt generation, Markdown export, or aesthetic memory

### v1.8.1 鈥?Prompt Feedback Regression Validation (current)
- Verified all feedback fields backward-compatible with old Prompt records
- Confirmed Zod validation, save/refresh round-trip, feedback panel states
- Confirmed history list badges, filter, SelectableChip dedup and onClick
- Zero lint warnings, zero code changes 鈥?pure validation pass

### v1.9 鈥?Feedback-Driven Prompt Strategy
- `computePromptFeedbackInsights()` analyzes PromptRecord feedback for strategy patterns
- `/settings` page: PromptFeedbackInsightsPanel with metrics, positive/negative tags, agent strategy
- Prompt Builder 搂4.6 injects "鍘嗗彶 Prompt 鍙嶉鍙傝€? when 鈮? feedback records exist
- Pure rule-based: no AI calls, no schema changes, no PromptRecord modifications
- Does NOT embed old Prompt text 鈥?only summarizes user-preferred Prompt characteristics

### v1.9.1 鈥?Feedback Insights Experience Polish (current)
- Verified `computePromptFeedbackInsights` safety: no generatedPrompt read, JSON parse guarded
- Confirmed Settings panel three states: loading, empty, populated
- Confirmed 搂4.6 position between 搂4.5 and 搂5, with null guard
- Confirmed AI and non-AI paths both receive feedbackInsights
- Zero code changes 鈥?pure regression validation

### v2.0 鈥?Local Product Polish (current)
- Full-page regression: Dashboard, Inspirations, Collections, Settings, Prompts
- Empty states, loading states, disabled states, toast feedback unified
- Three closed loops: Aesthetic Memory (搂4.5), Feedback Insights (搂4.6), Prompt Feedback
- README, CLAUDE.md, PROJECT_MEMORY updated to v2.0
- Ready for long-term local use as a stable personal tool

### v2.0.1 鈥?GitHub README Showcase Polish (current)
- Rewrote README.md with product overview, workflow, features, setup, safety
- Added `docs/GITHUB_ABOUT.md` with repo description and topic suggestions
- Environment variables documented in table format; no real keys exposed
- Version milestones and roadmap sections with future items clearly labeled
- No code changes 鈥?documentation-only update

### v2.0.2 鈥?README Table Rendering Fix (current)
- Fixed version badge display and milestone table formatting
- Updated current version to v2.0.2

### v2.0.3 鈥?Docs Archive Polish (current)
- Moved project planning DOCX from repository root to docs/ for cleaner GitHub showcase
- Project memory updated: personal local tool phase complete
- Recommended next phase: real usage, collecting feedback, observing memory accuracy
- Commercial SaaS features (login, multi-user, cloud sync, browser extension) remain future direction

## Feature Status

| Feature | Status |
|---------|--------|
| Inspiration CRUD (upload, edit, delete) | 鉁?|
| Real image display + MockPreview fallback | 鉁?|
| Tag management (create/reuse) | 鉁?|
| Dashboard with live stats | 鉁?|
| Search, filter, sort inspirations | 鉁?(v1.1) |
| Local template prompt generation | 鉁?|
| DeepSeek AI prompt optimization | 鉁?|
| Prompt save/copy/history | 鉁?|
| Prompt Markdown export | 鉁?(v1.2) |
| Settings preferences persistence | 鉁?(v1.2) |
| Inspiration collections | 鉁?(v1.3) |
| AI image analysis | 鉂?(v2.0) |
| Login / multi-user | 鉂?(v2.0) |
| Cloud storage | 鉂?(v2.0) |
| Browser extension | 鉂?(v2.0) |

## Security Rules

- `.env.local`, `prisma/dev.db`, `public/uploads/` user images: NEVER commit
- DEEPSEEK_API_KEY: NEVER write to docs, README, CLAUDE.md, or any tracked file
- Default branch: `main`
- Never force push, never `git reset --hard`, never `rm -rf`

## Recommended Next Versions

- **v1.3.1**: Prompt templates, URL auto-fetch, collection UX polish
- **v2.0**: AI image analysis, browser extension, cloud sync, multi-user login

