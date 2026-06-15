/**
 * Prompt Template Presets — v1.3.2
 *
 * Code constants — no database table needed.
 * Each template provides structure hints, component suggestions,
 * and style guidance tailored to specific project types.
 */

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  structureHints: string[];
  componentHints: string[];
  avoidHints: string[];
}

export const promptTemplates: PromptTemplate[] = [
  {
    id: "saas-dashboard",
    name: "SaaS 仪表盘",
    description: "适合控制台、管理后台、数据面板和 AI 工具。",
    structureHints: [
      "左侧边栏 + 右侧内容区经典布局",
      "顶部统计卡片区域（4 个指标卡片）",
      "主要内容区使用卡片网格或列表",
      "支持搜索、筛选、排序操作栏",
    ],
    componentHints: [
      "StatCard（图标 + 数值 + 趋势标签）",
      "DataTable（表头固定、行 hover 高亮、分页）",
      "FilterBar（搜索框 + 下拉筛选 + 标签筛选）",
      "ChartCard（折线图/柱状图占位、时间范围选择器）",
    ],
    avoidHints: [
      "避免过于花哨的渐变背景",
      "避免大块彩色按钮抢夺数据焦点",
      "避免信息密度过低（空白过多）",
    ],
  },
  {
    id: "landing-page",
    name: "落地页",
    description: "适合产品官网、项目介绍页、转化页。",
    structureHints: [
      "单页滚动式布局，清晰的内容分区",
      "顶部 Hero 区（标题 + 描述 + CTA 按钮）",
      "Features 网格展示（3-4 列图标卡片）",
      "底部 CTA 区 + Footer",
    ],
    componentHints: [
      "HeroSection（大标题 + 渐变/图片背景 + CTA）",
      "FeatureCard（图标 + 标题 + 描述，简洁网格）",
      "TestimonialCard（引述 + 头像 + 姓名/职位）",
      "PricingTable（3-4 档对比，推荐高亮）",
    ],
    avoidHints: [
      "避免过于密集的信息排布",
      "避免复杂的侧边栏导航",
      "避免后台管理式的表格和数据卡片",
    ],
  },
  {
    id: "mobile-app",
    name: "移动应用",
    description: "适合移动端 App、小程序、移动优先界面。",
    structureHints: [
      "移动优先设计，最大宽度 430px",
      "底部 Tab Bar 导航（4-5 个图标）",
      "顶部导航栏 + 返回按钮",
      "卡片式列表，触控友好的点击区域",
    ],
    componentHints: [
      "BottomTabBar（图标 + 标签，当前高亮）",
      "ListItem（左图标/头像 + 标题 + 描述 + 右箭头）",
      "FAB 浮动操作按钮（右下角圆形按钮）",
      "Sheet/BottomSheet（底部弹出面板）",
    ],
    avoidHints: [
      "避免桌面端侧边栏布局",
      "避免 hover 依赖的交互",
      "避免过小的点击区域（<44px）",
    ],
  },
  {
    id: "developer-tool",
    name: "开发者工具",
    description: "适合开发者工具、代码平台、API 控制台。",
    structureHints: [
      "深色模式优先或支持切换",
      "左侧文件树/资源导航",
      "中央代码/内容编辑区",
      "右侧属性面板或预览区",
    ],
    componentHints: [
      "CommandPalette（⌘K 命令面板）",
      "CodeBlock（语法高亮、行号、复制按钮）",
      "TreeView（文件夹展开/折叠、缩进层级）",
      "Terminal/TerminalOutput（黑色背景、绿色/白色等宽字体）",
    ],
    avoidHints: [
      "避免过于营销化的视觉语言",
      "避免过多的装饰性元素",
      "避免大段文字说明，用 tooltip 代替",
    ],
  },
  {
    id: "ai-product",
    name: "AI 产品",
    description: "适合 AI 助手、AI 搜索、AI 工作流工具。",
    structureHints: [
      "对话式界面为主（聊天窗口风格）",
      "输入框在底部，带发送/附件按钮",
      "消息气泡（用户/AI 区分左右和对齐）",
      "侧边栏显示对话历史或设置",
    ],
    componentHints: [
      "ChatBubble（用户/AI 不同背景色和对齐）",
      "ChatInput（底部固定、自动增高、发送按钮）",
      "ThinkingIndicator（AI 思考中的动画占位）",
      "SourceCitation（引用来源卡片，可展开）",
    ],
    avoidHints: [
      "避免传统后台表格和表单风格",
      "避免过于密集的信息卡片",
      "避免复杂的多级导航",
    ],
  },
  {
    id: "ai-model-marketplace",
    name: "AI 模型市场",
    description: "适合大模型广场、模型市场、AI 控制台、开发者平台。",
    structureHints: [
      "左侧导航 + 顶部 Tabs 或分类切换 + 主内容区",
      "模型卡片网格展示，支持搜索、筛选、排序",
      "顶部浅色 Banner：公告/免费额度/状态提示",
      "推荐区 + 分类区 + 列表区，适合快速比较和选择",
    ],
    componentHints: [
      "ModelCard（名称、能力标签、描述、价格/额度/状态、操作按钮）",
      "Tabs / CategoryNav（分类导航切换模型类型）",
      "SearchInput + FilterBar（搜索模型名称、筛选标签）",
      "StatusBanner（免费额度提醒、公告提示）",
      "CompareButton / TryButton（对比模型、立即体验）",
    ],
    avoidHints: [
      "避免把模型市场做成聊天窗口",
      "避免过度营销化落地页风格",
      "避免传统后台表格过重",
      "避免卡片信息密度失控",
      "避免高饱和渐变堆叠",
    ],
  },
  {
    id: "minimal-portfolio",
    name: "极简作品集",
    description: "适合作品集、个人主页、展示页。",
    structureHints: [
      "极简布局，大量留白",
      "大图/视频 Hero 区",
      "作品网格（Masonry 或整齐网格）",
      "单列关于/联系区",
    ],
    componentHints: [
      "ProjectCard（大图 + 标题 + 分类标签 + hover 效果）",
      "TimelineItem（时间线布局展示经历）",
      "SkillBar/TagCloud（技能标签云）",
      "ContactForm（简洁表单 + 社交链接）",
    ],
    avoidHints: [
      "避免后台管理式布局",
      "避免密集的表格和数据统计",
      "避免过于商业化的 SaaS 风格",
    ],
  },
];

