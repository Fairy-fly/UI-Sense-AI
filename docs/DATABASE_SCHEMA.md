# 数据库设计草案 · UI Sense AI

## ER 图

```
┌──────────────────────┐       ┌──────────────────────┐
│     inspirations     │       │        tags          │
├──────────────────────┤       ├──────────────────────┤
│ id (UUID)            │       │ id (UUID)            │
│ title                │       │ name                 │
│ description?         │       │ category?            │
│ source_url?          │       │ color?               │
│ image_url            │       │ created_at           │
│ project_type?        │       │ updated_at           │
│ rating               │       └──────────┬───────────┘
│ notes?               │                  │
│ created_at           │       ┌──────────┴───────────┐
│ updated_at           │       │  inspiration_tags    │
└──────────┬───────────┘       ├──────────────────────┤
           │                   │ id (UUID)            │
           │ 1 ────────── N    │ inspiration_id (FK)  │
           │                   │ tag_id (FK)          │
           │                   │ created_at           │
           │                   └──────────────────────┘
           │
           │ 1 ────── 0..1
           │
┌──────────┴───────────┐       ┌──────────────────────┐
│    ai_analysis       │       │   prompt_records     │
├──────────────────────┤       ├──────────────────────┤
│ id (UUID)            │       │ id (UUID)            │
│ inspiration_id (FK)  │       │ title                │
│ color_analysis?      │       │ target_project       │
│ layout_analysis?     │       │ project_type?        │
│ component_analysis?  │       │ selected_ids (JSON)  │
│ style_summary?       │       │ generated_prompt     │
│ design_keywords?     │       │ design_system_prompt? │
│ created_at           │       │ page_level_prompt?   │
│ updated_at           │       │ component_level_prompt?│
└──────────────────────┘       │ created_at           │
                               │ updated_at           │
                               └──────────────────────┘

┌──────────────────────┐
│  user_preferences    │
├──────────────────────┤
│ id (UUID)            │
│ preferred_styles?    │
│ disliked_styles?     │
│ preferred_colors?    │
│ preferred_layouts?   │
│ default_tech_stack?  │
│ default_ui_style?    │
│ updated_at           │
└──────────────────────┘
```

---

## 表结构详细设计

### 1. inspirations — UI 灵感

保存用户收藏的 UI 截图及其元信息。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | UUID (String) | ✅ | 主键，自动生成 |
| `title` | String | ✅ | 灵感标题 |
| `description` | String? | ❌ | 描述 |
| `source_url` | String? | ❌ | 来源 URL |
| `image_url` | String | ✅ | 图片路径（本地 /uploads/... 或外部 URL） |
| `project_type` | String? | ❌ | 项目类型 (SaaS, Mobile App, Portfolio, etc.) |
| `rating` | Int | ✅ | 评分 1-5 |
| `notes` | String? | ❌ | 个人备注 |
| `created_at` | DateTime | ✅ | 创建时间 |
| `updated_at` | DateTime | ✅ | 更新时间 |

**索引**: `project_type`, `rating`, `created_at`

---

### 2. tags — 标签

系统化的标签体系，按 category 分类。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | UUID (String) | ✅ | 主键 |
| `name` | String | ✅ | 标签名称 |
| `category` | String? | ❌ | 分类: style/color/layout/component/mood/project_type |
| `color` | String? | ❌ | 标签颜色（CSS class, e.g. "neutral"） |
| `created_at` | DateTime | ✅ | 创建时间 |
| `updated_at` | DateTime | ✅ | 更新时间 |

**预置标签分类**:

| category | 示例值 |
|----------|--------|
| `style` | Minimal, Elegant, Playful, Futuristic |
| `color` | Neutral, Dark, Pastel, Gradient |
| `layout` | Grid, Sidebar, Card-based, Magazine |
| `component` | Table, Command Menu, Kanban, Timeline |
| `mood` | Calm, Sharp, Warm, Premium |
| `project_type` | SaaS, Mobile App, Portfolio, Dashboard, AI Tool, Landing Page |

**索引**: `category`, `name` (unique)

---

### 3. inspiration_tags — 关联表

灵感和标签的多对多关联。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | UUID (String) | ✅ | 主键 |
| `inspiration_id` | UUID (FK) | ✅ | 关联 inspiration |
| `tag_id` | UUID (FK) | ✅ | 关联 tag |
| `created_at` | DateTime | ✅ | 创建时间 |

