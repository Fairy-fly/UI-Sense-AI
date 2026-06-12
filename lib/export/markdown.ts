/**
 * Markdown export — build and download prompt as .md file.
 */

export interface PromptExportData {
  projectName: string;
  projectType?: string;
  createdAt?: string;
  mode?: string;
  referenceInspirations?: string[];
  techStack?: string[];
  fullPrompt: string;
  designSystemPrompt?: string | null;
  pageLevelPrompt?: string | null;
  componentLevelPrompt?: string | null;
}

export function buildPromptMarkdown(data: PromptExportData): string {
  const lines: string[] = [];

  lines.push("# UI Sense AI Prompt");
  lines.push("");
  lines.push("## 基本信息");
  lines.push("");
  lines.push(`- **项目名称**：${data.projectName}`);
  if (data.projectType) lines.push(`- **项目类型**：${data.projectType}`);
  if (data.createdAt) lines.push(`- **生成时间**：${data.createdAt}`);
  if (data.mode) lines.push(`- **使用模式**：${data.mode}`);
  if (data.referenceInspirations?.length) {
    lines.push(`- **参考灵感**：${data.referenceInspirations.join("、")}`);
  }
  if (data.techStack?.length) {
    lines.push(`- **技术栈**：${data.techStack.join("、")}`);
  }
  lines.push("");

  if (data.fullPrompt) {
    lines.push("---");
    lines.push("");
    lines.push("## 完整 Prompt");
    lines.push("");
    lines.push(data.fullPrompt);
    lines.push("");
  }

  if (data.designSystemPrompt) {
    lines.push("---");
    lines.push("");
    lines.push("## 设计系统");
    lines.push("");
    lines.push(data.designSystemPrompt);
    lines.push("");
  }

  if (data.pageLevelPrompt) {
    lines.push("---");
    lines.push("");
    lines.push("## 页面要求");
    lines.push("");
    lines.push(data.pageLevelPrompt);
    lines.push("");
  }

  if (data.componentLevelPrompt) {
    lines.push("---");
    lines.push("");
    lines.push("## 组件规范");
    lines.push("");
    lines.push(data.componentLevelPrompt);
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push("> 该 Prompt 由 UI Sense AI 根据个人审美偏好和参考灵感生成，可直接提供给 Claude Code、Codex 或其他 AI Agent 使用。");

  return lines.join("\n");
}

export function safeFilename(input: string): string {
  return input
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60)
    .toLowerCase();
}

export function downloadMarkdown(filename: string, content: string): boolean {
  try {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}
