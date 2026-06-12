import { Key } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AIProviderCard } from "@/components/settings/ai-provider-card";
import { SettingsForm } from "@/components/settings/settings-form";
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
    </>
  );
}
