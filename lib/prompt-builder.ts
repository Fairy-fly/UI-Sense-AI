/**
 * Prompt Builder — Local template-based prompt generator.
 *
 * Phase 5: rule-based generation using user input + inspiration data + preferences.
 * Phase 6: will be replaced/augmented with real AI API calls via lib/ai/.
 */

import type { Inspiration } from "@/types";
import { getPromptTemplate } from "@/lib/prompt-templates";
import { isLegacySeedAnalysis } from "@/lib/ai-analysis-utils";
import { type DevelopmentPhase, type ScopeGuardResult, classifyPageItems, developmentPhases } from "@/lib/scope-guard";
import { displayLabel, displayLabelInText } from "@/lib/display-labels";

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
  /** v2.1a: Development phase for scope guard */
  developmentPhase?: DevelopmentPhase;
  /** v2.1a: Pre-computed scope guard results (generated from pageList + phase) */
  scopeGuard?: ScopeGuardResult;
  aestheticMemory?: {
    summary: string;
    preferredStyles: string[];
    preferredColors: string[];
    preferredLayouts: string[];
    preferredComponents: string[];
    avoidedStyles: string[];
    keywords: string[];
    agentInstruction?: string;
  };
  feedbackInsights?: import("@/lib/prompt-feedback-insights").PromptFeedbackInsights;
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
    developmentPhase,
    scopeGuard,
    aestheticMemory,
    feedbackInsights,
    userPreferences,
  } = input;

  const template = promptTemplateId ? getPromptTemplate(promptTemplateId) : undefined;

  const pages = pageList.split(/[,，、\n]/).map((p) => p.trim()).filter(Boolean);

  // ---- Helper: translate internal label arrays to Chinese display values ----
  function translateLabels(values: string[] | undefined): string {
    if (!values?.length) return "";
    return values.map((v) => displayLabel(v)).join("、");
  }

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
## 3.5. AI 分析参考：请转化为 UI 实现决策

${inspWithAnalysis
    .map(
      (insp) => `### ${insp.title}

#### 可迁移设计决策
* **色彩与视觉氛围**：${insp.analysis!.colorAnalysis ?? "—"}
* **布局与信息层级**：${insp.analysis!.layoutAnalysis ?? "—"}
* **组件语言**：${insp.analysis!.componentAnalysis ?? "—"}
* **整体风格迁移**：${insp.analysis!.styleSummary ?? "—"}
* **可复用关键词**：${insp.analysis!.designKeywords ?? "—"}

#### 使用方式
请不要逐字照搬参考图，而是吸收其布局组织方式、组件密度、配色节奏、卡片和导航语言、信息层级处理方式，转化为你自己的 UI 实现。`,
    )
    .join("\n\n")}
`
      : "";

  // ---- Helper: format preferences ----
  const prefStyles = translateLabels(userPreferences?.preferredStyles) || "极简 SaaS、中性配色、冷静高效的工具风格";
  const prefColors = translateLabels(userPreferences?.preferredColors) || "石板灰、锌灰、中性色";
  const prefLayouts = translateLabels(userPreferences?.preferredLayouts) || "侧边栏 + 内容、卡片网格";
  const disStyles = [...new Set([...(avoidedStyles ?? []), ...(userPreferences?.dislikedStyles ?? [])])];

  // ---- Helper: build §0 Scope Guard section (v2.1a) ----
  function buildScopeSection(): string {
    if (!developmentPhase && !scopeGuard) return "";

    const sg = scopeGuard ?? classifyPageItems(pageList, developmentPhase);
    const phaseLabel = developmentPhase
      ? (developmentPhases.find((p) => p.value === developmentPhase)?.label ?? developmentPhase)
      : undefined;

    const lines: string[] = [];
    lines.push("## 0. 开发阶段与页面范围");
    lines.push("");

    if (phaseLabel) {
      lines.push(`- **开发阶段**：${phaseLabel}`);
      lines.push("");
    }

    // Must build now
    if (sg.mustBuildNow.length > 0) {
      lines.push(`### 本阶段必须实现的主页面（${sg.mustBuildNow.length} 个）`);
      lines.push("");
      sg.mustBuildNow.forEach((p, i) => {
        lines.push(`${i + 1}. **${p}** — 独立路由页面`);
      });
      lines.push("");
    }

    // Modules inside pages
    if (sg.modulesAsComponents.length > 0) {
      lines.push("### 页面内模块（不作为独立路由）");
      lines.push("");
      sg.modulesAsComponents.forEach((m) => {
        const item = sg.items.find((it) => it.name === m);
        const hint = item?.reason ? `（${item.reason}）` : "";
        lines.push(`- **${m}** → 作为主页面内的 Tab、Card、Drawer 或折叠面板实现 ${hint}`);
      });
      lines.push("");
    }

    // Deferred to next phase
    if (sg.deferToNext.length > 0) {
      const nextPhase = developmentPhase === "v0.1" ? "v0.2" : developmentPhase === "v0.2" ? "v1.0" : "后续版本";
      lines.push(`### 暂缓到 ${nextPhase}`);
      lines.push("");
      sg.deferToNext.forEach((p) => {
        lines.push(`- **${p}**`);
      });
      lines.push("");
    }

    // Warnings / scope advice
    if (sg.warnings.length > 0) {
      lines.push("### 范围提醒");
      lines.push("");
      sg.warnings.forEach((w) => {
        lines.push(`> ⚠️ ${w}`);
      });
      lines.push("");
    }

    // Core principle
    lines.push("**核心原则**：当前阶段聚焦最核心的流程。不要为每个模块创建独立页面。模块应作为主页面内的区域来实现，而不是独立路由。");
    lines.push("");

    return lines.join("\n");
  }

  const scopeSection = buildScopeSection();

  // ---- 1. Full Prompt ----
  const fullPrompt = `# UI 开发提示词 —— ${projectName}
${scopeSection ? `\n${scopeSection}` : ""}
## 1. 任务目标与角色

你是一名高级 UI/UX 设计师和 ${techStack[0] ?? "Next.js"} 前端工程师。你的任务是：基于以下项目背景、参考灵感和设计约束，开发一个可落地的高质量前端界面。

**关键目标**：
- 输出应接近 Linear、Vercel、Raycast 的产品质感，而非传统后台模板
- 配色克制、留白舒适、信息层级清晰
- 组件语言统一，交互状态完整
- 可直接复制到 Claude Code / Codex 执行

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

${aestheticMemory ? `## 4.5. 我的审美记忆

