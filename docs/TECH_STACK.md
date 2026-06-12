# 技术选型说明 · UI Sense AI

## 总览

| 分层 | 技术 | 版本 | 选型理由 |
|------|------|------|----------|
| 框架 | Next.js | 15.x | App Router、Server Components、Server Actions |
| 语言 | TypeScript | 5.7 | 类型安全、IDE 智能提示 |
| 样式 | Tailwind CSS | 4.x | 原子化 CSS、设计 Token 天然支持 |
| 组件库 | shadcn/ui | latest | 高质量、可定制、无依赖捆绑 |
| 数据库 | SQLite | 3 | 零配置、文件级存储、适合本地 MVP |
| ORM | Prisma | 6.x | 类型安全、自动迁移、管理界面 |
| 表单 | React Hook Form + Zod | 7.54 / 3.24 | 高性能表单 + 类型安全校验 |
| 图标 | Lucide React | 0.474 | 高质量、与 shadcn/ui 组件配套 |
| 工具 | clsx + tailwind-merge + cva | — | 类名合并、样式变体管理 |
| 主题 | next-themes | 0.4 | 浅色/深色模式切换 |
| AI (预留) | DeepSeek API | — | 性价比高、中文友好 |

---

## 为什么选 Next.js 15 App Router？

1. **Server Components** — 默认服务端渲染，数据查询直接写在组件中，无需额外的 API 层
2. **Server Actions** — 表单提交、数据变更直接用异步函数，减少样板代码
3. **App Router** — 文件系统路由，目录结构即路由结构
4. **Image Optimization** — 内置图片优化，对灵感库的截图展示友好
5. **活跃生态** — 与 Vercel、shadcn/ui、Prisma 等深度集成

## 为什么选 SQLite + Prisma？

1. **零运维** — 不需要安装数据库服务，一个文件搞定
2. **本地优先** — MVP 不需要云数据库，本地文件足够
3. **易于迁移** — Prisma 支持多数据库，后续可以无缝切换到 PostgreSQL (Supabase)
4. **类型安全** — Prisma Client 自动生成类型，杜绝运行时 SQL 错误
5. **管理界面** — `npx prisma studio` 提供可视化数据管理

## 为什么选 Tailwind CSS 4？

1. **设计 Token 友好** — CSS 变量与 Tailwind 类名天然映射
2. **零运行时** — 编译时生成 CSS，无 JS 运行时开销
3. **与 shadcn/ui 配套** — shadcn/ui 基于 Tailwind，统一技术栈
4. **v4 新特性** — CSS-first 配置、更快的构建速度、更好的性能

## 为什么选 shadcn/ui？

1. **可定制** — 组件源码直接放在项目中，随意修改
2. **高质量** — 每个组件都经过精心设计，符合现代审美
3. **无依赖捆绑** — 不是 npm 包，不增加 node_modules
4. **渐进式** — 按需引入，不需要的组件不影响打包体积
5. **配套工具** — 与 Lucide 图标、React Hook Form 等深度配合

## 为什么预留 AI Provider 抽象层？

1. **API 可能更换** — DeepSeek、OpenAI、Claude API 可能在不同场景下使用
2. **成本控制** — 前期用 mock，后期切换真实 API，不影响业务代码
3. **接口统一** — `analyzeUI()` 和 `generatePrompt()` 两个核心接口，内部实现可替换
4. **测试友好** — mock provider 可以在无网络环境下开发和测试

## 不选（MVP 阶段）

| 技术 | 原因 |
|------|------|
| 远程数据库 (PostgreSQL/MySQL) | MVP 不需要多设备、不需要团队协作 |
| 对象存储 (S3/R2) | 本地文件足够，预留 `image_url` 字段方便迁移 |
| 认证系统 (NextAuth/Clerk) | MVP 只给个人使用，无需登录 |
| 状态管理库 (Redux/Zustand) | Server Components + URL 状态为主，客户端状态极少 |
| Docker | MVP 不需要容器化部署 |
| 微服务架构 | 单体应用足够，Server Actions 已提供后端能力 |

---

## 开发环境要求

| 工具 | 最低版本 |
|------|----------|
| Node.js | 20.x |
| npm | 10.x |
| Git | 2.x |
| 操作系统 | Windows / macOS / Linux |

## 生产环境考虑（未来）

- **部署**: Vercel（推荐，与 Next.js 深度集成）
- **数据库**: Supabase PostgreSQL
- **存储**: Supabase Storage / Cloudflare R2
- **认证**: Supabase Auth / NextAuth.js
- **监控**: Vercel Analytics
