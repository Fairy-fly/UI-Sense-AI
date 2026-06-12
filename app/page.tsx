import Link from "next/link";
import { ArrowRight, Image, Search, Palette, Wand2, Upload, Eye, Brain, Sparkles, LayoutDashboard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

const features = [
  { icon: Image, title: "收藏 UI 灵感", desc: "上传你喜欢的网页、App 截图，结构化存储每一份设计参考。" },
  { icon: Search, title: "分析设计语言", desc: "解析风格、色彩、字体、布局——把审美直觉变成可描述的语言。" },
  { icon: Palette, title: "学习个人审美", desc: "通过收藏、评分和标签，系统化记录你的设计偏好和审美倾向。" },
  { icon: Wand2, title: "生成 Agent Prompt", desc: "将品味和参考转化为 Claude Code / Codex 可直接执行的 UI 提示词。" },
];

const steps = [
  { icon: Upload, label: "上传", desc: "收藏优质 UI 截图" },
  { icon: Eye, label: "分析", desc: "AI 解析设计基因" },
  { icon: Brain, label: "学习", desc: "沉淀个人审美偏好" },
  { icon: Sparkles, label: "生成", desc: "生成高质量 Prompt" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-background/80 backdrop-blur-sm transition-colors">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-foreground">{APP_NAME}</span>
          </div>
          <nav className="hidden items-center gap-1 sm:flex">
            <span className="rounded-[10px] px-3 py-1.5 text-[13px] text-muted-foreground">产品</span>
            <span className="rounded-[10px] px-3 py-1.5 text-[13px] text-muted-foreground">工作流</span>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "ml-2 gap-1")}
            >
              <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
              <span className="inline-flex items-center leading-none">总览</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:pt-40">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #18181B 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-8 px-3 py-1 text-xs">阶段 2 · 静态 UI 预览</Badge>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            把你的 UI 审美，训练成<br />
            <span className="text-muted-foreground">AI Agent 能理解的提示词。</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            UI Sense AI 帮你收藏优秀界面、分析设计风格、沉淀个人审美，并生成可直接交给 Claude Code / Codex 的 UI 开发提示词。
          </p>

          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              href="/inspirations/new"
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "gap-1.5 rounded-[10px]")}
            >
              <span className="inline-flex items-center leading-none">开始收藏</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-[10px]")}
            >
              <span className="inline-flex items-center leading-none">查看总览</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 text-center">
            <p className="text-[13px] font-medium text-muted-foreground">核心能力</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              从收藏到生成，四步闭环
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-ring/20 hover:shadow-sm"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <f.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-[15px] font-medium text-foreground">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 text-center">
            <p className="text-[13px] font-medium text-muted-foreground">工作流程</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              上传 → 分析 → 学习 → 生成
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.label} className="relative flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card">
                  <step.icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mb-1 text-[13px] font-semibold text-foreground">{step.label}</p>
                <p className="text-[12px] text-muted-foreground">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="absolute left-[60%] top-7 hidden h-px w-[80%] bg-border lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-[960px]">
          <div className="mb-10 text-center">
            <p className="text-[13px] font-medium text-muted-foreground">总览预览</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              精致的产品仪表盘，不是普通后台
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {/* Simulated dashboard UI */}
            <div className="flex h-[360px]">
              {/* Sidebar */}
              <div className="w-[200px] shrink-0 border-r border-border bg-muted/20 p-4">
                <div className="mb-6 flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-primary/80" />
                  <div className="h-2 w-16 rounded-full bg-muted-foreground/20" />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="mb-2 flex items-center gap-2 rounded-lg px-2 py-1.5">
                    <div className="h-3 w-3 rounded bg-muted-foreground/20" />
                    <div className="h-2 w-20 rounded-full bg-muted-foreground/20" />
                  </div>
                ))}
              </div>
              {/* Content */}
              <div className="flex-1 p-6">
                <div className="mb-6">
                  <div className="mb-1 h-6 w-32 rounded bg-foreground/80" />
                  <div className="h-3 w-64 rounded-full bg-muted-foreground/20" />
                </div>
                <div className="mb-6 grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-3">
                      <div className="mb-2 h-2 w-16 rounded-full bg-muted-foreground/20" />
                      <div className="h-6 w-12 rounded bg-foreground/60" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="mb-3 h-3 w-24 rounded-full bg-muted-foreground/20" />
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="aspect-[16/10] rounded-lg bg-muted/50" />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <div className="mb-3 h-3 w-24 rounded-full bg-muted-foreground/20" />
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-2">
                          <div className="h-5 w-12 rounded bg-muted/80" />
                          <div className="h-5 w-16 rounded bg-muted/50" />
                          <div className="h-5 w-20 rounded bg-muted/30" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 text-center sm:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[12px] text-muted-foreground">
              UI Sense AI — Design Intelligence for the AI Agent Era
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground">
            Next.js · TypeScript · Tailwind CSS · shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
}
