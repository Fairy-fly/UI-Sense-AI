# UI Sense AI vNext — Brand Differentiation Engine + Spatial Governance

> 迭代需求文档 · 2026-06  
> 状态：规划中  
> 上一稳定版本：v2.1.3

---

## 1. 迭代背景

UI Sense AI 当前已经具备较好的 Prompt 生成基础能力，尤其在 v2.1.x 阶段通过 Scope Guard 解决了"页面范围失控"和"模块被错误拆成独立路由"的问题。

当前能力已经可以较稳定地完成：

- 根据项目阶段控制主页面数量
- 区分主页面与页面内模块
- 避免 v0.1 阶段生成过多路由
- 将模块内聚到合适页面
- 输出基础视觉规范
- 输出参考灵感分析
- 输出可交给 Claude Code / Codex 使用的开发 Prompt

但是在 MoodCanvas 测试中发现，虽然 UI Sense AI 生成的 Prompt 能让 Agent 做出"干净、规范、像样"的界面，但不同项目之间容易出现明显同质化问题。

典型表现包括：

- 项目容易收敛到 `shadcn/ui + 白卡片 + zinc/indigo + sidebar/topbar` 的通用 SaaS 模板
- 页面布局虽然正确，但品牌风格不够鲜明
- 导航栏、按钮、标签、卡片、Inspector 等组件缺乏项目专属视觉语言
- 背景板、封面、视觉素材系统不够有识别度
- Prompt 中大量使用"高级、干净、Linear、Vercel、Raycast、中性色、卡片式布局"等通用审美词，导致生成结果安全但不够惊艳
- Agent 能执行结构约束，但缺少足够具体的美术指导

因此，UI Sense AI 下一阶段不应只继续优化"页面范围控制"，而应升级为：

> 能生成具有项目专属品牌方向、视觉母题、布局轮廓、组件签名和空间治理规则的高质量 UI 开发 Prompt。

---

## 2. 迭代目标

本次 vNext 的目标是让 UI Sense AI 从"通用 UI Prompt 生成器"升级为"品牌化 UI Prompt 生成器"。

核心目标包括：

1. 让不同项目生成的 Prompt 不再只有通用高级感，而是具备项目专属品牌气质。
2. 让 Prompt 能明确指导 Claude Code / Codex 做出差异化视觉设计。
3. 让 Prompt 不只是描述风格形容词，而是输出可执行的视觉规则。
4. 让设计工具、灵感库、作品集、开发者工具、健康陪伴、学习工具等不同类型项目拥有不同布局轮廓。
5. 让 Prompt 能指导生成专属导航、按钮、卡片、标签、背景、封面、Inspector 等组件语言。
6. 在鼓励大胆设计的同时，加入空间治理规则，避免控件贴边、布局失控、留白混乱。
7. 保留 v2.1 Scope Guard 的页面收口能力，不能因为视觉增强而破坏页面范围控制。

---

## 3. 当前问题总结

### 3.1 页面范围问题已基本解决

v2.1.x 已经解决：

- v0.1 阶段主页面过多
- 模块被拆成独立路由
- AI 优化后 Scope Guard 被破坏
- 中文/英文模块识别不稳定
- MoodCanvas 设计工具模块被错误暂缓

这些能力必须保留。

### 3.2 新的核心问题：风格同质化

MoodCanvas 测试暴露出新的主要问题：

即使页面范围正确，生成出来的网站仍可能像：

- UI Sense AI 换皮版
- 普通 shadcn SaaS 模板
- 干净但缺少品牌记忆点的工具页
- Linear / Vercel / Raycast 风格的平均化结果

这说明现有 Prompt 缺少"品牌差异化层"。

### 3.3 美术指导不够具体

现有 Prompt 往往会写：

- 高级工具感
- 克制
- 中性色
- 轻量边框
- 大圆角
- 卡片式布局
- 参考 Linear / Vercel / Raycast

这些词能避免丑，但不足以生成真正有辨识度的品牌界面。

未来 Prompt 需要进一步输出：

- 项目人格
- 视觉母题
- 布局轮廓
- 组件签名
- 视觉素材配方
- 反模板规则
- 空间治理规则
- 大胆程度等级

---

## 4. vNext 核心能力设计

UI Sense AI vNext 建议拆成三层能力：

### 4.1 Scope Guard（沿用 v2.1.x）

负责控制：

- 当前开发阶段
- 主页面数量
- 页面内模块
- 暂缓页面
- 禁止拆路由
- 页面与模块归属

