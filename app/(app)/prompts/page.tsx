import { Sparkles } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { PromptWorkspace } from "@/components/prompts/prompt-workspace";
import { getInspirations } from "@/lib/actions/inspirations";
import { getRecentPromptRecords } from "@/lib/actions/prompts";
import { getCollections, getInspirationsByCollection } from "@/lib/actions/collections";
import { getAIProviderStatus } from "@/lib/ai/config";
import { Card, CardContent } from "@/components/ui/card";

export default async function PromptsPage() {
  const [inspirations, recentRecords, aiStatus, collections] = await Promise.all([
    getInspirations(),
    getRecentPromptRecords(10),
    Promise.resolve(getAIProviderStatus()),
    getCollections(),
  ]);

  // Build collection → inspirationId[] mapping for client-side filter
  const collectionMap = await Promise.all(
    collections.map(async (c) => {
      const inspList = await getInspirationsByCollection(c.id);
      return { id: c.id, name: c.name, inspirationIds: inspList.map((i: { id: string }) => i.id) };
    })
  );

  return (
    <>
      <PageHeading
        title="Prompt 生成器"
        description="将你的 UI 灵感、审美偏好和项目需求转化为 Claude Code / Codex 可执行的开发提示词。"
      />

      {/* Info card */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
            <Sparkles className="h-4 w-4 text-accent-foreground" />
          </div>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            支持本地模板、AI 优化、审美记忆、反馈洞察、Prompt 保存与 Markdown 导出。可按项目需求生成适合 Claude Code / Codex 的开发提示词。
          </p>
        </CardContent>
      </Card>

      <PromptWorkspace
        inspirations={inspirations}
        recentRecords={recentRecords.map((r) => ({
          id: r.id, title: r.title, targetProject: r.targetProject, projectType: r.projectType, createdAt: r.createdAt,
          feedbackLabel: r.feedbackLabel, feedbackRating: r.feedbackRating, isFavorite: r.isFavorite,
        }))}
        aiConfigured={aiStatus.configured}
        collections={collectionMap}
      />
    </>
  );
}
