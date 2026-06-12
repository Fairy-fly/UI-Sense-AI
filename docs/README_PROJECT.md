# UI Sense AI — Project Documentation

## Project Name

**UI Sense AI**

## Project Positioning

UI Sense AI is a personal UI inspiration collection and Agent prompt generation platform.  
It helps you:

1. **Collect** — Save screenshots of UI designs you love (websites, apps, open-source projects)
2. **Analyze** — Deconstruct the design DNA: style, colors, fonts, layouts, spacing
3. **Learn** — Systematically record your design preferences and aesthetic tendencies
4. **Generate** — Turn your taste and references into structured UI prompts for Claude Code / Codex

The core differentiator: this is not a simple image bookmarking tool. It's a **design intelligence system** that bridges the gap between "I like this UI" and "here is an executable prompt that produces that quality."

## Current Phase

**Phase 0 — Project Initialization** ✅

- [x] Next.js 15 + TypeScript project initialized
- [x] Tailwind CSS 4 configured
- [x] shadcn/ui initialized with 12 base components
- [x] Project directory structure created
- [x] Global styles and design tokens configured
- [x] Minimal homepage with product messaging
- [x] Dashboard placeholder page
- [x] Environment variable template
- [x] Prisma schema drafted (inactive until Phase 3)
- [x] ESLint + Prettier configured
- [x] Build passes cleanly

## How to Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev

# Or build for production
npm run build
npm start
```

Visit `http://localhost:3000` to see the app.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui (base-nova style) |
| Icons | Lucide React |
| Database | SQLite + Prisma (Phase 3+) |
| AI | Provider abstraction layer (Phase 6+) |

## Upcoming Phases

| Phase | Focus | Status |
|-------|-------|--------|
| 0 | Project Initialization | ✅ Current |
| 1 | Design System & Base Layout | ⬜ Next |
| 2 | All Static Page UIs | ⬜ |
| 3 | Database & Basic CRUD | ⬜ |
| 4 | Upload & Inspiration Gallery | ⬜ |
| 5 | Prompt Generator | ⬜ |
| 6 | AI Interface Preparation | ⬜ |
| 7 | Polish & MVP Delivery | ⬜ |

## Design Philosophy

- **Premium, not flashy** — Neutral color palette, subtle borders, no heavy shadows
- **Clean, not cluttered** — Generous spacing, clear hierarchy, intentional emptiness
- **Modern SaaS, not admin panel** — Linear/Vercel/Raycast quality, not generic dashboard
- **Design tool aesthetic** — Feels like a tool for designers, not a school project

## Key Constraints (MVP)

- Local-only, single user
- SQLite database (file-based, zero config)
- No authentication
- No cloud sync
- No real AI API (mock only until Phase 6+)
- Prompt generation is rule-based, not AI-powered (Phase 5)