这部分沿用 v2.1.x 能力，不在此次迭代中修改。

### 4.2 Brand Differentiation Engine（v2.2 新增）

负责生成：

- 品牌风格 DNA
- 视觉母题
- 布局轮廓策略
- 组件签名系统
- Mock 视觉素材配方
- 反同质化硬约束
- 大胆程度等级

这是 vNext 的核心新增能力。

### 4.3 Spatial Governance（v2.3 新增）

负责约束：

- 安全边距
- 顶部栏高度
- 内容区最大宽度
- 画布内边距
- 卡片间距
- Inspector 宽度
- 按钮与边缘距离
- 大胆构图下的空间纪律

这部分用于避免"有风格但贴边、拥挤、失控"。

---

## 5. 新增 Prompt 结构

未来 UI Sense AI 生成的 Prompt 建议新增以下章节。

### 5.1 品牌风格 DNA / Brand Style DNA

根据项目名称、项目类型、目标用户、补充说明、参考灵感，自动生成项目专属品牌方向。

输出内容至少包含：

- 项目人格
- 情绪关键词
- 品牌气质
- 这个项目不应该像什么
- 这个项目应该像什么
- 最重要的视觉记忆点

**MoodCanvas 示例：**

```md
## 品牌风格 DNA

项目人格：
- Editorial Curator / 视觉策展人
- Material Lab / 设计材料实验室
- Quiet Creative Studio / 安静的创意工作室

情绪关键词：
- curated
- tactile
- editorial
- chromatic
- calm
- visual-first
- studio-grade

这个项目不应该像：
- 普通 SaaS 后台
- 项目管理工具
- 默认 shadcn 模板
- UI Sense AI 的同款外壳
- Linear / Vercel / Raycast 的直接复制

这个项目应该像：
- 数字化色样册
- 视觉策展工作台
- 设计师灵感墙
- 设计材料档案馆
- 轻量 Refero / Dribbble 收藏夹
```

### 5.2 视觉母题 / Visual Motifs

为项目提供 3-5 个具体视觉母题，让 Agent 不只知道"风格高级"，还知道应围绕哪些视觉语言展开。

**MoodCanvas 示例：**

```md
## 视觉母题

1. Swatch Book / 色样册
   色卡不只是辅助信息，而是核心品牌元素。每个 Board 和 Inspiration 都应有可见的色彩身份。

2. Gallery Wall / 画廊墙
   Boards 页面应像灵感墙，而不是项目列表。封面视觉是第一层信息。

3. Annotation Strip / 策展注释条
   标签、来源、日期、备注应像策展标注，而不是普通后台字段。

4. Studio Canvas / 工作室画布
   Board Detail 中间区域应像视觉画布，素材像摆放在工作台上的 specimen。
```

**其他项目类型示例：**

| 项目类型 | 视觉母题 |
|---------|---------|
| 开发者工具 | Command Center, Split Panel, Terminal Surface, Status Rail, Workflow Timeline |
| 学习工具 | Study Desk, Progress Path, Concept Card, Review Timeline, Focus Board |
| 健康陪伴 | Calm Card, Daily Rhythm, Soft Progress, Gentle Reminder, Personal Journal |
| 作品集 | Magazine Layout, Hero Case Study, Project Archive, Visual Index, Client Grid |

### 5.3 布局轮廓策略 / Layout Silhouette Strategy

避免所有项目默认使用 `AppShell + Sidebar + Header + PageHeading + Card Grid`。
改为根据项目类型选择不同布局轮廓。

**支持的布局轮廓：**

| 编号 | 名称 | 结构 | 适合类型 |
|------|------|------|---------|
| LS-01 | SaaS Dashboard | Sidebar + Content + Chart Grid | 数据分析、后台管理 |
| LS-02 | Design Tool | Top Studio Bar + Canvas + Inspector | 设计工具、灵感库 |
| LS-03 | Inspiration Gallery | Gallery Grid + Filter Pills + Detail Panel | 作品集、画廊 |
| LS-04 | Developer Tool | Command Center + Split Panel + Activity Feed | 开发者工具 |
| LS-05 | Portfolio / Showcase | Magazine Layout + Hero + Case Cards | 作品集、展示站 |
| LS-06 | Mobile App Demo | Phone-first Layout + Bottom Tabs | 移动端原型 |
| LS-07 | Personal Tracker | Timeline + Daily Cards + Gentle Summary | 个人工具、健康 |
| LS-08 | Creative Tool | Workbench + Floating Toolbar + Asset Rail | 创意工具、编辑器 |