**唯一约束**: (`inspiration_id`, `tag_id`)

---

### 4. ai_analysis — AI 分析结果

保存 AI 对 UI 截图的自动分析结果。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | UUID (String) | ✅ | 主键 |
| `inspiration_id` | UUID (FK) | ✅ | 关联的 inspiration（一对一） |
| `color_analysis` | String? | ❌ | 色彩分析 |
| `layout_analysis` | String? | ❌ | 布局分析 |
| `component_analysis` | String? | ❌ | 组件分析 |
| `style_summary` | String? | ❌ | 风格总结 |
| `design_keywords` | String? | ❌ | 设计关键词 |
| `created_at` | DateTime | ✅ | 创建时间 |
| `updated_at` | DateTime | ✅ | 更新时间 |

**唯一约束**: `inspiration_id`（一个灵感只有一个分析结果）

---

### 5. prompt_records — Prompt 记录

保存用户生成过的 UI 提示词。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | UUID (String) | ✅ | 主键 |
| `title` | String | ✅ | 记录标题 |
| `target_project` | String | ✅ | 目标项目名称 |
| `project_type` | String? | ❌ | 项目类型 |
| `selected_inspiration_ids` | String | ✅ | 选中的参考图 ID 列表（JSON 字符串） |
| `generated_prompt` | String | ✅ | 生成的完整 Prompt |
| `design_system_prompt` | String? | ❌ | 设计系统级 Prompt |
| `page_level_prompt` | String? | ❌ | 页面级 Prompt |
| `component_level_prompt` | String? | ❌ | 组件级 Prompt |
| `created_at` | DateTime | ✅ | 创建时间 |
| `updated_at` | DateTime | ✅ | 更新时间 |

---

### 6. user_preferences — 用户偏好

保存用户的默认偏好设置（单例表，只有一条记录）。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | UUID (String) | ✅ | 主键 |
| `preferred_styles` | String? | ❌ | 偏好的风格（JSON 数组） |
| `disliked_styles` | String? | ❌ | 不喜欢的风格（JSON 数组） |
| `preferred_colors` | String? | ❌ | 偏好的颜色（JSON 数组） |
| `preferred_layouts` | String? | ❌ | 偏好的布局（JSON 数组） |
| `default_tech_stack` | String? | ❌ | 默认技术栈 |
| `default_ui_style` | String? | ❌ | 默认 UI 风格 |
| `updated_at` | DateTime | ✅ | 更新时间 |

---

## 迁移策略

### 阶段 3: SQLite（当前）
```bash
DATABASE_URL="file:./dev.db"
```

### 未来: Supabase PostgreSQL
```bash
DATABASE_URL="postgresql://..."
```
只需修改 `prisma/schema.prisma` 中的 `provider` 字段，重新 migrate 即可。

---

## Prisma Schema 草案

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Inspiration {
  id          String   @id @default(uuid())
  title       String
  description String?
  sourceUrl   String?  @map("source_url")
  imageUrl    String   @map("image_url")
  projectType String?  @map("project_type")
  rating      Int      @default(3)
  notes       String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  tags       InspirationTag[]
  analysis   AiAnalysis?
  @@map("inspirations")
}

model Tag {
  id        String   @id @default(uuid())
  name      String   @unique
  category  String?
  color     String?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  inspirations InspirationTag[]
  @@map("tags")
}

model InspirationTag {
  id            String      @id @default(uuid())
  inspirationId String      @map("inspiration_id")
  tagId         String      @map("tag_id")
  createdAt     DateTime    @default(now()) @map("created_at")

  inspiration Inspiration @relation(fields: [inspirationId], references: [id], onDelete: Cascade)
  tag         Tag         @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([inspirationId, tagId])
  @@map("inspiration_tags")
}

model AiAnalysis {
  id                String   @id @default(uuid())
  inspirationId     String   @unique @map("inspiration_id")
  colorAnalysis     String?  @map("color_analysis")
  layoutAnalysis    String?  @map("layout_analysis")
  componentAnalysis String?  @map("component_analysis")
  styleSummary      String?  @map("style_summary")
  designKeywords    String?  @map("design_keywords")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  inspiration Inspiration @relation(fields: [inspirationId], references: [id], onDelete: Cascade)
  @@map("ai_analysis")
}

