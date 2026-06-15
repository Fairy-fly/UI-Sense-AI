"use client";

import { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateAestheticMemory } from "@/lib/actions/aesthetic-memory";
import type { UserPreferences } from "@/types";
import type { AestheticProfile } from "@/lib/aesthetic-memory";

interface AestheticMemoryPanelProps {
  initialData?: UserPreferences | null;
}

export function AestheticMemoryPanel({ initialData }: AestheticMemoryPanelProps) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<AestheticProfile | null>(null);
  const [noData, setNoData] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const result = await generateAestheticMemory();
      if (!result.success) {
        toast.error(result.error ?? "生成失败");
        return;
      }
      if (result.data) {
        setProfile(result.data);
        setNoData(false);
        toast.success("审美记忆已更新");
      } else {
        setProfile(null);
        setNoData(true);
        toast.message(result.message ?? "数据不足");
      }
    } catch {
      toast.error("生成失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  const hasExisting = initialData?.aestheticSummary && initialData.aestheticSummary.length > 0;

  // Show existing data or trigger
  if (!profile && !hasExisting && !noData) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[13px] font-medium">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            审美记忆
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-[12px] leading-relaxed text-muted-foreground">
            根据你收藏的灵感、评分、标签和 AI 分析结果，自动总结你的 UI 审美偏好，用于增强后续 Prompt 生成。
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 rounded-[10px]"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
            )}
            <span className="inline-flex items-center leading-none">
              {loading ? "正在生成..." : "生成审美记忆"}
            </span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No data after generation attempt
  if (noData && !profile && !hasExisting) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[13px] font-medium">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            审美记忆
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-[12px] leading-relaxed text-muted-foreground">
            还没有足够灵感生成审美记忆。建议先收藏 3 个以上 UI 灵感，并给它们评分或生成 AI 分析。
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 rounded-[10px]"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 shrink-0" />
            )}
            <span className="inline-flex items-center leading-none">重试</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show generated profile or existing data
  const displaySummary = profile?.summary ?? initialData?.aestheticSummary ?? "";
  const displayInstruction = profile?.agentInstruction ?? initialData?.aestheticAgentInstruction ?? "";
  const displayCount = profile?.sourceCount ?? initialData?.aestheticSourceCount ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-[13px] font-medium">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            审美记忆
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 rounded-[8px] text-[11px] text-muted-foreground"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3 shrink-0" />
            )}
            <span className="inline-flex items-center leading-none">重新生成</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <p className="text-[12px] leading-relaxed text-muted-foreground">{displaySummary}</p>

        {/* Profile chips */}
        {profile && (
          <div className="space-y-2.5">
            {profile.preferredStyles.length > 0 && (
              <div>
                <p className="mb-1 text-[11px] font-medium text-muted-foreground">偏好风格</p>
                <div className="flex flex-wrap gap-1">
                  {profile.preferredStyles.slice(0, 8).map((s) => (
                    <Badge key={s} variant="secondary" className="text-[11px]">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.preferredColors.length > 0 && (
              <div>
                <p className="mb-1 text-[11px] font-medium text-muted-foreground">偏好配色</p>
                <div className="flex flex-wrap gap-1">
                  {profile.preferredColors.slice(0, 8).map((c) => (
                    <Badge key={c} variant="secondary" className="text-[11px]">{c}</Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.preferredLayouts.length > 0 && (
              <div>
                <p className="mb-1 text-[11px] font-medium text-muted-foreground">偏好布局</p>
                <div className="flex flex-wrap gap-1">
                  {profile.preferredLayouts.slice(0, 8).map((l) => (
                    <Badge key={l} variant="secondary" className="text-[11px]">{l}</Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.preferredComponents.length > 0 && (
              <div>
                <p className="mb-1 text-[11px] font-medium text-muted-foreground">偏好组件</p>
                <div className="flex flex-wrap gap-1">
                  {profile.preferredComponents.slice(0, 8).map((c) => (
                    <Badge key={c} variant="secondary" className="text-[11px]">{c}</Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.avoidedStyles.length > 0 && (
              <div>
                <p className="mb-1 text-[11px] font-medium text-muted-foreground">避免风格</p>
                <div className="flex flex-wrap gap-1">
                  {profile.avoidedStyles.slice(0, 8).map((s) => (
                    <Badge key={s} variant="outline" className="text-[11px] text-muted-foreground">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Agent instruction */}
        {displayInstruction && (
          <div className="rounded-xl border border-border bg-muted/20 px-3 py-2.5">
            <p className="text-[11px] font-medium text-muted-foreground">Agent 审美指令</p>
            <p className="mt-1 text-[12px] leading-relaxed text-foreground">{displayInstruction}</p>
          </div>
        )}

        {/* Source info */}
        <p className="text-[11px] text-muted-foreground">
          基于 {displayCount} 个高评分灵感生成
        </p>
      </CardContent>
    </Card>
  );
}
