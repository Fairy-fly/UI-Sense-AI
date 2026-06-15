/**
 * Prompt Builder — Local template-based prompt generator.
 *
 * Phase 5: rule-based generation using user input + inspiration data + preferences.
 * Phase 6: will be replaced/augmented with real AI API calls via lib/ai/.
 */

import type { Inspiration } from "@/types";
import { getPromptTemplate } from "@/lib/prompt-templates";
import { isLegacySeedAnalysis } from "@/lib/ai-analysis-utils";

export interface PromptBuilderInput {
  projectName: string;
  projectType: string;
  targetUsers: string;
  selectedInspirations: Pick<Inspiration, "id" | "title" | "projectType" | "rating" | "notes" | "tags" | "analysis">[];
  desiredStyle: string;
  avoidedStyles: string[];
  techStack: string[];
  pageList: string;
  additionalNotes: string;
  promptTemplateId?: string;
  userPreferences?: {
    preferredStyles?: string[];
    preferredColors?: string[];
    preferredLayouts?: string[];
    dislikedStyles?: string[];
    defaultTechStack?: string[];
  };
}

export interface PromptSections {
  fullPrompt: string;
  designSystemPrompt: string;
  pageLevelPrompt: string;
  componentLevelPrompt: string;
}

export function generatePromptSections(input: PromptBuilderInput): PromptSections {
  const {
    projectName,
    projectType,
    targetUsers,
    selectedInspirations,
    desiredStyle,
    avoidedStyles,
    techStack,
    pageList,
    additionalNotes,
    promptTemplateId,
    userPreferences,
  } = input;

  const template = promptTemplateId ? getPromptTemplate(promptTemplateId) : undefined;

  const pages = pageList.split(/[,，、\n]/).map((p) => p.trim()).filter(Boolean);

  // ---- Helper: format inspirations ----
  const inspRefs = selectedInspirations
    .map(
      (insp, i) =>
        `### ${i + 1}. ${insp.title}
- **项目类型**：${insp.projectType ?? "—"}
- **评分**：${insp.rating}/5
- **标签**：${(insp.tags ?? []).map((t) => t.name).join("、") || "—"}
${insp.notes ? `- **可借鉴点**：${insp.notes}` : ""}`,
    )
    .join("\n\n");

  // ---- Helper: format AI analysis from inspirations ----
  const inspWithAnalysis = selectedInspirations.filter(
    (insp) => insp.analysis && !isLegacySeedAnalysis(insp.analysis),
  );

  const analysisRefs =
    inspWithAnalysis.length > 0
      ? `
## 3.5. AI 分析参考

请优先吸收以下设计特征，并转化为可执行 UI 方案：

${inspWithAnalysis
    .map(
      (insp) => `### ${insp.title}
* **色彩与视觉氛围**：${insp.analysis!.colorAnalysis ?? "—"}
* **布局与信息层级**：${insp.analysis!.layoutAnalysis ?? "—"}
* **组件语言**：${insp.analysis!.componentAnalysis ?? "—"}
* **整体风格迁移**：${insp.analysis!.styleSummary ?? "—"}
* **可复用关键词**：${insp.analysis!.designKeywords ?? "—"}`,
    )
    .join("\n\n")}
`
      : "";

  // ---- Helper: format preferences ----
  const prefStyles = userPreferences?.preferredStyles?.join("、") || "极简 SaaS、中性配色、冷静高效的工具风格";
  const prefColors = userPreferences?.preferredColors?.join("、") || "Slate、Neutral、Zinc";
  const prefLayouts = userPreferences?.preferredLayouts?.join("、") || "Sidebar + Content、Card Grid";
  const disStyles = [...new Set([...(avoidedStyles ?? []), ...(userPreferences?.dislikedStyles ?? [])])];

  // ---- 1. Full Prompt ----
  const fullPrompt = `# UI 开发提示词 —— ${projectName}

## 1. 角色设定

你是一名高级 UI/UX 设计师和 ${techStack[0] ?? "Next.js"} 前端工程师。请根据以下设计要求，生成符合现代 SaaS 产品气质的高质量前端界面。

## 2. 项目背景

- **项目名称**：${projectName}
- **项目类型**：${projectType}
- **目标用户**：${targetUsers}
${additionalNotes ? `- **补充说明**：${additionalNotes}` : ""}

${template ? `## 2.5. Prompt 模板：${template.name}

**模板说明**：${template.description}

### 结构建议
${template.structureHints.map((h) => `- ${h}`).join("\n")}

### 组件建议
${template.componentHints.map((h) => `- ${h}`).join("\n")}

### 模板提醒
${template.avoidHints.map((h) => `- ${h}`).join("\n")}
` : ""}

## 3. 参考灵感

以下是我精选的 UI 参考设计，请仔细分析它们的视觉风格和设计语言：

${inspRefs}

${analysisRefs}
## 4. 视觉风格定位

### 整体方向
${desiredStyle || `参考以上灵感的整体风格，保持 ${prefStyles}`}

### 配色
- 主色调：${prefColors}
- 背景使用柔和灰白（#FAFAFA）
- 卡片纯白（#FFFFFF）
- 边框低对比度（#E4E4E7）
- 主文字近黑（#18181B）
- 次要文字（#71717A）
- 强调色低饱和（#EEF2FF / #3730A3）

### 字体
- 英文优先 Geist / Inter
- 中文兼容 PingFang SC、Microsoft YaHei
- 标题 tracking-tight、font-semibold
- 正文 14-15px

### 布局
- 偏好布局：${prefLayouts}
- 页面最大宽度 1280px
- 卡片内边距 20-24px
- 模块间距 16px / 24px / 32px

### 卡片
- 白色背景 + 1px 细边框
- 圆角 14-16px
- 无大阴影（hover 时最多 shadow-sm）

### 按钮
- 圆角 10px
- 主按钮深色背景
- 次要按钮 outline + 细边框
- hover 轻微亮度变化

## 5. 技术栈

${techStack.map((t) => `- ${t}`).join("\n")}

## 6. 页面要求

${pages.map((p, i) => `### 页面 ${i + 1}：${p}
- 清晰的信息层级
- 统一的卡片风格
- 空状态友好提示
- 加载状态自然过渡
- 响应式适配`).join("\n\n")}

## 7. 组件风格要求

- **Button**：圆角 10px，深色主按钮 + outline 次要按钮，hover 亮度变化
- **Card**：白底 + 1px 细边框，圆角 14px，无大阴影
- **Input/Textarea**：圆角 10px，1px 边框，focus 时边框加深
- **Badge**：圆角 8px，低饱和配色，muted 背景
- **Sidebar**：深色或浅灰背景，当前路由高亮用 muted 背景
- **Header**：高度克制，不抢标题风头
- **EmptyState**：居中，虚线边框，行动按钮引导
- **Dialog**：圆角卡片，暗色遮罩，操作按钮右对齐

## 8. 严格禁止

${disStyles.length > 0 ? disStyles.map((s) => `- ❌ ${s}`).join("\n") : `- ❌ 廉价蓝白后台
- ❌ 大面积亮蓝色
- ❌ 过度渐变
- ❌ 大阴影（>4px blur）
- ❌ 默认模板感
- ❌ 学生作业感
- ❌ 信息层级混乱
- ❌ 高饱和彩色标签`}

## 9. 开发顺序

1. 搭建全局设计 Token（色彩、字体、间距、圆角）
2. 构建基础布局组件（AppShell、Sidebar、Header）
3. 实现各页面静态 UI（先用 mock 数据打磨视觉）
4. 接入数据库和数据读写
5. 添加交互细节（hover、过渡动画、toast）
6. 响应式适配和细节打磨
7. 最终视觉走查和一致性校验

## 10. 验收标准

### 视觉标准
- 整体风格接近 Linear、Vercel、Raycast 的产品质感
- 不像传统后台管理系统
- 不像学生项目或默认模板
- 配色克制，留白舒适
- 卡片、按钮、标签风格统一

### 代码标准
- TypeScript strict 模式
- 组件可复用、props 类型清晰
- 使用 shadcn/ui 组件
- Tailwind CSS 类名统一

### 交互标准
- hover 状态自然
- loading 状态优雅
- 空状态有引导
- 错误提示友好
- toast 通知及时

---

> 本 Prompt 由 UI Sense AI 自动生成。请将此内容复制到 Claude Code / Codex 中使用。`;

  // ---- 2. Design System Prompt ----
  const designSystemPrompt = `# 设计系统规范 —— ${projectName}

## 色彩系统

| Token | 颜色 | 用途 |
|-------|------|------|
| background | #FAFAFA | 页面背景 |
| foreground | #18181B | 主文字 |
| card | #FFFFFF | 卡片 |
| muted | #F4F4F5 | 次级背景 |
| muted-foreground | #71717A | 次要文字 |
| border | #E4E4E7 | 边框 |
| primary | #18181B | 主按钮 |
| destructive | #EF4444 | 危险操作 |
| accent | #EEF2FF | 强调背景 |
| accent-foreground | #3730A3 | 强调文字 |

配色方向：${prefColors}

## 字体系统

### 字体栈
- 英文：Inter, Geist Sans, system-ui
- 中文：PingFang SC, Microsoft YaHei
- 等宽：JetBrains Mono, Fira Code

### 字号层级
- 页面标题：28-36px, font-semibold, tracking-tight
- 卡片标题：15-18px, font-medium
- 正文：14-15px
- 辅助文字：12-13px

## 间距系统

- 页面左右 padding：24-32px
- 卡片内边距：20-24px
- 模块间距：16px / 24px / 32px
- 页面最大宽度：1280px

## 圆角系统

- Badge：8px
- Button：10px
- Card：14-16px
- 大容器：18-24px

## 阴影系统

- 默认卡片：无阴影，1px 细边框
- Hover 卡片：shadow-sm
- 弹出层：shadow-md
- 避免大面积 blur 阴影

## 组件风格

- 按钮：深色主按钮 + outline 次要，圆角 10px，hover 亮度变化
- 卡片：白底 + 1px 边框 #E4E4E7，圆角 14px
- Badge：低饱和背景 + subtle 边框，圆角 8px
- Input：1px 边框，圆角 10px，focus 边框加深
- Sidebar：浅灰背景，当前路由 muted 高亮
- Header：克制高度，底部细线分隔

## 深色模式预留

- CSS 变量已定义 dark 类
- 所有颜色使用 oklch 变量
- Toggle 开关后续接入

## 禁止风格

${disStyles.length > 0 ? disStyles.map((s) => `- ❌ ${s}`).join("\n") : "- ❌ 廉价蓝白后台、大面积亮蓝、过度渐变、大阴影"}`;

  // ---- 3. Page Level Prompt ----
  const pageLevelPrompt = `# 页面设计要求 —— ${projectName}

${pages
    .map(
      (p, i) => `## ${i + 1}. ${p}

### 页面目标
[根据项目需求描述此页面的核心目标和用户任务]

### 布局建议
- 使用 AppShell 统一布局（Sidebar + Header + Content）
- 内容区 max-width: 1280px
- 顶部放置 PageHeading（标题 + 描述 + 操作按钮）
- 使用卡片网格或列表展示内容

### 内容区块
- 顶部统计区（如需要）
- 主要内容区（列表/网格/表单）
- 侧边信息面板（如需要）

### 交互状态
- 空状态：虚线边框卡片 + 引导文案 + 行动按钮
- 加载状态：Skeleton 占位
- 错误状态：友好提示 + 重试按钮
- 成功状态：Toast 通知

### 响应式要求
- 桌面端优先（1280px+）
- 笔记本适配（1024px）
- 移动端基本可用（不做完整移动端优化）`,
    )
    .join("\n\n")}`;

  // ---- 4. Component Level Prompt ----
  const componentLevelPrompt = `# 组件规范要求 —— ${projectName}

## Button

- 变体：default（深色）、outline（细边框）、secondary（灰底）、ghost、destructive
- 尺寸：sm(28px)、default(32px)、lg(36px)
- 圆角：10px
- 图标：可选左/右图标，16px
- Hover：亮度变化 80%
- Disabled：opacity-50

## Card

- 背景：#FFFFFF
- 边框：1px solid #E4E4E7
- 圆角：14px
- 内边距：20-24px
- 阴影：默认无，hover shadow-sm
- 子元素间距：16px

## Input / Textarea

- 边框：1px solid #E4E4E7
- 圆角：10px
- 高度（Input）：36-40px
- Focus：边框加深至 #A1A1AA
- Placeholder：#A1A1AA
- Error：边框 #EF4444

## Badge

- 圆角：8px
- 字体：11-12px
- 配色：低饱和背景
- 变体：secondary（灰底）、outline（细边框）、destructive（红底）

## Sidebar

- 宽度：240px
- 背景：浅灰或白色
- 菜单项：图标 + 文字，圆角 10px
- 当前路由：muted 背景 + 深色文字
- Hover：浅灰背景变化

## Header

- 高度：56px
- 背景：白色
- 底部：1px 细线
- 内容：搜索占位（左）+ 操作按钮（右）

## Dialog / Modal

- 遮罩：黑色 50% 透明度
- 卡片：白色 + 圆角 16px
- 标题：15px font-medium
- 描述：13px muted
- 按钮：右对齐，取消 + 确认

## Toast (Sonner)

- 位置：右下角
- 样式：圆角卡片
- 成功：绿色图标
- 错误：红色图标
- 持续时间：3-4 秒

## Form

- 标签：13px，font-medium
- 间距：标签与输入框 6px，字段间 16px
- 校验错误：红色文字，12px，字段下方
- Submit 按钮：右对齐

## EmptyState

- 图标：柔和圆角容器内
- 标题：15px font-medium
- 描述：13px muted
- 按钮：下方居中

## Table（如需要）

- 表头：12px，muted-foreground，font-medium
- 行：hover bg-muted/50
- 边框：水平细线分隔
- 内边距：12px 16px`;

  return {
    fullPrompt,
    designSystemPrompt,
    pageLevelPrompt,
    componentLevelPrompt,
  };
}
