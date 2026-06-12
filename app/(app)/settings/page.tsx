import { Palette, Monitor, Key, Globe, Wand2 } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIProviderCard } from "@/components/settings/ai-provider-card";
import { getAIProviderStatus } from "@/lib/ai/config";
import { displayColor, displayLayout } from "@/lib/display-labels";
import {
  defaultStyleTags,
  dislikedStyleExamples,
  defaultTechStack,
  preferredColorExamples,
  projectTypes,
} from "@/lib/constants";

export default function SettingsPage() {
  const aiStatus = getAIProviderStatus();
  return (
    <>
      <PageHeading
        title="设置"
        description="配置你的审美偏好、默认技术栈和未来的 AI 服务。"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 审美偏好 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[14px] font-medium">
              <Palette className="h-4 w-4 text-muted-foreground" />
              审美偏好
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                偏好风格
              </label>
              <div className="flex flex-wrap gap-1.5">
                {defaultStyleTags.slice(0, 6).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[11px]">{tag}</Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                不喜欢的风格
              </label>
              <div className="flex flex-wrap gap-1.5">
                {dislikedStyleExamples.map((s) => (
                  <Badge key={s} variant="outline" className="text-[11px] text-muted-foreground">{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                偏好配色
              </label>
              <div className="flex flex-wrap gap-1.5">
                {preferredColorExamples.map((c) => (
                  <Badge key={c} variant="secondary" className="text-[11px]">{displayColor(c)}</Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                偏好布局
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["Sidebar + Content", "Card Grid", "Split Panel"].map((l) => (
                  <Badge key={l} variant="secondary" className="text-[11px]">{displayLayout(l)}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 默认技术栈 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[14px] font-medium">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              默认技术栈
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {defaultTechStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-[11px]">{tech}</Badge>
              ))}
            </div>
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              生成 Prompt 时使用的默认值，可在项目中单独覆盖。
            </p>

            <Separator />

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                Agent 目标
              </label>
              <Select>
                <SelectTrigger className="rounded-[10px]">
                  <SelectValue placeholder="Claude Code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude-code">Claude Code</SelectItem>
                  <SelectItem value="codex">Codex</SelectItem>
                  <SelectItem value="both">两者都是</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                默认项目类型
              </label>
              <Select>
                <SelectTrigger className="rounded-[10px]">
                  <SelectValue placeholder="SaaS" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((t) => (
                    <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                默认 UI 风格
              </label>
              <Input placeholder="极简 SaaS" className="rounded-[10px]" />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                输出语言
              </label>
              <Select>
                <SelectTrigger className="rounded-[10px]">
                  <SelectValue placeholder="简体中文" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Prompt 默认值 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[14px] font-medium">
              <Wand2 className="h-4 w-4 text-muted-foreground" />
              Prompt 默认值
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                这些设置影响生成 Prompt 的默认结构和语气。随着审美系统学习你的偏好，可以进一步微调。
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                Prompt 详细程度
              </label>
              <Select>
                <SelectTrigger className="rounded-[10px]">
                  <SelectValue placeholder="详细" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">简洁</SelectItem>
                  <SelectItem value="detailed">详细</SelectItem>
                  <SelectItem value="comprehensive">全面</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">
                包含代码示例
              </label>
              <Select>
                <SelectTrigger className="rounded-[10px]">
                  <SelectValue placeholder="是" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">是 — 附带 Tailwind 类名</SelectItem>
                  <SelectItem value="no">否 — 仅设计方向</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* AI 服务 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[14px] font-medium">
              <Key className="h-4 w-4 text-muted-foreground" />
              AI 服务
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AIProviderCard
              configured={aiStatus.configured}
              provider={aiStatus.provider}
              baseURL={aiStatus.baseURL}
              model={aiStatus.model}
            />
          </CardContent>
        </Card>

        {/* 外观 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[14px] font-medium">
              <Globe className="h-4 w-4 text-muted-foreground" />
              外观
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                <span className="text-[13px] font-medium text-foreground">浅色模式</span>
                <Badge variant="secondary" className="text-[11px]">当前</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
                <span className="text-[13px] text-muted-foreground">深色模式</span>
                <Badge variant="outline" className="text-[11px] text-muted-foreground">预留</Badge>
              </div>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
              深色模式 CSS 变量已在 <code className="rounded bg-muted px-1 py-0.5 text-[11px]">globals.css</code> 中定义。
              切换开关将在后续阶段接入。
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