以下是 UI Sense AI 根据你的灵感收藏、评分和 AI 分析自动总结的长期审美偏好：

${aestheticMemory.summary ? `**审美摘要**：${displayLabelInText(aestheticMemory.summary)}` : ""}
${aestheticMemory.preferredStyles?.length ? `**偏好风格**：${translateLabels(aestheticMemory.preferredStyles)}` : ""}
${aestheticMemory.preferredColors?.length ? `**偏好配色**：${translateLabels(aestheticMemory.preferredColors)}` : ""}
${aestheticMemory.preferredLayouts?.length ? `**偏好布局**：${translateLabels(aestheticMemory.preferredLayouts)}` : ""}
${aestheticMemory.preferredComponents?.length ? `**偏好组件**：${translateLabels(aestheticMemory.preferredComponents)}` : ""}
${aestheticMemory.avoidedStyles?.length ? `**避免风格**：${translateLabels(aestheticMemory.avoidedStyles)}` : ""}

${aestheticMemory.agentInstruction ? `**Agent 审美指令**：
${displayLabelInText(aestheticMemory.agentInstruction)}` : ""}

> 这段审美记忆用于保持后续生成 UI 的一致性。请把它作为长期偏好参考，不要覆盖项目模板和当前参考灵感。` : ""}

${feedbackInsights ? `## 4.6. 历史 Prompt 反馈参考

以下是 UI Sense AI 根据你对历史 Prompt 的评分、收藏和反馈标签总结出的提示词偏好：

${feedbackInsights.strategySummary ? `**反馈摘要**：${feedbackInsights.strategySummary}` : ""}
${feedbackInsights.positiveTags?.length ? `**偏好的 Prompt 特征**：${feedbackInsights.positiveTags.join("、")}` : ""}
${feedbackInsights.negativeTags?.length ? `**需要避免的问题**：${feedbackInsights.negativeTags.join("、")}` : ""}
${feedbackInsights.agentInstruction ? `**Agent 生成策略**：${feedbackInsights.agentInstruction}` : ""}

> 这段反馈只用于优化提示词表达方式，不覆盖当前项目需求、Prompt 模板和参考灵感。` : ""}

## 5. 技术栈

${techStack.map((t) => `- ${t}`).join("\n")}

## 6. 页面结构建议

${scopeGuard && scopeGuard.mustBuildNow.length > 0 ? `
根据项目类型${template ? `（${template.name}）` : ""}和开发阶段（${developmentPhase ?? "未指定"}），本阶段只实现 ${scopeGuard.mustBuildNow.length} 个主页面：

${scopeGuard.mustBuildNow.map((p, i) => `### 页面 ${i + 1}：${p}
- 明确此页面的核心目标和用户任务
- 使用 AppShell 统一布局（Sidebar + Header + Content）
- 内容区 max-width: 1280px，合理留白
- 顶部放 PageHeading（标题 + 描述 + 操作按钮）
- 按信息层级组织内容区块，优先展示最重要的数据
- 空状态：虚线边框卡片 + 引导文案 + 行动按钮
- 加载状态：Skeleton 占位，避免闪烁
- 响应式：桌面优先，移动端基本可用`).join("\n\n")}

