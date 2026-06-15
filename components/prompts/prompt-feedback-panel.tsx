"use client";

import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, CircleMinus, Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SelectableChip } from "@/components/ui/selectable-chip";
import { updatePromptFeedback } from "@/lib/actions/prompts";

const QUICK_LABELS = [
  { value: "useful", label: "好用", icon: ThumbsUp },
  { value: "average", label: "一般", icon: CircleMinus },
  { value: "needs_improvement", label: "需要改进", icon: ThumbsDown },
] as const;

const FEEDBACK_TAGS = [
  "结构清楚", "UI 高级", "可执行性强", "信息太多",
  "不够具体", "风格不准", "适合复用", "需要人工改写",
];

/** Get className for quick-feedback label button based on selection state. */
function getQuickLabelClass(value: string, selected: boolean): string {
  if (!selected) return "border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300 hover:text-zinc-950";
  switch (value) {
    case "useful":
      return "border-emerald-400 bg-emerald-100 text-emerald-900 shadow-sm ring-1 ring-emerald-500/20 font-medium";
    case "average":
      return "border-slate-300 bg-slate-100 text-slate-800 shadow-sm ring-1 ring-slate-500/20 font-medium";
    case "needs_improvement":
      return "border-amber-400 bg-amber-100 text-amber-900 shadow-sm ring-1 ring-amber-500/20 font-medium";
    default:
      return "border-zinc-300 bg-zinc-100 text-zinc-800 font-medium";
  }
}

interface PromptFeedbackPanelProps {
  promptId: string;
  initialData: {
    feedbackRating: number | null;
    feedbackLabel: string | null;
    feedbackNote: string | null;
    feedbackTags: string | null;
    isFavorite: boolean;
  };
}

export function PromptFeedbackPanel({ promptId, initialData }: PromptFeedbackPanelProps) {
  const parseTags = (str: string | null): string[] => {
    if (!str) return [];
    try { return JSON.parse(str); } catch { return []; }
  };

  const [rating, setRating] = useState(initialData.feedbackRating ?? 0);
  const [label, setLabel] = useState(initialData.feedbackLabel ?? "");
  const [note, setNote] = useState(initialData.feedbackNote ?? "");
  const [tags, setTags] = useState<string[]>(parseTags(initialData.feedbackTags));
  const [favorite, setFavorite] = useState(initialData.isFavorite);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const result = await updatePromptFeedback(promptId, {
        feedbackRating: rating || undefined,
        feedbackLabel: label || undefined,
        feedbackNote: note.trim() || undefined,
        feedbackTags: tags.length > 0 ? tags : undefined,
        isFavorite: favorite,
      });
      if (!result.success) {
        toast.error(result.error ?? "保存失败");
      } else {
        toast.success("反馈已保存");
      }
    } catch {
      toast.error("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  }

  function toggleTag(tag: string) {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.length < 10) {
      setTags([...tags, tag]);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-[13px] font-medium">
          <span>Prompt 反馈</span>
          <Button
            variant={favorite ? "outline" : "ghost"}
            size="sm"
            className={`h-7 gap-1 rounded-[8px] text-[11px] transition-colors duration-150 ${
              favorite
                ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300"
                : "hover:bg-zinc-100"
            }`}
            onClick={() => {
              setFavorite(!favorite);
            }}
          >
            <Bookmark className={`h-3.5 w-3.5 shrink-0 ${favorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
            <span className="inline-flex items-center leading-none">
              {favorite ? "已收藏" : "收藏"}
            </span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[12px] text-muted-foreground">
          记录这条 Prompt 的实际使用效果，后续可用于筛选和优化。
        </p>

        {/* Quick labels */}
        <div className="flex gap-2">
          {QUICK_LABELS.map((item) => {
            const isSelected = label === item.value;
            const iconColor = isSelected
              ? item.value === "useful" ? "text-emerald-600" : item.value === "average" ? "text-slate-600" : "text-amber-600"
              : "text-zinc-500";
            return (
              <Button
                key={item.value}
                variant="outline"
                size="sm"
                className={`h-8 gap-1.5 rounded-[10px] text-[12px] transition-all duration-150 ${getQuickLabelClass(item.value, isSelected)}`}
                onClick={() => setLabel(isSelected ? "" : item.value)}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
                <span className="inline-flex items-center leading-none">{item.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Rating stars */}
        <div>
          <p className="mb-1.5 text-[12px] font-medium text-muted-foreground">评分</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(rating === n ? 0 : n)}
                className="rounded p-0.5 transition-colors hover:text-amber-400"
              >
                <Star
                  className={`h-5 w-5 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Feedback tags */}
        <div>
          <p className="mb-1.5 text-[12px] font-medium text-muted-foreground">常用标签</p>
          <div className="flex flex-wrap gap-1.5">
            {FEEDBACK_TAGS.map((tag) => (
              <SelectableChip
                key={tag}
                selected={tags.includes(tag)}
                onClick={() => toggleTag(tag)}
                variant="indigo"
              >
                {tag}
              </SelectableChip>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <p className="mb-1.5 text-[12px] font-medium text-muted-foreground">补充说明</p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="这条 Prompt 哪里好，哪里需要改？"
            className="min-h-[60px] rounded-[10px] text-[12px]"
            maxLength={500}
          />
        </div>

        {/* Save */}
        <Button
          className="rounded-[10px]"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
          ) : null}
          <span className="inline-flex items-center leading-none">
            {saving ? "保存中..." : "保存反馈"}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
