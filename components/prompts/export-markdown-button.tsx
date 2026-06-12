"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { type PromptExportData, buildPromptMarkdown, safeFilename, downloadMarkdown } from "@/lib/export/markdown";

interface ExportMarkdownButtonProps {
  data: PromptExportData;
  disabled?: boolean;
}

export function ExportMarkdownButton({ data, disabled }: ExportMarkdownButtonProps) {
  function handleExport() {
    const markdown = buildPromptMarkdown(data);
    const date = new Date().toISOString().slice(0, 10);
    const name = data.projectName ? safeFilename(data.projectName) : "prompt";
    const filename = `ui-sense-${name}-${date}.md`;
    const ok = downloadMarkdown(filename, markdown);

    if (ok) {
      toast.success("Markdown 已下载");
    } else {
      toast.error("下载失败，请重试");
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1 rounded-[10px]"
      onClick={handleExport}
      disabled={disabled}
    >
      <Download className="h-3.5 w-3.5 shrink-0" />
      <span className="inline-flex items-center leading-none">导出 Markdown</span>
    </Button>
  );
}
