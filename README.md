# UI Sense AI

> Personal UI inspiration system for AI Agent workflows

**UI Sense AI** helps you collect UI inspirations, learn your design taste, and generate structured prompts that make Claude Code / Codex produce better-looking interfaces.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | SQLite + Prisma |
| AI | DeepSeek API (openai SDK, server-side only) |
| Upload | Local filesystem (`public/uploads/YYYY-MM-DD/`) |
| Validation | Zod |
| Toast | Sonner |
| Icons | Lucide React |

---

## Getting Started

```bash
npm install
cp .env.example .env.local
# Edit .env.local: add DATABASE_URL and DEEPSEEK_API_KEY
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

打开终端显示的地址（例如 http://localhost:3000 或 http://localhost:3007）。

---

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```
DATABASE_URL="file:./dev.db"
DEEPSEEK_API_KEY="your-key"        # Optional — Prompt generator works without it
DEEPSEEK_BASE_URL="https://api.deepseek.com"
DEEPSEEK_MODEL="deepseek-v4-flash"
DEEPSEEK_TEMPERATURE="0.4"
DEEPSEEK_MAX_TOKENS="6000"
DEEPSEEK_TIMEOUT_MS="45000"
```

**Never commit `.env.local` — it's in `.gitignore`.**

---

## Features

| Feature | Status |
|---------|--------|
| UI inspiration collection (upload, tags, rating) | ✅ |
| Inspiration grid with search/filter | ✅ |
| Edit and delete inspirations | ✅ |
| Dashboard with stats and recent activity | ✅ |
| Local template-based prompt generation | ✅ |
| DeepSeek AI prompt optimization | ✅ |
| Settings persistence (save preferences to DB) | ✅ |
| Prompt Markdown export | ✅ |
| Search and filter inspirations | ✅ |
| Inspiration collections (v1.3) | ✅ |
| Prompt template presets (v1.3.2) | ✅ |
| URL metadata auto-fill (v1.3.3) | ✅ |
| AI analysis for inspirations (v1.4) | ✅ |
| AI analysis enhances prompt generation (v1.4.2) | ✅ |
| Vision analysis provider architecture (v1.5) | ✅ |
| Real vision analysis via compatible API (v1.6) | ✅ |
| Login / multi-user | ❌ (future) |
| Cloud storage | ❌ (future) |
| Browser extension | ❌ (future) |

---

## Project Phases

| Phase | Status |
|-------|--------|
| 0 — Project Init | ✅ |
| 1 — Design System & Layout | ✅ |
| 2 — Static Page UIs | ✅ |
| 3 — Database & CRUD | ✅ |
| 4 — Upload & Inspiration CRUD | ✅ |
| 5 — Prompt Generator | ✅ |
| 6 — AI Interface Integration | ✅ |
| 7 — MVP Polish & Delivery | ✅ |
| 1.1 — Search & Filters | ✅ |
| 1.2 — Settings Persist & MD Export | ✅ |
| 1.2.1 — Visual Regression & i18n Polish | ✅ |
| 1.3 — Inspiration Collections | ✅ |

---

## Design Direction

- **Premium, not flashy** — Neutral palette, subtle borders, no heavy shadows
- **Clean, not cluttered** — Generous spacing, clear hierarchy
- **Modern SaaS, not admin panel** — Linear/Vercel/Raycast quality
- **Chinese-first UI** — Natural Chinese labels with technical terms in English

## License

MIT