**MoodCanvas 示例：**

```md
## 布局轮廓策略

推荐布局：LS-02 Design Tool
Top Studio Bar + Gallery Canvas + Curator Inspector

原因：
MoodCanvas 是视觉情绪板工具，核心不是数据管理，而是浏览、整理、策展视觉素材。
因此不应使用普通 Sidebar Dashboard，而应采用更接近设计工具和灵感画廊的布局。

禁止布局：
- 传统 Sidebar + PageHeading + Stat Cards
- 普通 SaaS Dashboard
- 三列白卡片项目管理列表

页面轮廓：
- Dashboard：Chromatic Workbench
- Boards：Gallery Wall
- Board Detail：Studio Canvas + Curator Inspector
```

### 5.4 组件签名系统 / Component Signature System

让关键组件具备项目专属风格，而不是直接使用默认 Button / Card / Badge。

至少覆盖：

- Navigation Signature
- Button Language
- Card Language
- Tag / Badge Language
- Detail Panel / Inspector Language
- Empty State Language
- Visual Asset / Cover Language

**MoodCanvas 示例：**

```md
## 组件签名系统

Navigation Signature：
使用 MC Studio Bar。导航应像色样册索引或设计工作室工具条，不要像普通 SaaS 顶栏。

Button Language：
建立 Swatch Button、Studio Tool Button、Annotation Link 三类按钮。
不要所有按钮都是 bg-black + rounded-md。

Card Language：
BoardCard 应像 moodboard specimen，包含大封面、palette spine、index label、annotation tags。

Tag Language：
标签应像 annotation chip 或 specimen label，不要只是普通灰色 badge。

Inspector Language：
右侧面板应像 Curator Inspector，展示 selected specimen、palette、typography、notes、export。
不要做成普通表单面板。

Visual Asset Language：
使用 CSS 生成 visual surfaces，不依赖外部图片，不出现破图。
```

### 5.5 Mock 视觉素材配方 / Mock Visual Asset Recipes

解决视觉类项目没有真实素材时容易出现破图、灰色占位、skeleton 感的问题。

**必须支持的 recipe：**

| 编号 | 名称 | 描述 |
|------|------|------|
| VR-01 | editorial-poster | 大标题字母 + 色块 + 小排版线，像设计海报缩略图 |
| VR-02 | interface-board | 模拟 UI 截图，包含窗口栏、侧栏、卡片、小图表块 |
| VR-03 | type-specimen | 大号字体样本，例如 Aa / Type / Grid / Form |
| VR-04 | chromatic-field | 大面积色域、柔和渐变、低饱和撞色 |
| VR-05 | material-sample | 材质实验感，细噪点、块面、柔和层次 |
| VR-06 | grid-study | 细网格 + 局部色块 + 对齐线 |
| VR-07 | collage-system | 多个不同大小色块拼贴 + 标签条 |
| VR-08 | minimal-wireframe | 极简界面草图感，像产品结构研究 |

**MoodCanvas 示例：**

```md
## Mock 视觉素材配方

不要依赖外部图片。不要使用远程图片。不要出现 broken image icon。不要出现 alt 文本外露。

使用 CSS / div 生成 mock visual surfaces：

推荐的 8 种 visual recipe 详见附件。
每个 Board 和 Inspiration 封面应使用不同 recipe，避免重复。
每张卡片视觉差异应明显。
```

### 5.6 反同质化硬约束 / Anti-Template Rules

阻止 Agent 回到默认模板。

```md
## 反同质化硬约束

禁止：
- 只是使用默认 shadcn navbar
- 只是使用普通白卡片
- 只是使用 bg-black 主按钮
- 只是使用 muted gray badge
- 只是把 sidebar 换成 topbar
- 只是把图片换成浅灰占位
- 全站只使用固定 indigo accent
- 页面之间只有布局差异，没有品牌差异

必须：
- 至少 3 个核心组件体现项目专属品牌语言
- 导航栏必须有项目专属识别
- 主按钮必须有项目专属变化
- 卡片封面必须成为视觉主角
- 页面首屏必须体现项目身份
```

### 5.7 空间治理规则 / Spatial Governance

在允许大胆设计的同时，保证布局成熟、留白合理、控件不贴边。

