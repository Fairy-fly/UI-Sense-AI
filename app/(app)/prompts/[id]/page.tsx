import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { PromptCopyButton } from "@/components/prompts/prompt-copy-button";
import { ExportMarkdownButton } from "@/components/prompts/export-markdown-button";
import { DeletePromptButton } from "@/components/prompts/delete-prompt-button";
import { PromptFeedbackPanel } from "@/components/prompts/prompt-feedback-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPromptRecordById } from "@/lib/actions/prompts";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PromptDetailPage({ params }: Props) {
  const { id } = await params;
  const record = await getPromptRecordById(id);

  if (!record) {
    notFound();
  }

  return (
    <>
      <PageHeading
        title="Prompt 详情"
        description={`${record.targetProject} · ${record.projectType ?? ""} · ${record.createdAt.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}`}
        action={
          <div className="flex items-center gap-2">
            <ExportMarkdownButton
              data={{
                projectName: record.targetProject,
                projectType: record.projectType ?? undefined,
                createdAt: record.createdAt.toLocaleDateString("zh-CN"),
                mode: "历史记录",
                fullPrompt: record.generatedPrompt,
                designSystemPrompt: record.designSystemPrompt,
                pageLevelPrompt: record.pageLevelPrompt,
                componentLevelPrompt: record.componentLevelPrompt,
              }}
            />
            <PromptCopyButton text={record.generatedPrompt} />
            <DeletePromptButton recordId={record.id} />
          </div>
        }
      />

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <Tabs defaultValue="full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="full" className="text-[12px]">完整 Prompt</TabsTrigger>
            <TabsTrigger value="design" className="text-[12px]">设计系统</TabsTrigger>
            <TabsTrigger value="pages" className="text-[12px]">页面要求</TabsTrigger>
            <TabsTrigger value="components" className="text-[12px]">组件规范</TabsTrigger>
          </TabsList>
          <TabsContent value="full">
            <div className="max-h-[65vh] overflow-y-auto rounded-xl border border-border bg-muted/30 p-5">
              <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground">{record.generatedPrompt}</pre>
            </div>
          </TabsContent>
          <TabsContent value="design">
            <div className="max-h-[65vh] overflow-y-auto rounded-xl border border-border bg-muted/30 p-5">
              <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground">{record.designSystemPrompt ?? "暂无设计系统 Prompt。"}</pre>
            </div>
          </TabsContent>
          <TabsContent value="pages">
            <div className="max-h-[65vh] overflow-y-auto rounded-xl border border-border bg-muted/30 p-5">
              <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground">{record.pageLevelPrompt ?? "暂无页面要求 Prompt。"}</pre>
            </div>
          </TabsContent>
          <TabsContent value="components">
            <div className="max-h-[65vh] overflow-y-auto rounded-xl border border-border bg-muted/30 p-5">
              <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground">{record.componentLevelPrompt ?? "暂无组件规范 Prompt。"}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Feedback */}
      <div className="mt-6">
        <PromptFeedbackPanel
          promptId={record.id}
          initialData={{
            feedbackRating: record.feedbackRating,
            feedbackLabel: record.feedbackLabel,
            feedbackNote: record.feedbackNote,
            feedbackTags: record.feedbackTags,
            isFavorite: record.isFavorite,
          }}
        />
      </div>

      <div className="mt-4">
        <Link href="/prompts" className="inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          返回 Prompt 生成器
        </Link>
      </div>
    </>
  );
}
