"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPromptFeedbackInsights } from "@/lib/actions/prompt-feedback-insights";
import type { PromptFeedbackInsights } from "@/lib/prompt-feedback-insights";

export function PromptFeedbackInsightsPanel() {
  const [insights, setInsights] = useState<PromptFeedbackInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPromptFeedbackInsights().then((data) => {
      setInsights(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[13px] font-medium">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            Prompt 反馈洞察
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            正在分析...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[13px] font-medium">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            Prompt 反馈洞察
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            还没有足够 Prompt 反馈形成策略洞察。建议先给 2 条以上 Prompt 添加评分或反馈标签。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[13px] font-medium">
          <Lightbulb className="h-4 w-4 text-muted-foreground" />
          Prompt 反馈洞察
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          基于 {insights.totalFeedbackCount} 条反馈、{insights.favoriteCount} 条收藏 Prompt
          {insights.averageRating ? `，平均评分 ${insights.averageRating}/5` : ""}
        </p>

        {insights.positiveTags.length > 0 && (
          <div>
            <p className="mb-1 text-[11px] font-medium text-muted-foreground">偏好的 Prompt 特征</p>
            <div className="flex flex-wrap gap-1">
              {insights.positiveTags.map((t) => (
                <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>
              ))}
            </div>
          </div>
        )}

        {insights.negativeTags.length > 0 && (
          <div>
            <p className="mb-1 text-[11px] font-medium text-muted-foreground">需要避免的问题</p>
            <div className="flex flex-wrap gap-1">
              {insights.negativeTags.map((t) => (
                <Badge key={t} variant="outline" className="text-[11px] text-muted-foreground">{t}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border bg-muted/20 px-3 py-2.5">
          <p className="text-[11px] font-medium text-muted-foreground">Agent 生成策略</p>
          <p className="mt-1 text-[12px] leading-relaxed text-foreground">{insights.agentInstruction}</p>
        </div>
      </CardContent>
    </Card>
  );
}