```md
## 空间治理规则

1. 桌面端页面左右至少保留 24px 安全边距。
2. 大屏内容区建议使用 32px 到 48px 外边距。
3. 顶部 Studio Bar 高度建议 52px 到 64px。
4. 所有按钮距离浏览器边缘至少 16px，推荐 24px。
5. 页面标题、导航、主按钮不要贴住 viewport 边缘。
6. 卡片不能直接顶到页面最左侧或最上方。
7. Board Detail 中的 canvas 区域四周至少保留 32px 内边距。
8. Inspector 宽度建议 360px 到 420px。
9. 大胆构图可以保留，但必须看起来是"有意设计"，不是"挤出去"。
10. 视觉可以破格，但空间秩序不能失控。
```

### 5.8 大胆程度等级 / Boldness Level

根据项目类型自动控制风格大胆程度。

| 等级 | 适用场景 | 说明 |
|------|---------|------|
| `safe` | 企业后台、财务、医疗严肃系统 | 保守、规范、可预测 |
| `balanced` | 普通 SaaS 工具 | 干净现代，但不激进 |
| `bold` | 设计工具、灵感库、作品集、创意工具 | 大胆构图、强视觉识别、非对称 |
| `experimental` | 实验艺术项目、创意展示 | 最大自由度，允许打破常规 |

**默认规则：**

- 企业后台、财务、医疗严肃系统 → `safe` / `balanced`
- 普通 SaaS 工具 → `balanced`
- 设计工具、灵感库、作品集、创意工具 → `bold`
- 实验艺术项目、创意展示项目 → `bold` / `experimental`

```md
## 大胆程度

boldnessLevel = bold

这意味着：
- 允许更明显的构图变化
- 允许更强的封面视觉
- 允许非对称布局
- 允许更有性格的按钮和标签
- 允许减少普通白卡片比例
- 允许背景有轻微实验性
- 但仍要保持可读、可用、高级
```

---

## 6. UI Sense AI 生成流程调整

未来 Prompt 生成建议流程：

1. **读取用户输入**：项目名称、项目类型、目标用户、页面列表、补充说明、参考灵感、审美记忆

2. **执行 Scope Guard**（v2.1 已有）：判断开发阶段、收口主页面、识别页面内模块、暂缓非核心页面

3. **执行 Brand Differentiation Engine**（v2.2 新增）：推断品牌人格、视觉母题、布局轮廓、组件签名、mock 视觉素材配方、boldnessLevel

4. **执行 Spatial Governance**（v2.3 新增）：根据 boldnessLevel 输出空间约束、为布局轮廓补充安全边距、为画布/Inspector/卡片网格补充 spacing 规则

5. **生成最终 Prompt**：页面范围 + 品牌风格 + 视觉母题 + 布局轮廓 + 组件签名 + 页面结构 + 技术栈 + 禁止项 + 验收标准

---

## 7. 建议新增纯函数

建议在代码层面新增以下纯函数，方便测试和维护：

```ts
inferBrandDNA(input)              // 推断品牌人格
inferVisualMotifs(input)          // 推断视觉母题
inferLayoutSilhouette(input)      // 推断布局轮廓
inferComponentSignatures(input)   // 推断组件签名
inferMockVisualRecipes(input)     // 推断 mock 视觉素材配方
inferBoldnessLevel(input)         // 推断大胆程度
buildAntiTemplateRules(input)     // 构建反模板规则
buildSpatialGovernanceRules(input)// 构建空间治理规则
buildBrandDifferentiationSections(input) // 组装品牌差异化章节
```

这些函数不应依赖数据库，也不应直接调用 AI API。
初期可以使用规则判断，后续再考虑让 AI 参与风格推断。

---

## 8. MoodCanvas 验证标准

以 MoodCanvas 作为第一验证样本。

### 输入

```
项目名称：MoodCanvas
项目类型：设计工具
目标用户：喜欢收集 UI 灵感、配色、字体和视觉风格的设计师、前端开发者、学生作品集创作者。
页面列表：仪表盘、情绪板列表、情绪板详情、色卡提取、字体偏好、风格标签、灵感详情、收藏状态、备注、导出卡片、设置
```

### 预期 Prompt 必须包含

- [ ] Brand Style DNA
- [ ] Visual Motifs
- [ ] Layout Silhouette Strategy
- [ ] Component Signature System
- [ ] Mock Visual Asset Recipes
- [ ] Anti-Template Rules
- [ ] Spatial Governance
- [ ] Boldness Level
- [ ] 明确 3 个主页面
- [ ] 明确 7 个模块内聚到 Board Detail
- [ ] 明确禁止普通 SaaS / shadcn 同质化结构

