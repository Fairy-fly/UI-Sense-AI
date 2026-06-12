# 设计系统规范 · UI Sense AI

> **核心关键词**: 高级、清爽、克制、Modern SaaS、设计工具感、AI 工具感、精致不张扬

---

## 设计哲学

### ✅ 应该做的
- 灰白和中性色为主，给图表和数据留出视觉空间
- 用细边框和微弱层级替代阴影
- 统一圆角、统一间距
- 标签用低饱和度颜色
- 字体层级简洁清晰
- 信息密度适中

### ❌ 不应该做的
- 避免传统后台感（大色块侧边栏、高饱和色按钮）
- 避免渐变过多
- 避免大面积阴影
- 避免鲜艳彩色标签
- 避免信息拥挤
- 避免默认模板感
- 避免学生项目感

---

## 色彩系统

### Light Mode

| Token | Value | 用途 |
|-------|-------|------|
| `--background` | `#FAFAFA` | 页面背景 |
| `--foreground` | `#18181B` | 主文字色 |
| `--card` | `#FFFFFF` | 卡片背景 |
| `--card-border` | `#E4E4E7` | 卡片边框 |
| `--muted` | `#F4F4F5` | 次级背景 |
| `--muted-foreground` | `#71717A` | 次级文字 |
| `--primary` | `#18181B` | 主色（接近黑色） |
| `--primary-foreground` | `#FFFFFF` | 主色上的文字 |
| `--accent` | `#EEF2FF` | 强调色背景 |
| `--accent-foreground` | `#3730A3` | 强调色文字 |
| `--destructive` | `#EF4444` | 危险操作色 |
| `--border` | `#E4E4E7` | 通用边框 |
| `--ring` | `#18181B` | 聚焦环 |

### Dark Mode（预留）

暗色模式下相应的灰度值反转。

---

## 字体系统

### 字体栈

```css
--font-sans: "Inter", "Geist Sans", system-ui, -apple-system,
  BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei",
  sans-serif;

--font-mono: "JetBrains Mono", "Fira Code", Menlo, Monaco, monospace;
```

### 字号层级

| 层级 | 大小 | 字重 | 用途 |
|------|------|------|------|
| Page Title | 28px ~ 36px | `font-semibold` | 页面主标题 |
| Page Subtitle | 14px ~ 16px | `font-normal` | 页面副标题（muted） |
| Card Title | 15px ~ 18px | `font-medium` | 卡片标题 |
| Body | 14px ~ 15px | `font-normal` | 正文 |
| Caption | 12px ~ 13px | `font-normal` | 辅助说明 |

---

## 圆角规范

统一使用，不要每个地方圆角都不一样。

| 元素 | 圆角值 |
|------|--------|
| 小组件（Badge） | `8px` |
| 按钮（Button） | `10px` |
| 卡片（Card） | `14px ~ 16px` |
| 图片容器 | `18px ~ 24px` |

---

## 阴影规范

尽量不用阴影，以边框和背景层级区分。

| 场景 | 规范 |
|------|------|
| 默认卡片 | 无阴影，使用细边框 |
| Hover 卡片 | 微 shadow-sm |
| 弹出层 | 中等阴影 |
| 大量阴影 | ❌ 避免 |

---

## 间距规范

| 场景 | 值 |
|------|-----|
| 页面左右 padding | `24px ~ 32px` |
| 页面最大宽度 | `1200px ~ 1400px` |
| 卡片内 padding | `20px ~ 24px` |
| 模块间 gap | `16px / 24px / 32px` |

---

## 组件规范

### Button

- 默认使用 `variant="outline"`（细边框）
- 主要操作使用 `variant="default"`（深色背景）
- 圆角统一 `10px`
- 尺寸 `sm` / `default` / `lg`

### Card

- 白色背景 `#FFFFFF`
- 细边框 `#E4E4E7`
- 圆角 `14px ~ 16px`
- 内边距 `20px ~ 24px`

### Badge

- 低饱和度背景色
- 边框加 subtle 阴影
- 圆角 `8px`
- 字号 `12px`

### Input / Textarea

- 白色背景
- 细边框
- 圆角 `10px`
- Focus 时边框变深

---

## 标签配色方案

| 标签名 | CSS 类 |
|--------|--------|
| Minimal | `neutral` |
| SaaS | `zinc` |
| Soft | `violet muted` |
| Dashboard | `slate` |
| Mobile | `stone` |
| AI Tool | `indigo muted` |

标签颜色要低饱和，不要用鲜艳的高饱和色。

---

## 空状态规范

所有列表页面都需要有空状态设计。

空状态包含：
1. 示意图标
2. 标题
3. 说明文字
4. 行动按钮

示例：
> 还没有收藏任何 UI 灵感。
> 上传第一张你喜欢的好看截图，让 UI Sense AI 开始学习你的品味。

---

## 参考产品

UI Sense AI 不应完全模仿某一款产品，而应融合以下产品的优秀特质：

| 产品 | 借鉴点 |
|------|--------|
| **Linear** | 克制、高级、极简、深色界面 |
| **Vercel** | 开发者工具感、黑白灰、强对比预览区 |
| **Notion** | 信息组织、低饱和图标、信息层级清晰 |
| **Raycast** | 效率工具感、快捷搜索、无干扰 |
| **Mobbin** | 灵感库浏览体验、卡片布局、截图展示 |
| **Figma Community** | 设计资源展示、设计工具感 |

---

## 推荐关键词

以下关键词建议在 Prompt 中描述 UI Sense AI 时使用：

- Modern SaaS
- Minimal but warm
- Calm productivity tool
- Design intelligence dashboard
- Curated inspiration library
- Premium developer tool
- Soft neutral interface
- Clean card-based layout
- Low-saturation visual system
- Mature AI product interface
