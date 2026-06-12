# 开发计划 · UI Sense AI

## 总览

本项目采用 **7 阶段渐进式开发**，遵循以下核心原则：

- **先好看，再好用** — UI 视觉质量优先于功能完整性
- **先静态 UI，再业务逻辑** — 页面先用 mock 数据打磨，再接入数据库
- **先本地 MVP，再云端** — SQLite + 本地存储先行，再考虑 Supabase 等云方案
- **先 Prompt 生成引擎，再真实 AI** — 结构化的 Prompt 构建逻辑优先于 AI API 集成
- **先保证个人使用价值，再考虑商业扩展**

---

## 阶段 0：项目初始化 ✅ 当前阶段

**目标**: 搭建 UI Sense AI 的基础工程框架，验证项目可以正常启动运行。

**任务清单**:

- [x] 初始化 Next.js + TypeScript 项目
- [x] 配置 Tailwind CSS 4
- [x] 配置 ESLint + Prettier
- [x] 设置路径别名 `@/`
- [x] 创建项目目录结构
- [x] 编写全局样式与设计 Token
- [x] 创建 Landing Page（静态展示页）
- [x] 编写 README.md
- [x] 创建 docs 目录及核心文档
- [x] 创建 .env.example
- [x] 定义 TypeScript 类型文件
- [ ] 安装 npm 依赖
- [ ] 验证 `npm run dev` 正常启动
- [ ] 验证首页可访问
- [ ] 初始化 Git 提交

**验收标准**:
- `npm run dev` 正常启动无报错
- 首页可访问，显示 UI Sense AI 品牌信息
- Tailwind CSS 样式生效
- 项目目录结构清晰完整
- 无 TypeScript 类型错误
- 无 ESLint 报错

---

## 阶段 1：设计系统与基础布局

**目标**: 建立项目统一的视觉系统，构建 AppShell 和后台页面框架。

**主要任务**:
1. 完善全局 CSS 变量（颜色、间距、圆角、阴影）
2. 集成 shadcn/ui 组件库
3. 实现浅色/深色模式切换（dark mode toggle）
4. 构建 AppShell 布局组件（Sidebar + Header + Content）
5. 构建 Sidebar 导航组件
6. 构建 Header 组件
7. 构建 PageHeading 统一组件
8. 构建 EmptyState 组件
9. 构建 StatCard 统计卡片组件
10. 创建所有后台页面路由占位

**涉及页面**:
- `/dashboard` — Dashboard
- `/inspirations` — 灵感库
- `/inspirations/new` — 上传灵感
- `/prompts` — Prompt 生成器
- `/settings` — 设置

**验收标准**:
- 所有后台页面使用统一布局
- Sidebar 样式与交互正确
- Header 显示自然
- 页面标题和说明统一
- 卡片圆角、边框、间距统一
- 无传统的"管理后台感"
- 浅色模式效果完整

---

## 阶段 2：所有静态页面 UI

**目标**: 构建所有核心页面的高质量静态 UI（使用 mock 数据，不接数据库）。

**主要任务**:
1. 完善 Landing Page（产品感）
2. 构建 Dashboard 静态页面（统计卡片、偏好概览）
3. 构建灵感库列表/网格页面
4. 构建上传表单页面
5. 构建灵感详情页面
6. 构建 Prompt 生成页面（左右分栏布局）
7. 构建设置页面
8. 创建 mock 数据文件
9. 实现空状态、加载状态、错误状态
10. 确保响应式布局

**涉及页面**:
- `/` — Landing Page
- `/dashboard` — Dashboard
- `/inspirations` — 灵感库列表
- `/inspirations/new` — 上传表单
- `/inspirations/[id]` — 灵感详情
- `/prompts` — Prompt 生成器
- `/settings` — 设置

**验收标准**:
- 所有页面可访问
- 各页面视觉统一
- Landing Page 有产品感
- Dashboard 有成熟 SaaS Dashboard 感
- 灵感库卡片展示美观
- 上传页表单布局合理
- 详情页信息层级清晰
- Prompt 页面左右分栏合理
- 设置页排版整洁

---

## 阶段 3：数据库与基础 CRUD

**目标**: 引入 Prisma + SQLite，实现灵感、标签、Prompt、偏好的基础读写。

**主要任务**:
1. 安装并配置 Prisma
2. 编写 `prisma/schema.prisma` 数据模型
3. 运行 `prisma migrate dev`
4. 创建 seed 脚本并写入示例数据
5. 创建 `lib/db.ts` Prisma 客户端单例
6. 创建 `lib/actions/inspirations.ts`
7. 创建 `lib/actions/prompts.ts`
8. 创建 `lib/actions/preferences.ts`
9. 将 Dashboard 和灵感库页面的 mock 数据切换为数据库读取
10. 验证所有类型无错误