### 预期开发效果

生成的网站应具备：

- [ ] MC Studio / MoodCanvas 专属品牌感
- [ ] Studio Bar 导航，而不是普通 sidebar/topbar
- [ ] Boards 像 Gallery Wall
- [ ] Board Detail 像 Studio Canvas + Curator Inspector
- [ ] 卡片像 moodboard specimen
- [ ] 封面使用 CSS visual surfaces，不破图
- [ ] 按钮具备 swatch / studio tool 特征
- [ ] 背景具备 canvas / paper / material 感
- [ ] 整体明显区别于 UI Sense AI 和默认 shadcn SaaS

---

## 9. 第二验证样本建议

为了确认不是只对 MoodCanvas 生效，还应再测试一个不同类型项目。

### DevFlow

| 属性 | 值 |
|------|-----|
| 项目类型 | 开发者工具 |
| 定位 | 帮助开发者管理任务、Git 提交、Prompt、风险提醒和发布流程 |
| 预期风格 | Command Center, Split Panel, Activity Feed, Terminal Surface, Status Rail |
| 气质 | 更理性、更效率、更接近开发者工作台 |
| 不应像 | MoodCanvas、普通后台 |

### StudyOrbit

| 属性 | 值 |
|------|-----|
| 项目类型 | 学习管理工具 |
| 定位 | 学生个人学习计划、错题、复习节奏和任务追踪 |
| 预期风格 | Study Desk, Daily Timeline, Review Cards, Gentle Progress, Calm Focus |
| 气质 | 更温和、更陪伴、更轻量 |
| 不应像 | MoodCanvas、DevFlow |

---

## 10. 成功标准

UI Sense AI vNext 迭代是否成功，不看 Prompt 本身是否写得华丽，而看生成结果是否变化。

1. MoodCanvas 生成结果明显不再像 UI Sense AI。
2. MoodCanvas 生成结果明显不再像默认 shadcn SaaS。
3. MoodCanvas 具备清晰品牌识别。
4. 第二个新项目与 MoodCanvas 风格明显不同。
5. 不同项目的导航、按钮、卡片、背景、面板语言出现差异。
6. 页面范围控制仍然稳定。
7. 模块归属仍然稳定。
8. Agent 能按 Prompt 落地，而不是回到模板。
9. Prompt 里的视觉指导足够具体，不只停留在形容词。
10. 生成结果可以作为 GitHub README / 答辩 / 作品集截图展示。

---

## 11. 非目标

本次 vNext 不做：

- 不做数据库 schema 改动
- 不做多用户系统
- 不做真实商业化 SaaS
- 不做真实图片生成
- 不做 Figma 插件
- 不做真实设计资产库
- 不做复杂在线协作
- 不做 Prompt 市场
- 不做新 AI provider 接入
- 不破坏现有 v2.1 Scope Guard 能力

---

## 12. 版本建议

### v2.2 — Brand Differentiation Engine

重点实现：

- Brand Style DNA
- Visual Motifs
- Layout Silhouette
- Component Signature
- Mock Visual Recipes
- Anti-Template Rules

### v2.3 — Spatial Governance

重点实现：

- 安全边距
- 画布内边距
- 导航高度
- Inspector 尺寸
- 卡片间距
- 大胆风格下的空间纪律

### v3.0 — Brand-Aware Prompt Generation

可合并 v2.2 + v2.3 为一个较大的版本，定位为 UI Sense AI 的重大能力升级。

---

## 13. 结论

UI Sense AI 当前已经解决了"Prompt 能不能控制页面范围"的问题。
下一阶段需要解决的是"Prompt 能不能稳定生成有品牌个性的界面"。

MoodCanvas 测试证明：

- 只靠"高级、干净、Linear/Vercel/Raycast"会导致同质化
- 加入品牌人格、视觉母题、组件签名后，风格化明显增强
- 加入空间治理后，大胆设计可以变得更成熟
- 未来 UI Sense AI 的核心竞争力不应只是生成可用 Prompt，而是生成能让 Agent 做出差异化设计的品牌化 Prompt

因此，vNext 的正确方向是：

> **Scope Guard + Brand Differentiation Engine + Spatial Governance**

这三层能力共同构成 UI Sense AI 下一阶段的核心 Prompt 生成体系。
