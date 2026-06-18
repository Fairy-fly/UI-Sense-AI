import { Info, Sparkles, ChevronDown } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { InspirationForm } from "@/components/inspirations/inspiration-form";
import { Button } from "@/components/ui/button";

export default function NewInspirationPage() {
  return (
    <>
      <PageHeading
        title="上传灵感"
        description="保存一张 UI 截图，并记录它为什么好看。"
      />

      <InspirationForm mode="create" />

      {/* AI Analysis Preview — collapsible */}
      <details className="group mt-6 rounded-2xl border border-border bg-card">
        <summary className="flex cursor-pointer list-none items-center justify-between p-5">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-[14px] font-medium text-foreground">AI 分析说明</span>
            <span className="ml-2 text-[12px] text-muted-foreground">
              保存灵感后，可基于截图、标题、标签和备注生成设计分析。
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-border px-5 pb-5">
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "色彩分析", desc: "主色调、对比度和调色板和谐度" },
              { label: "布局分析", desc: "网格系统、间距模式和响应式行为" },
              { label: "组件语言", desc: "按钮样式、输入模式和导航元素" },
              { label: "风格总结", desc: "整体美学方向和设计关键词" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
                <p className="text-[12px] font-medium text-foreground">{item.label}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3">
            <p className="text-[12px] text-muted-foreground">
              保存后可在灵感详情页运行 AI 分析。未配置视觉模型时会自动使用基础文本分析。
            </p>
            <Button variant="outline" size="sm" className="rounded-[10px]" disabled>
              <Sparkles className="h-3 w-3" />
              使用 AI 分析
            </Button>
          </div>
        </div>
      </details>
    </>
  );
}