**数据表**:
- `inspirations` — UI 灵感
- `tags` — 标签
- `inspiration_tags` — 灵感-标签关联
- `ai_analysis` — AI 分析结果
- `prompt_records` — Prompt 记录
- `user_preferences` — 用户偏好

**验收标准**:
- Prisma 成功生成并 migrate
- SQLite 数据库文件生成
- seed 数据成功写入
- 灵感库页面读取真实数据
- Dashboard 显示真实统计
- 详情页读取真实数据
- 设置页读取和保存偏好
- 无 TypeScript 类型错误

---

## 阶段 4：上传与灵感库功能

**目标**: 实现真实的图片上传、灵感 CRUD、标签管理。

**主要任务**:
1. 实现 `/app/api/upload/route.ts` 图片上传 API
2. 图片保存到 `/public/uploads`
3. 上传页表单真实提交
4. 支持创建灵感并关联标签
5. 灵感库展示真实上传的图片
6. 详情页展示真实数据
7. 支持删除灵感
8. 支持编辑灵感信息
9. 集成 toast 通知
10. 添加 Zod 表单校验

**验收标准**:
- 可以上传图片
- 图片保存到本地
- 创建灵感后在灵感库可见
- 点击卡片进入详情页
- 标签正确显示
- 评分正确显示
- 删除后列表更新
- 编辑信息保存成功
- 表单校验正常
- toast 提示正常

---

## 阶段 5：Prompt 生成器

**目标**: 实现根据项目信息和参考图生成结构化 UI 提示词。

**主要任务**:
1. Prompt 页面加载真实灵感数据
2. 支持选择多个参考 UI
3. 支持填写项目信息表单
4. 编写 `lib/ai/prompt-builder.ts` 核心逻辑
5. 生成全局 UI 指导提示词
6. 生成设计系统提示词
7. 生成页面级提示词
8. 生成组件级提示词
9. 支持复制到剪贴板
10. 支持保存到 `prompt_records`
11. Dashboard 显示最近的 Prompt

**验收标准**:
- 可以选择多个参考图
- 可以填写项目名称、类型、目标用户、技术栈、页面列表
- 生成的 Prompt 结构完整
- Prompt 包含 UI 设计要求
- Prompt 包含禁止出现的风格
- Prompt 适合直接粘贴给 Claude Code / Codex
- 可以复制 Prompt
- 可以保存 Prompt 记录
- Dashboard 显示最近生成的 Prompt

---

## 阶段 6：AI 接口预留

**目标**: 为后续接入 AI API 预留完整的架构。

**主要任务**:
1. 创建 AI Provider 抽象接口
2. 创建 DeepSeek API 封装（mock 模式）
3. 创建 `/app/api/ai/analyze/route.ts`
4. 创建 `/app/api/ai/generate-prompt/route.ts`
5. 在设置页添加 API Key 配置位
6. 在上传页和详情页添加 "Analyze with AI" 按钮
7. mock 结果可写入 `ai_analysis` 表
8. 详情页展示 AI 分析结果

**验收标准**:
- AI 分析按钮存在
- 点击后获得 mock 分析结果
- mock 结果可保存到数据库
- 详情页可展示分析结果
- 设置页有 API Key 输入位
- 架构支持替换为真实 DeepSeek API

---

## 阶段 7：打磨优化与 MVP 交付

**目标**: 全面审查和优化，确保 MVP 质量。

**主要任务**:
1. 审查所有页面的视觉统一性
2. 优化响应式布局
3. 优化空状态设计
4. 优化加载状态动画
5. 优化错误提示
6. 优化交互细节
7. 清理 mock 数据
8. 审查 Prompt 生成质量
9. 完善 README
10. 完善验收清单
11. 代码清理
12. 确保 `npm run build` 通过

**验收标准**:
- `npm run dev` 正常运行
- `npm run build` 成功
- 所有页面可访问
- 上传流程完整可用
- 灵感库浏览正常
- 详情页显示正常
- Prompt 生成流程正常
- 设置页可配置
- 页面视觉统一
- 无传统后台感
- 无 TypeScript 错误

---

## 后续扩展方向（超出 MVP）

- 🔗 真实 AI API 接入（图片识别、自动分析）
- 🧠 品味学习系统（自动归纳用户偏好）
- 🧩 Chrome 浏览器扩展（一键收藏网页）
- 📸 网页截图服务（输入 URL 自动截图）
- 🏪 Prompt 模板市场
- 🎨 项目级 UI Kit 生成（色彩系统、组件规范、Tailwind Token）
- ☁️ 云端版本（Supabase Auth + PostgreSQL + 对象存储）
