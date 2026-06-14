"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { saveUserPreference } from "@/lib/actions/preferences";
import { displayStyleTag, displayColor, displayLayout } from "@/lib/display-labels";
import type { UserPreferences } from "@/types";

const ALL_STYLES = [
  "Minimal SaaS", "Soft Dashboard", "Dense but Clean", "Neutral Palette",
  "Premium Tool", "Calm Productivity", "AI Native", "Card-based Layout",
  "Low-saturation", "Developer Tool",
];

const ALL_COLORS = ["Slate", "Neutral", "Zinc", "Muted Purple", "Cool Gray", "Warm Gray"];
const ALL_LAYOUTS = ["Sidebar + Content", "Card Grid", "Split Panel"];
const ALL_DISLIKED = ["廉价蓝白后台", "过度渐变", "大阴影", "塑料感按钮", "拥挤表格", "默认模板感"];
const ALL_TECH = ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "SQLite", "Prisma"];

interface SettingsFormProps {
  initial: UserPreferences | null;
}

function parseOrDefault(str: string | null | undefined, fallback: string[]): string[] {
  if (!str) return fallback;
  try { const parsed = JSON.parse(str); return Array.isArray(parsed) ? parsed : fallback; }
  catch { return fallback; }
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const [preferredStyles, setPreferredStyles] = useState<string[]>(
    parseOrDefault(initial?.preferredStyles, ["Minimal SaaS", "Soft Dashboard", "Dense but Clean", "Neutral Palette", "Premium Tool"])
  );
  const [dislikedStyles, setDislikedStyles] = useState<string[]>(
    parseOrDefault(initial?.dislikedStyles, ["廉价蓝白后台", "过度渐变", "大阴影"])
  );
  const [preferredColors, setPreferredColors] = useState<string[]>(
    parseOrDefault(initial?.preferredColors, ["Slate", "Neutral", "Zinc"])
  );
  const [preferredLayouts, setPreferredLayouts] = useState<string[]>(
    parseOrDefault(initial?.preferredLayouts, ["Sidebar + Content", "Card Grid"])
  );
  const [defaultTechStack, setDefaultTechStack] = useState<string[]>(
    parseOrDefault(initial?.defaultTechStack, ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "SQLite", "Prisma"])
  );
  const [defaultUiStyle, setDefaultUiStyle] = useState(
    initial?.defaultUiStyle ? displayStyleTag(initial.defaultUiStyle) : "极简 SaaS"
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const result = await saveUserPreference({
        preferredStyles,
        dislikedStyles,
        preferredColors,
        preferredLayouts,
        defaultTechStack,
        defaultUiStyle,
      });
      if (!result.success) {
        toast.error(result.error ?? "保存失败");
        return;
      }
      toast.success("设置已保存");
    } catch {
      toast.error("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  }

  function toggle(arr: string[], setArr: (v: string[]) => void, item: string) {
    if (arr.includes(item)) setArr(arr.filter((x) => x !== item));
    else setArr([...arr, item]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 审美偏好 */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h3 className="mb-4 text-[14px] font-medium text-foreground">审美偏好</h3>
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">偏好风格</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_STYLES.map((s) => (
                <Badge key={s} variant={preferredStyles.includes(s) ? "secondary" : "outline"} className="cursor-pointer text-[11px] transition-colors hover:bg-muted" onClick={() => toggle(preferredStyles, setPreferredStyles, s)}>{displayStyleTag(s)}</Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">不喜欢的风格</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_DISLIKED.map((s) => (
                <Badge key={s} variant={dislikedStyles.includes(s) ? "secondary" : "outline"} className="cursor-pointer text-[11px] transition-colors hover:bg-muted" onClick={() => toggle(dislikedStyles, setDislikedStyles, s)}>{s}</Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">偏好配色</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_COLORS.map((c) => (
                <Badge key={c} variant={preferredColors.includes(c) ? "secondary" : "outline"} className="cursor-pointer text-[11px] transition-colors hover:bg-muted" onClick={() => toggle(preferredColors, setPreferredColors, c)}>{displayColor(c)}</Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">偏好布局</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_LAYOUTS.map((l) => (
                <Badge key={l} variant={preferredLayouts.includes(l) ? "secondary" : "outline"} className="cursor-pointer text-[11px] transition-colors hover:bg-muted" onClick={() => toggle(preferredLayouts, setPreferredLayouts, l)}>{displayLayout(l)}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prompt 默认偏好 */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h3 className="mb-4 text-[14px] font-medium text-foreground">Prompt 默认偏好</h3>
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">默认技术栈</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_TECH.map((tech) => (
                <Badge key={tech} variant={defaultTechStack.includes(tech) ? "secondary" : "outline"} className="cursor-pointer text-[11px] transition-colors hover:bg-muted" onClick={() => toggle(defaultTechStack, setDefaultTechStack, tech)}>{tech}</Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">默认 UI 风格</label>
            <Input value={defaultUiStyle} onChange={(e) => setDefaultUiStyle(e.target.value)} placeholder="极简 SaaS" className="rounded-[10px]" />
            <p className="mt-1 text-[11px] text-muted-foreground">Prompt 生成时使用的默认视觉风格描述。</p>
          </div>
          <Separator />
          <Button className="rounded-[10px]" onClick={handleSave} disabled={saving}>
            {saving ? "保存中..." : "保存设置"}
          </Button>
        </div>
      </div>
    </div>
  );
}
