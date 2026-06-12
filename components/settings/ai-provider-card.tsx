"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AIProviderCardProps {
  configured: boolean;
  provider: string;
  baseURL: string;
  model: string;
}

export function AIProviderCard({ configured, provider, baseURL, model }: AIProviderCardProps) {
  const [testing, setTesting] = useState(false);

  async function handleTestConnection() {
    if (!configured) return;
    setTesting(true);
    try {
      const res = await fetch("/api/ai/test", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success("DeepSeek 连接成功");
      } else {
        toast.error(data.error ?? "连接失败");
      }
    } catch {
      toast.error("连接失败, 请检查网络");
    }
    setTesting(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-foreground">{provider}</p>
          <p className="text-[12px] text-muted-foreground">{baseURL}</p>
        </div>
        <Badge variant="outline" className="text-[11px]">{model}</Badge>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`inline-block h-2 w-2 rounded-full ${configured ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
          <span className="text-[13px] font-medium text-foreground">API Key</span>
          <span className="text-[12px] text-muted-foreground">
            {configured ? "已配置" : "未配置"}
          </span>
        </div>
        <Badge variant="outline" className={`text-[11px] ${configured ? "text-emerald-600" : "text-muted-foreground"}`}>
          {configured ? "已配置" : "未配置"}
        </Badge>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
        <div>
          <p className="text-[12px] font-medium text-foreground">测试连接</p>
          <p className="text-[11px] text-muted-foreground">验证 DeepSeek API 是否可用</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 rounded-[10px]"
          onClick={handleTestConnection}
          disabled={testing || !configured}
        >
          <Zap className="h-3.5 w-3.5 shrink-0" />
          <span className="inline-flex items-center leading-none">{testing ? "测试中..." : "测试连接"}</span>
        </Button>
      </div>

      {!configured && (
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          请在项目根目录创建 <code className="rounded bg-muted px-1 py-0.5 text-[11px]">.env.local</code> 文件,
          添加 <code className="rounded bg-muted px-1 py-0.5 text-[11px]">DEEPSEEK_API_KEY=你的key</code> 并重启 dev server。
        </p>
      )}

      <p className="text-[12px] leading-relaxed text-muted-foreground">
        DeepSeek API 用于优化 Prompt 生成质量。API Key 仅在服务端使用, 不会暴露到前端。
        未配置 Key 时, Prompt 生成器仍可使用本地模板。
      </p>
    </div>
  );
}
