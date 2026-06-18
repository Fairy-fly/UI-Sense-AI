"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InspirationSelector } from "@/components/prompts/inspiration-selector";
import { PromptCopyButton } from "@/components/prompts/prompt-copy-button";
import { ExportMarkdownButton } from "@/components/prompts/export-markdown-button";
import { generatePrompt, createPromptRecordFromGenerated } from "@/lib/actions/prompts";
import { projectTypes, defaultStyleTags, defaultTechStack, dislikedStyleExamples, developmentPhases } from "@/lib/constants";
import { promptTemplates, getPromptTemplate, suggestTemplateId } from "@/lib/prompt-templates";
import type { Inspiration } from "@/types";

function AccordionSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-2">
        <span className="text-[13px] font-medium text-foreground">{title}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-1 pt-1">{children}</div>
    </details>
  );
}

interface PromptWorkspaceProps {
  inspirations: Inspiration[];
  recentRecords: { id: string; title: string; targetProject: string; projectType: string | null; createdAt: Date; feedbackLabel: string | null; feedbackRating: number | null; isFavorite: boolean }[];
  aiConfigured: boolean;
  collections?: { id: string; name: string; inspirationIds: string[] }[];
}

export function PromptWorkspace({ inspirations, recentRecords, aiConfigured, collections }: PromptWorkspaceProps) {
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [desiredStyle, setDesiredStyle] = useState("");
  const [avoidedStyles, setAvoidedStyles] = useState<string[]>([]);
  const [customAvoided, setCustomAvoided] = useState("");
  const [techStack, setTechStack] = useState<string[]>(["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"]);
  const [customTech, setCustomTech] = useState("");
  const [pageList, setPageList] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [useAI, setUseAI] = useState(false);
  const useAIEnabled = useAI && aiConfigured;
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullPrompt, setFullPrompt] = useState("");
  const [designSystem, setDesignSystem] = useState("");
  const [pagePrompt, setPagePrompt] = useState("");
  const [componentPrompt, setComponentPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("full");
  const [promptTemplateId, setPromptTemplateId] = useState("none");
  const [historyFilter, setHistoryFilter] = useState("all"); // all | favorite | useful | needs_improvement
  const [developmentPhase, setDevelopmentPhase] = useState("");

  // Auto-suggest template when project type or name changes
  function handleProjectTypeChange(v: string | null) {
    const val = v ?? "";
    setProjectType(val);
    let suggested = suggestTemplateId(val);

    // If project name contains model marketplace keywords, prefer that template
    if (!suggested || suggested === "ai-product") {
      const nameKeywords = ["模型", "大模型", "模型广场", "模型市场", "Model", "Marketplace", "控制台", "Console", "开发者平台", "API", "推理", "部署"];
      if (nameKeywords.some((kw) => projectName.includes(kw))) {
        suggested = "ai-model-marketplace";
      }
    }

    if (suggested && promptTemplateId === "none") {
      setPromptTemplateId(suggested);
    }
  }

  async function handleGenerate() {
    if (!projectName.trim()) { toast.error("请输入项目名称"); return; }
    if (!projectType) { toast.error("请选择项目类型"); return; }
    if (!targetUsers.trim()) { toast.error("请填写目标用户"); return; }
    if (selectedIds.length === 0) { toast.error("请至少选择一个参考灵感"); return; }
    if (techStack.length === 0) { toast.error("请至少填写一个技术栈"); return; }
    if (!pageList.trim()) { toast.error("请填写需要生成的页面"); return; }
    setGenerating(true);
    try {
      const result = await generatePrompt({ projectName, projectType, targetUsers, selectedInspirationIds: selectedIds, desiredStyle, avoidedStyles, techStack, pageList, additionalNotes, useAI: useAIEnabled, promptTemplateId: promptTemplateId !== "none" ? promptTemplateId : undefined, developmentPhase: developmentPhase ? (developmentPhase as "v0.1" | "v0.2" | "v1.0") : undefined });
      if (!result.success) { toast.error(result.error ?? "生成失败"); return; }
      setFullPrompt(result.data!.fullPrompt);
      setDesignSystem(result.data!.designSystemPrompt);
      setPagePrompt(result.data!.pageLevelPrompt);
      setComponentPrompt(result.data!.componentLevelPrompt);
      setActiveTab("full");
      toast.success("Prompt 已生成");
    } catch {
      toast.error("生成失败，请重试");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!fullPrompt) { toast.error("请先生成 Prompt"); return; }
    setSaving(true);
    try {
      const result = await createPromptRecordFromGenerated({
        projectName,
        projectType,
        selectedInspirationIds: selectedIds,
        fullPrompt,
        designSystemPrompt: designSystem,
        pageLevelPrompt: pagePrompt,
        componentLevelPrompt: componentPrompt,
      });
      if (!result.success) { toast.error(result.error ?? "保存失败"); return; }
      toast.success("Prompt 已保存");
      window.location.reload();
    } catch {
      toast.error("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  }

  // Filter inspirations by selected collection
  const activeCollection =
    collectionFilter !== "all"
      ? collections?.find((c) => c.id === collectionFilter)
      : undefined;
  const displayInspirations = activeCollection
    ? inspirations.filter((insp) => activeCollection.inspirationIds.includes(insp.id))
    : inspirations;

  const collectionFilterLabel = activeCollection
    ? `${activeCollection.name}（${activeCollection.inspirationIds.length}）`
    : "全部灵感";

  // Template label for display
  const promptTemplateLabel =
    promptTemplateId !== "none"
      ? (getPromptTemplate(promptTemplateId)?.name ?? "")
      : "不使用模板";

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Left: Project Brief */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h3 className="mb-3 text-[14px] font-medium text-foreground">项目信息</h3>

          {/* --- Always visible: core fields --- */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[12px] font-medium text-foreground">项目名称</label>
              <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="例如：AI 研究仪表盘" className="h-8 rounded-[10px] text-[13px]" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-foreground">项目类型</label>
                <Select value={projectType} onValueChange={handleProjectTypeChange}>
                  <SelectTrigger className="h-8 rounded-[10px] text-[13px]"><SelectValue placeholder="选择类型..." /></SelectTrigger>
                  <SelectContent>{projectTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-foreground">目标用户</label>
                <Input value={targetUsers} onChange={(e) => setTargetUsers(e.target.value)} placeholder="开发者、设计师" className="h-8 rounded-[10px] text-[13px]" />
              </div>
            </div>

            {/* v2.1a: Development phase selector */}
            <div className="mt-3">
              <label className="mb-1 block text-[12px] font-medium text-foreground">开发阶段 <span className="text-[10px] text-muted-foreground">（可选，用于控制页面范围）</span></label>
              <Select value={developmentPhase} onValueChange={(v) => setDevelopmentPhase(v ?? "")}>
                <SelectTrigger className="h-8 rounded-[10px] text-[13px]"><SelectValue placeholder="不限阶段..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">不限阶段</SelectItem>
                  {developmentPhases.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {developmentPhase && (
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  {developmentPhase === "v0.1"
                    ? "原型阶段聚焦 2-3 个核心页面，模块（Checklist、日志、提醒等）放在主页面内"
                    : developmentPhase === "v0.2"
                    ? "功能完善阶段可扩展至 5 个主页面，补充辅助功能"
                    : "正式版本阶段可规划完整功能页面"}
                </p>
              )}
            </div>
          </div>

          <Separator className="my-3" />

          {/* --- Collection filter --- */}
          {collections && collections.length > 0 && (
            <div className="mb-3">
              <label className="mb-1 block text-[12px] font-medium text-foreground">按收藏集筛选</label>
              <Select value={collectionFilter} onValueChange={(v) => { setCollectionFilter(v ?? "all"); setSelectedIds([]); }}>
                <SelectTrigger className="h-8 rounded-[10px] text-[13px]">
                  <span className="truncate">{collectionFilterLabel}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部灵感</SelectItem>
                  {collections.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}（{c.inspirationIds.length}）</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* --- Prompt template selector --- */}
          <div className="mb-3">
            <label className="mb-1 block text-[12px] font-medium text-foreground">Prompt 模板</label>
            <Select value={promptTemplateId} onValueChange={(v) => setPromptTemplateId(v ?? "none")}>
              <SelectTrigger className="h-8 rounded-[10px] text-[13px]">
                <span className="truncate">{promptTemplateLabel}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">不使用模板</SelectItem>
                {promptTemplates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {promptTemplateId !== "none" && (
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {getPromptTemplate(promptTemplateId)?.description ?? ""}
              </p>
            )}
          </div>

          {/* --- Always visible: inspiration selector --- */}
          <div className="mb-3">
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">选择参考灵感 ({selectedIds.length}/6)</label>
            <InspirationSelector inspirations={displayInspirations} selectedIds={selectedIds} onChange={setSelectedIds} maxSelect={6} />
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              已生成 AI 基础分析的灵感会自动增强 Prompt 质量。
            </p>
          </div>

          <Separator className="my-3" />

          {/* --- Collapsible sections --- */}
          <AccordionSection title="期望风格">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {defaultStyleTags.slice(0, 6).map((tag) => (
                <Badge key={tag} variant={desiredStyle.split(/[,，、]/).map(s => s.trim()).filter(Boolean).includes(tag) ? "secondary" : "outline"} className="cursor-pointer text-[11px] hover:bg-muted" onClick={() => setDesiredStyle((prev) => {
                  const tokens = prev ? prev.split(/[,，、]/).map(s => s.trim()).filter(Boolean) : [];
                  if (tokens.includes(tag)) {
                    return tokens.filter(t => t !== tag).join("、");
                  }
                  return tokens.length > 0 ? `${tokens.join("、")}、${tag}` : tag;
                })}>{tag}</Badge>
              ))}
            </div>
            <Input value={desiredStyle} onChange={(e) => setDesiredStyle(e.target.value)} placeholder="或自定义输入..." className="h-8 rounded-[10px] text-[12px]" />
          </AccordionSection>

          <AccordionSection title="避免风格">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {dislikedStyleExamples.map((s) => (
                <Badge key={s} variant={avoidedStyles.includes(s) ? "secondary" : "outline"} className="cursor-pointer text-[11px] hover:bg-muted" onClick={() => setAvoidedStyles((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}>{s}</Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={customAvoided} onChange={(e) => setCustomAvoided(e.target.value)} placeholder="自定义..." className="h-7 rounded-[10px] text-[12px]" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const v = customAvoided.trim(); if (v && !avoidedStyles.includes(v)) { setAvoidedStyles([...avoidedStyles, v]); setCustomAvoided(""); } } }} />
              <Button type="button" variant="outline" size="sm" className="h-7 rounded-[10px] text-[11px]" onClick={() => { const v = customAvoided.trim(); if (v && !avoidedStyles.includes(v)) { setAvoidedStyles([...avoidedStyles, v]); setCustomAvoided(""); } }}>添加</Button>
            </div>
          </AccordionSection>

          <AccordionSection title="技术栈">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {defaultTechStack.map((tech) => (
                <Badge key={tech} variant={techStack.includes(tech) ? "secondary" : "outline"} className="cursor-pointer text-[11px] hover:bg-muted" onClick={() => setTechStack((prev) => prev.includes(tech) ? prev.filter((x) => x !== tech) : [...prev, tech])}>{tech}</Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={customTech} onChange={(e) => setCustomTech(e.target.value)} placeholder="添加技术..." className="h-7 rounded-[10px] text-[12px]" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); const v = customTech.trim(); if (v && !techStack.includes(v)) { setTechStack([...techStack, v]); setCustomTech(""); } } }} />
              <Button type="button" variant="outline" size="sm" className="h-7 rounded-[10px] text-[11px]" onClick={() => { const v = customTech.trim(); if (v && !techStack.includes(v)) { setTechStack([...techStack, v]); setCustomTech(""); } }}>添加</Button>
            </div>
          </AccordionSection>

          <AccordionSection title="高级要求">
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-foreground">需要生成的页面</label>
                <Textarea value={pageList} onChange={(e) => setPageList(e.target.value)} placeholder="仪表盘、设置、项目详情...（逗号或换行分隔）" className="min-h-[50px] rounded-[10px] text-[13px]" />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-foreground">补充说明</label>
                <Textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} placeholder="任何特殊需求或限制条件..." className="min-h-[50px] rounded-[10px] text-[13px]" />
              </div>
            </div>
          </AccordionSection>

          {/* AI toggle + Generate */}
          <div className="sticky bottom-0 -mx-5 -mb-6 mt-4 border-t border-border bg-card px-5 py-3 sm:-mx-6 sm:px-6">
            {/* AI toggle */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!aiConfigured}
                  onClick={() => aiConfigured && setUseAI(!useAI)}
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                    !aiConfigured ? "cursor-not-allowed opacity-40" : ""
                  } ${useAI && aiConfigured ? "bg-accent-foreground" : "bg-muted-foreground/30"}`}
                >
                  <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${useAI && aiConfigured ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
                </button>
                <span className="text-[12px] font-medium text-foreground">使用 AI 优化</span>
                {aiConfigured ? (
                  useAI ? (
                    <Badge variant="secondary" className="text-[10px] gap-1">
                      <Zap className="h-2.5 w-2.5" />
                      DeepSeek
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">本地模板</Badge>
                  )
                ) : (
                  <span className="text-[11px] text-muted-foreground">请先在 .env.local 配置 DEEPSEEK_API_KEY</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 rounded-[10px]" onClick={handleGenerate} disabled={generating}>
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span className="inline-flex items-center leading-none">{generating ? (useAIEnabled ? "正在调用 DeepSeek 优化..." : "正在生成本地 Prompt...") : "生成 Prompt"}</span>
              </Button>
              <Button variant="outline" className="rounded-[10px]" onClick={handleSave} disabled={saving || !fullPrompt}>
                <span className="inline-flex items-center leading-none">{saving ? "保存中..." : "保存记录"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Generated Prompt */}
      <div className="lg:col-span-3">
        <div className="lg:sticky lg:top-24 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-medium text-foreground">生成的 Prompt</h3>
            <div className="flex items-center gap-2">
              <ExportMarkdownButton
                data={{
                  projectName,
                  projectType,
                  mode: useAIEnabled ? "AI 优化" : "本地模板",
                  promptTemplateName: promptTemplateId !== "none" ? getPromptTemplate(promptTemplateId)?.name : undefined,
                  referenceInspirations: selectedIds,
                  techStack,
                  fullPrompt,
                  designSystemPrompt: designSystem,
                  pageLevelPrompt: pagePrompt,
                  componentLevelPrompt: componentPrompt,
                }}
                disabled={!fullPrompt}
              />
              <PromptCopyButton text={activeTab === "full" ? fullPrompt : activeTab === "design" ? designSystem : activeTab === "pages" ? pagePrompt : componentPrompt} disabled={!fullPrompt} />
            </div>
          </div>
          <Separator className="mb-4" />
          {fullPrompt ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="full" className="text-[12px]">完整 Prompt</TabsTrigger>
                <TabsTrigger value="design" className="text-[12px]">设计系统</TabsTrigger>
                <TabsTrigger value="pages" className="text-[12px]">页面要求</TabsTrigger>
                <TabsTrigger value="components" className="text-[12px]">组件规范</TabsTrigger>
              </TabsList>
              <TabsContent value="full">
                <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-border bg-muted/30 p-5">
                  <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground">{fullPrompt}</pre>
                </div>
              </TabsContent>
              <TabsContent value="design">
                <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-border bg-muted/30 p-5">
                  <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground">{designSystem}</pre>
                </div>
              </TabsContent>
              <TabsContent value="pages">
                <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-border bg-muted/30 p-5">
                  <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground">{pagePrompt}</pre>
                </div>
              </TabsContent>
              <TabsContent value="components">
                <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-border bg-muted/30 p-5">
                  <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground">{componentPrompt}</pre>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
              <Sparkles className="mb-2 h-6 w-6 text-muted-foreground/40" />
              <p className="text-[13px] text-muted-foreground">填写项目信息并点击「生成 Prompt」</p>
            </div>
          )}

          {recentRecords.length > 0 && (
            <div className="mt-4 border-t border-border pt-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-[12px] font-medium text-muted-foreground">最近记录</h4>
                <div className="flex gap-0.5 rounded-lg bg-zinc-100 p-1">
                  {(["all", "favorite", "useful", "needs_improvement"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setHistoryFilter(f)}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 ${
                        historyFilter === f
                          ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200"
                          : "text-zinc-500 hover:text-zinc-900 hover:bg-white/60"
                      }`}
                    >
                      {f === "all" ? "全部" : f === "favorite" ? "已收藏" : f === "useful" ? "好用" : "需要改进"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-0.5">
                {recentRecords
                  .filter((rec) => {
                    if (historyFilter === "all") return true;
                    if (historyFilter === "favorite") return rec.isFavorite;
                    if (historyFilter === "useful") return rec.feedbackLabel === "useful";
                    if (historyFilter === "needs_improvement") return rec.feedbackLabel === "needs_improvement";
                    return true;
                  })
                  .slice(0, 5).map((rec) => (
                  <a key={rec.id} href={`/prompts/${rec.id}`} className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[12px] transition-colors hover:bg-muted/50">
                    <div className="min-w-0 flex-1">
                      <span className="truncate text-foreground">{rec.title}</span>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {rec.isFavorite && (
                          <span className="text-[10px] text-amber-500">已收藏</span>
                        )}
                        {rec.feedbackLabel === "useful" && (
                          <span className="text-[10px] text-emerald-600">好用</span>
                        )}
                        {rec.feedbackLabel === "average" && (
                          <span className="text-[10px] text-muted-foreground">一般</span>
                        )}
                        {rec.feedbackLabel === "needs_improvement" && (
                          <span className="text-[10px] text-amber-600">需要改进</span>
                        )}
                        {rec.feedbackRating && (
                          <span className="text-[10px] text-muted-foreground">{rec.feedbackRating} 分</span>
                        )}
                        {!rec.feedbackLabel && !rec.feedbackRating && !rec.isFavorite && (
                          <span className="text-[10px] text-muted-foreground/50">未反馈</span>
                        )}
                      </div>
                    </div>
                    <span className="ml-2 shrink-0 text-muted-foreground">{rec.createdAt.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