${scopeGuard.modulesAsComponents.length > 0 ? `### 页面内模块安排

以下内容不要创建独立路由，而应放入主页面内部：

${scopeGuard.modulesAsComponents.map((m) => {
    const bestPage = scopeGuard.mustBuildNow.find(p =>
      m.includes(p) || p.includes(m) ||
      (m.includes("仪表") && p.includes("仪表")) ||
      (m.includes("项目") && p.includes("项目")) ||
      (m.includes("Prompt") && p.includes("Prompt"))
    ) || scopeGuard.mustBuildNow[0];
    return `- **${m}**：建议放入「${bestPage}」页，作为 Card / Tab / Drawer 实现`;
  }).join("\n")}` : ""}

${scopeGuard.deferToNext.length > 0 ? `### 暂缓页面

以下页面暂缓到${developmentPhase === "v0.1" ? " v0.2" : developmentPhase === "v0.2" ? " v1.0" : " 后续版本"}，本阶段不要创建路由：

${scopeGuard.deferToNext.map((p) => `- **${p}**`).join("\n")}` : ""}
` : `
根据项目类型${template ? `（${template.name}）` : ""}，请按以下结构实现页面：

${pages.map((p, i) => `### 页面 ${i + 1}：${p}
- 明确此页面的核心目标和用户任务
- 使用 AppShell 统一布局（Sidebar + Header + Content）
- 内容区 max-width: 1280px，合理留白
- 顶部放 PageHeading（标题 + 描述 + 操作按钮）
- 按信息层级组织内容区块，优先展示最重要的数据
- 空状态：虚线边框卡片 + 引导文案 + 行动按钮
- 加载状态：Skeleton 占位，避免闪烁
- 响应式：桌面优先，移动端基本可用`).join("\n\n")}`}

${template ? `### 模板专属建议
${template.structureHints.map((h) => `- ${h}`).join("\n")}` : ""}

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

${disStyles.length > 0 ? disStyles.map((s) => `- ❌ ${displayLabel(s)}`).join("\n") : `- ❌ 廉价蓝白后台
- ❌ 大面积亮蓝色
- ❌ 过度渐变
- ❌ 大阴影（>4px blur）
- ❌ 默认模板感
- ❌ 学生作业感
- ❌ 信息层级混乱
- ❌ 高饱和彩色标签`}

## 9. 开发顺序

按以下顺序逐步实现，先保证视觉统一再补细节：

1. 搭建全局设计 Token（色彩、字体、间距、圆角）
2. 构建布局骨架（AppShell、Sidebar、Header、内容区）
3. 实现各页面静态 UI（先用 mock 数据打磨视觉）
4. 实现核心组件（卡片、按钮、输入框、标签、空状态等）
5. 接入数据读写和交互逻辑
6. 补全交互状态（hover、loading、empty、error、toast）
7. 响应式适配和最终视觉走查

**关键原则**：
- 先做静态 UI 再连数据，不要在组件里混写数据获取逻辑
- 保持组件职责单一，props 类型清晰
- 所有状态（loading/empty/error）都要有对应 UI

## 10. 验收标准

### 视觉验收
- [ ] 不像传统后台管理系统或默认模板
- [ ] 有明确视觉层级，信息密度合理
- [ ] 卡片、按钮、标签风格统一
- [ ] 配色低饱和且克制，留白舒适
- [ ] 整体接近 Linear、Vercel、Raycast 的产品质感

### 代码验收
- [ ] TypeScript strict 模式，类型清晰
- [ ] 组件可复用，props 接口明确
- [ ] 使用 shadcn/ui 组件，不重复造轮
- [ ] Tailwind CSS 类名统一，不混用内联样式

### 交互验收
- [ ] hover 状态自然过渡
- [ ] loading 状态优雅（Skeleton 优先）
- [ ] 空状态有引导文案和行动按钮
- [ ] 错误提示友好，支持重试
- [ ] toast 通知及时且不打断操作
- [ ] 响应式布局基本可用

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

${disStyles.length > 0 ? disStyles.map((s) => `- ❌ ${displayLabel(s)}`).join("\n") : "- ❌ 廉价蓝白后台、大面积亮蓝、过度渐变、大阴影"}`;

  // ---- 3. Page Level Prompt ----
  const pageLevelPages = scopeGuard?.mustBuildNow?.length ? scopeGuard.mustBuildNow : pages;
  const pageLevelPrompt = `# 页面设计要求 —— ${projectName}

${pageLevelPages
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
