# UI Sense AI

> Design memory for AI agents — 本地优先的 UI 灵感、审美记忆与 Agent Prompt 生成工具。

**v2.0.6** · README 版本展示同步版

UI Sense AI 帮你收集优质 UI 界面、分析设计语言、沉淀个人审美偏好，并生成可直接交给 Claude Code / Codex 执行的高质量 UI 开发 Prompt。核心目标：让 AI Agent 生成的前端界面更高级、更统一、更贴近你的审美，不再像廉价后台模板。

---

## Why UI Sense AI

AI Agent 生成界面时有几个顽固问题：

* 看起来都像默认后台模板，缺乏产品质感
* 每次生成的风格不一致
* 配色、圆角、间距、组件语言没有长期记忆
* 你不知道什么样的 Prompt 产出最好

UI Sense AI 用一套本地工具把这些隐性偏好变成可复用、可迭代的结构化资产。

---

## Core Features

| 功能 | 说明 |
|------|------|
| UI 灵感收藏 | 上传截图、填写标签和评分，记录优秀参考 |
| AI 设计分析 | 基于元信息或真实图片分析配色、布局、组件和设计语言 |
| 审美记忆生成 | 从高评分灵感和 AI 分析中自动总结长期审美偏好 |
| Prompt 生成器 | 模板 + 灵感 + 审美记忆 + 反馈策略，生成可执行开发提示词 |
| Prompt 反馈 | 对历史 Prompt 评分、收藏、标记好用/需要改进 |
| 反馈反哺策略 | 从反馈中总结 Prompt 结构和风格偏好，自动优化后续生成 |
| 收藏集管理 | 按项目方向整理灵感，支持 Prompt 按收藏集筛选 |
| URL 元信息读取 | 粘贴网页链接自动填入标题、描述和 favicon |
| 视觉分析 (可选) | 配置 OpenAI-compatible 视觉模型后，支持真实图片分析 |
| 本地优先 | SQLite 本地存储，不上传数据，不依赖云服务 |

---

## Product Workflow

```
收藏 UI 灵感 → AI 分析设计特征 → 生成审美记忆
                                    ↓
填写项目需求 → 选择参考灵感 → 生成 Prompt
                                    ↓
使用 Prompt → 反馈评分 → 反哺后续策略
```

---

## Screenshots

> 建议后续放入脱敏后的演示截图，例如 Dashboard、UI 灵感库、Prompt 生成器、Settings 审美记忆与反馈洞察。

推荐截图位：

* Dashboard — 统计概览与欢迎指引
* Inspirations — 灵感列表与筛选
* Prompt Generator — 模板选择、参考灵感、审美记忆注入
* Prompt Feedback — 评分、标签、收藏
* Settings — 审美记忆、Prompt 反馈洞察、AI 配置

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | SQLite + Prisma |
| AI (text) | DeepSeek API (OpenAI SDK compatible) |
| AI (vision) | OpenAI-compatible multimodal endpoint (e.g. Bailian) |
| Validation | Zod |
| Toast | Sonner |
| Icons | Lucide React |

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/Fairy-fly/UI-Sense-AI.git
cd UI-Sense-AI

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — see Environment Variables below

# 4. Initialize database
npx prisma generate
npx prisma migrate dev

# 5. Seed demo data (optional)
npx prisma db seed

# 6. Start dev server
npm run dev
```

访问 `http://localhost:3007`（实际端口以终端输出为准）。

---

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite path, default: `file:./dev.db` |
| `DEEPSEEK_API_KEY` | No | DeepSeek API key for Prompt optimization |
| `DEEPSEEK_BASE_URL` | No | Default: `https://api.deepseek.com` |
| `DEEPSEEK_MODEL` | No | Default: `deepseek-v4-flash` |
| `AI_ANALYSIS_MODE` | No | `text` (default) or `vision` |
| `VISION_MODEL` | No | Vision model ID, e.g. `qwen3-vl-flash` |
| `VISION_API_BASE_URL` | No | OpenAI-compatible endpoint |
| `VISION_API_KEY` | No | Vision API key |
| `NEXT_PUBLIC_APP_URL` | No | Default: `http://localhost:3007` |
| `MAX_UPLOAD_SIZE` | No | Default: `10485760` (10MB) |

> **Never commit `.env.local`** — it's in `.gitignore`.

---

## Data & Safety

* All data stored locally in `prisma/dev.db` (SQLite)
* Uploaded images saved in `public/uploads/` (gitignored except `.gitkeep`)
* API keys used server-side only — never exposed to frontend
* `.env.local` excluded from git tracks
* URL Metadata fetcher validates protocol, blocks localhost and private IP ranges
* Image analysis reads only local `/uploads/` files, with size and MIME checks
* No telemetry, no cloud upload, no external analytics

---

## Project Structure

```
app/              # Next.js App Router pages
components/       # React components (prompts, inspirations, collections, settings, ui)
lib/              # Core logic (actions, ai, filters, prompt-builder, aesthetic-memory)
prisma/           # Database schema and migrations
public/uploads/   # User-uploaded images (gitignored)
docs/             # Project documentation
types/            # TypeScript type definitions
```

---

## Version Milestones

| Version | Highlight |
|---------|-----------|
| v1.0 | MVP: inspiration CRUD, local prompt builder, DeepSeek AI |
| v1.3 | Collections, Prompt templates, URL metadata |
| v1.4 | AI text analysis, Vision provider foundation |
| v1.6 | Real vision analysis via Bailian API |
| v1.7 | Aesthetic memory generation |
| v1.8 | Prompt feedback: ratings, favorites, SelectableChip |
| v1.9 | Feedback-driven prompt strategy |
| v2.0 | Local product polish, full regression, stable release |
| v2.0.1 | README / GitHub showcase polish |
| v2.0.2 | README table rendering and version display fix |
| v2.0.3 | Move planning DOCX into docs/ |
| v2.0.4 | Project memory update after local tool phase completion |
| v2.0.5 | Add reusable Agent workflow skills and clean project memory |
| v2.0.6 | README version display and milestone sync |

---

## Roadmap

- **v2.1** Demo screenshots and sample data
- **v2.2** Prompt quality reports
- **v2.3** Batch import UI inspirations
- **v2.4** Better mobile layout
- **v3.0** Optional cloud sync / multi-user (future)

---

## Development Notes

```bash
npm run dev        # Start dev server
npm run build      # Production build
npx tsc --noEmit   # Type check
npm run lint       # ESLint
npx prisma studio  # Browse database
```

### Before committing

```bash
npm run build && npx tsc --noEmit && npm run lint
```

### Rules

- Never commit `.env.local`, `prisma/dev.db`, or user images in `public/uploads/`
- Never expose API keys in frontend code, docs, or git history
- Default branch: `main`
- UI copy is Chinese-first; don't translate to English
- Don't use `asChild` on shadcn components — use `buttonVariants()` for link-styled buttons

---

## License

MIT
