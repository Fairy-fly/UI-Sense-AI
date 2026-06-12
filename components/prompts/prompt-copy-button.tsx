"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PromptCopyButtonProps {
  text: string;
  disabled?: boolean;
}

export function PromptCopyButton({ text, disabled }: PromptCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("已复制 Prompt");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("复制失败，请手动选择文本复制");
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1 rounded-[10px]"
      onClick={handleCopy}
      disabled={disabled || !text}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <span className="inline-flex items-center leading-none">已复制</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 shrink-0" />
          <span className="inline-flex items-center leading-none">复制 Prompt</span>
        </>
      )}
    </Button>
  );
}