/** Look up a template by id; returns undefined if not found. */
export function getPromptTemplate(id: string): PromptTemplate | undefined {
  return promptTemplates.find((t) => t.id === id);
}

/** Suggest a default template id based on project type. */
export function suggestTemplateId(projectType: string): string | undefined {
  const map: Record<string, string> = {
    "SaaS 平台": "saas-dashboard",
    SaaS: "saas-dashboard",
    Dashboard: "saas-dashboard",
    仪表盘: "saas-dashboard",
    "AI 工具": "ai-product",
    "AI Tool": "ai-product",
    "落地页": "landing-page",
    "Landing Page": "landing-page",
    "移动应用": "mobile-app",
    "Mobile App": "mobile-app",
    "开发者工具": "developer-tool",
    "Developer Tool": "developer-tool",
    作品集: "minimal-portfolio",
    Portfolio: "minimal-portfolio",
    管理后台: "saas-dashboard",
    "Admin Panel": "saas-dashboard",
    设计工具: "developer-tool",
    "Design Tool": "developer-tool",
    // AI 模型市场 — when the project context involves model marketplace
    "AI 模型市场": "ai-model-marketplace",
    "大模型广场": "ai-model-marketplace",
    模型市场: "ai-model-marketplace",
    模型广场: "ai-model-marketplace",
  };
  return map[projectType];
}
