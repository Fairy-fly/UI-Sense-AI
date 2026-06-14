"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCollection, updateCollection } from "@/lib/actions/collections";

const COLOR_OPTIONS = [
  { value: "slate", label: "石板灰", className: "bg-slate-400" },
  { value: "zinc", label: "锌灰", className: "bg-zinc-400" },
  { value: "neutral", label: "中性灰", className: "bg-neutral-400" },
  { value: "stone", label: "暖石灰", className: "bg-stone-400" },
  { value: "rose", label: "玫瑰粉", className: "bg-rose-300" },
  { value: "sky", label: "天空蓝", className: "bg-sky-300" },
  { value: "amber", label: "琥珀黄", className: "bg-amber-300" },
  { value: "emerald", label: "翡翠绿", className: "bg-emerald-300" },
  { value: "violet", label: "紫罗兰", className: "bg-violet-300" },
];

interface CollectionFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    coverColor: string | null;
  };
}

export function CollectionForm({ mode, initialData }: CollectionFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [coverColor, setCoverColor] = useState(initialData?.coverColor ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("请输入收藏集名称");
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        const result = await createCollection({ name: name.trim(), description: description.trim() || undefined, coverColor: coverColor || undefined });
        if (!result.success) { toast.error(result.error ?? "创建失败"); return; }
        toast.success("收藏集已创建");
        router.push(`/collections/${result.data!.id}`);
      } else {
        const result = await updateCollection(initialData!.id, { name: name.trim(), description: description.trim() || undefined, coverColor: coverColor || undefined });
        if (!result.success) { toast.error(result.error ?? "更新失败"); return; }
        toast.success("收藏集已更新");
        router.push(`/collections/${initialData!.id}`);
      }
      router.refresh();
    } catch {
      toast.error("操作失败，请重试");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">名称</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="例如：SaaS 控制台" className="h-9 rounded-[10px] text-[13px]" maxLength={60} />
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">描述（可选）</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="简短描述这个收藏集的主题..." className="min-h-[80px] rounded-[10px] text-[13px]" maxLength={200} />
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-foreground">颜色</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCoverColor(coverColor === c.value ? "" : c.value)}
              className={`h-7 w-7 rounded-full ${c.className} ring-offset-1 transition-all ${
                coverColor === c.value ? "ring-2 ring-foreground" : "opacity-60 hover:opacity-100"
              }`}
              title={c.label}
            />
          ))}
        </div>
      </div>
      <Button type="submit" className="rounded-[10px]" disabled={saving}>
        <span className="inline-flex items-center leading-none">{saving ? "保存中..." : mode === "create" ? "创建收藏集" : "保存修改"}</span>
      </Button>
    </form>
  );
}
