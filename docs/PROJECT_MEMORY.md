# UI Sense AI — Project Memory

> Last updated: 2026-06-18  
> Current version: v2.1.0  
> Default branch: main  
> Status: Personal local tool — v2.1a Scope Guard & Page/Module Split

---

## Project Goal

Personal UI inspiration collection + design taste learning + Agent prompt generation platform.
Turns collected UI screenshots into structured, executable prompts for Claude Code / Codex.
Key mission: reduce the cheap, AI-generated, generic admin-panel feel of AI Agent outputs.

## Current Complete Feature Loop

收藏 UI 灵感 → URL 元信息读取/图片上传 → AI 设计分析 → 收藏集管理 → 生成个人审美记忆 → Prompt 生成时注入审美记忆+反馈洞察 → 保存 Prompt 历史 → 对 Prompt 评分/收藏/反馈 → 从反馈中生成洞察 → 反哺后续 Prompt 策略 → 本地长期自用。

**Note**: This is a personal local tool, not a commercial SaaS. Login, multi-user, cloud sync, and browser extensions remain future directions.

## Tech Stack

Next.js 15 · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma + SQLite · DeepSeek API · Local file upload · Zod · Sonner · Lucide React

## Version History

| Version | Summary |
| ------- | ------- |
| v1.0    | MVP: inspiration CRUD, local prompt builder, DeepSeek AI |
| v1.3    | Collections, prompt templates, URL metadata |
| v1.4    | AI analysis for inspirations |
| v1.6    | Vision analysis provider and compatible multimodal API |
| v1.7    | Aesthetic memory generation and prompt section 4.5 injection |
| v1.8    | Prompt feedback: ratings, favorites, labels, notes |
| v1.9    | Feedback insights and prompt section 4.6 strategy injection |
| v2.0    | Local product polish and full regression |
| v2.0.1  | GitHub README showcase polish |
| v2.0.2  | README rendering and version display fix |
| v2.0.3  | Move planning DOCX into docs/ |
| v2.0.4  | Project memory update after local tool phase completion |
| v2.0.5  | Add reusable Agent workflow skills and clean project memory |
| v2.0.6  | README version display and milestone sync |
| v2.0.7  | Normalize Chinese display labels |
| v2.1.0  | Scope Guard & Page/Module Split — prevent v0.1 prompt bloat |

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
| Prompt template presets | ✅ (v1.3.2) |
| URL metadata auto-fill | ✅ (v1.3.3) |
| AI analysis for inspirations | ✅ (v1.4) |
| Vision analysis provider | ✅ (v1.6) |
| Aesthetic memory generation | ✅ (v1.7) |
| Prompt history feedback | ✅ (v1.8) |
| Feedback-driven prompt strategy | ✅ (v1.9) |
| Development phase selector (v0.1/v0.2/v1.0) | ✅ (v2.1a) |
| Scope guard — page/module auto-classification | ✅ (v2.1a) |
| AI image analysis (multimodal) | ✅ (v1.6) |
| Login / multi-user | ❌ (future) |
| Cloud storage | ❌ (future) |
| Browser extension | ❌ (future) |

## Security Rules

- `.env.local`, `prisma/dev.db`, `public/uploads/` user images: NEVER commit
- DEEPSEEK_API_KEY: NEVER write to docs, README, CLAUDE.md, or any tracked file
- Default branch: `main`
- Never force push, never `git reset --hard`, never `rm -rf`

## Recommended Next Direction

- Use UI Sense AI for real projects and observe Aesthetic Memory + Feedback Insights accuracy
- Collect 10-20 liked/disliked UI examples to refine personal taste signals
- v2.1 may add demo data, screenshots, and prompt quality reports
- v3.0+ may explore optional cloud sync, multi-user, browser extensions
