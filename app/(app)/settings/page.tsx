import { Key } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AIProviderCard } from "@/components/settings/ai-provider-card";
import { SettingsForm } from "@/components/settings/settings-form";
import { AestheticMemoryPanel } from "@/components/settings/aesthetic-memory-panel";
import { PromptFeedbackInsightsPanel } from "@/components/settings/prompt-feedback-insights-panel";
import { getAIProviderStatus } from "@/lib/ai/config";
import { getUserPreference } from "@/lib/actions/preferences";

export default async function SettingsPage() {
  const [aiStatus, preference] = await Promise.all([
    Promise.resolve(getAIProviderStatus()),
    getUserPreference(),
  ]);

  return (
    <>
      <PageHeading
        title="设置"
        description="配置你的审美偏好、默认技术栈和 AI 服务。"
      />

      <SettingsForm initial={preference} />

      {/* AI 服务 */}
      <Card className="mt-6">
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

      {/* 审美记忆 */}
      <div className="mt-6">
        <AestheticMemoryPanel
          initialData={preference ?? undefined}
        />
      </div>

      {/* Prompt 反馈洞察 */}
      <div className="mt-6">
        <PromptFeedbackInsightsPanel />
      </div>
    </>
  );
}