model PromptRecord {
  id                     String   @id @default(uuid())
  title                  String
  targetProject          String   @map("target_project")
  projectType            String?  @map("project_type")
  selectedInspirationIds String   @map("selected_inspiration_ids")
  generatedPrompt        String   @map("generated_prompt")
  designSystemPrompt     String?  @map("design_system_prompt")
  pageLevelPrompt        String?  @map("page_level_prompt")
  componentLevelPrompt   String?  @map("component_level_prompt")
  createdAt              DateTime @default(now()) @map("created_at")
  updatedAt              DateTime @updatedAt @map("updated_at")

  @@map("prompt_records")
}

model UserPreference {
  id               String   @id @default(uuid())
  preferredStyles  String?  @map("preferred_styles")
  dislikedStyles   String?  @map("disliked_styles")
  preferredColors  String?  @map("preferred_colors")
  preferredLayouts String?  @map("preferred_layouts")
  defaultTechStack String?  @map("default_tech_stack")
  defaultUiStyle   String?  @map("default_ui_style")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@map("user_preferences")
}
```

---

## 当前数据库使用说明（阶段 4）

### Inspiration

| 字段 | 当前用途 |
|------|----------|
| `imageUrl` | 保存真实上传图片路径，例如 `/uploads/2026-06-11/1718123456789-abc123.png` |
| `previewVariant` | 没有真实图片时的 MockPreview fallback（如 `linear`、`vercel`、`raycast` 等） |

### 关系与删除行为

- **Inspiration ↔ Tag**：通过 `InspirationTag` 多对多关联。创建/编辑灵感时自动 `getOrCreateTags`。
- **删除 Inspiration**：先删除其 `InspirationTag` 关联记录，再删除 `AiAnalysis`，最后删除 Inspiration 本身。
- **Tag 主表**：删除灵感时不会删除 Tag，保证其他灵感引用的标签不受影响。

### 各表当前状态

| 表 | 当前状态 |
|----|-------------|
| `inspirations` | ✅ 完整 CRUD（创建、编辑、删除、查询） |
| `tags` | ✅ getOrCreateTags，支持复用已有标签和创建新标签 |
| `inspiration_tags` | ✅ 自动管理关联 |
| `ai_analysis` | ⏸️ 仅 seed 数据，v2.0 接入 AI 图片分析 |
| `prompt_records` | ✅ DeepSeek AI 优化 + 本地模板双轨，完整 CRUD |
| `user_preferences` | ✅ v1.2 已实现 Settings 持久化（upsert） |
| `collections` | ✅ v1.3 新增，完整 CRUD |
| `inspiration_collections` | ✅ v1.3 新增，多对多关联，级联删除 |

### PromptRecord 说明

- `selectedInspirationIds` 使用 JSON 字符串保存选中的 inspiration id 数组，与 Inspiration 表为弱关联（非外键）
- `generatedPrompt` 保存完整的 10 段结构化 Prompt
- `designSystemPrompt` 保存设计系统分段（色彩/字体/间距/圆角/阴影/组件/禁止项）
- `pageLevelPrompt` 保存页面要求分段（每页的目标/布局/内容/交互/响应式）
- `componentLevelPrompt` 保存组件规范分段（Button/Card/Input/Badge/Sidebar/Header 等）
- 当前 Prompt 由本地模板生成器 + DeepSeek AI 优化双轨生成（v1.2+）
- DeepSeek API 已于 v1.2 接入 Prompt 优化

### 未接入的功能

- ❌ AI 图片分析（截图视觉分析）
- ❌ 登录 / 多用户
- ❌ 云存储 / 对象存储

---

## v1.3 新增表

### 7. collections — 收藏集

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | UUID (String) | ✅ | 主键 |
| `name` | String | ✅ | 收藏集名称 |
| `description` | String? | ❌ | 描述 |
| `cover_color` | String? | ❌ | 封面颜色 |
| `created_at` | DateTime | ✅ | 创建时间 |
| `updated_at` | DateTime | ✅ | 更新时间 |

### 8. inspiration_collections — 灵感-收藏集关联表

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | UUID (String) | ✅ | 主键 |
| `inspiration_id` | UUID (FK) | ✅ | 关联 inspiration |
| `collection_id` | UUID (FK) | ✅ | 关联 collection |
| `created_at` | DateTime | ✅ | 创建时间 |

**唯一约束**: (`inspiration_id`, `collection_id`)
**删除行为**: 删除 Collection 时自动删除关联记录，不删除 Inspiration
