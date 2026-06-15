"use client";

import { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analyzeInspiration } from "@/lib/actions/ai-analysis";
import { displayKeywordList } from "@/lib/display-content";
import type { AiAnalysis } from "@/types";

interface AIAnalysisPanelProps {
  inspirationId: string;
  analysis: AiAnalysis | null;
}

export function AIAnalysisPanel({ inspirationId, analysis: initialAnalysis }: AIAnalysisPanelProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(initialAnalysis);

  async function handleAnalyze() {
    setAnalyzing(true);
    try {
      const result = await analyzeInspiration(inspirationId);
      if (!result.success) {
        toast.error(result.error ?? "AI 分析失败");
        return;
      }

      if (result.analysisMode === "vision") {
        toast.success("视觉分析完成");
      } else {
        toast.success("已使用基础文本分析");
      }

      // Update local state immediately — no page reload needed
      if (result.analysis) {
        setAnalysis(result.analysis);
      }
    } catch {
      toast.error("AI 分析失败，请重试");
    } finally {
      setAnalyzing(false);
    }
  }

  // No analysis yet — show trigger
  if (!analysis) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[13px] font-medium">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            AI 基础分析
          </CardTitle>
          <CardDescription className="text-[11px]">基础文本分析 · 非视觉识别</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-[12px] leading-relaxed text-muted-foreground">
            基于灵感标题、标签、备注和项目类型生成初步 UI 分析。当前版本暂未进行真实图片视觉识别。
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 rounded-[10px]"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
            )}
            <span className="inline-flex items-center leading-none">
              {analyzing ? "分析中..." : "开始分析"}
            </span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Analysis exists — display results
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-[13px] font-medium">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              风格总结
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 rounded-[8px] text-[11px] text-muted-foreground"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 shrink-0" />
              )}
              <span className="inline-flex items-center leading-none">重新分析</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            {analysis.styleSummary}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[13px] font-medium">色彩系统</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            {analysis.colorAnalysis}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[13px] font-medium">布局模式</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            {analysis.layoutAnalysis}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[13px] font-medium">组件语言</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            {analysis.componentAnalysis}
          </p>
        </CardContent>
      </Card>

      {analysis.designKeywords && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[13px] font-medium">设计关键词</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {displayKeywordList(analysis.designKeywords).map((kw) => (
                <Badge key={kw} variant="secondary" className="text-[11px]">{kw}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
