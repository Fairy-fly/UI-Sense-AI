"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Sparkles, X, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createInspiration, updateInspiration } from "@/lib/actions/inspirations";
import { RatingInput } from "@/components/inspirations/rating-input";
import { SelectableChip } from "@/components/ui/selectable-chip";
import { projectTypes, defaultStyleTags } from "@/lib/constants";
import type { UrlMetadata } from "@/lib/metadata";
import { getAutoFillTitle } from "@/lib/metadata";

interface InspirationFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    description: string;
    sourceUrl: string;
    imageUrl: string;
    projectType: string;
    rating: number;
    notes: string;
    tags: string[];
  };
}

export function InspirationForm({ mode, initialData }: InspirationFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [sourceUrl, setSourceUrl] = useState(initialData?.sourceUrl ?? "");
  const [projectType, setProjectType] = useState(initialData?.projectType ?? "");
  const [rating, setRating] = useState(initialData?.rating ?? 3);
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [imageUrl] = useState(initialData?.imageUrl ?? "");
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl ?? "");
  const [saving, setSaving] = useState(false);

  // URL metadata fetching
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [metaResult, setMetaResult] = useState<UrlMetadata | null>(null);

  async function handleFetchMetadata() {
    if (!sourceUrl.trim()) {
      toast.error("请先填写来源链接");
      return;
    }
    setFetchingMeta(true);
    setMetaResult(null);
    try {
      const res = await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sourceUrl.trim() }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error ?? "读取失败，请手动填写");
        return;
      }
      const meta = data.data as UrlMetadata;
      setMetaResult(meta);

      // Auto-fill title only if empty, with tagline stripping + smart truncation
      if (!title.trim() && meta.title) {
        setTitle(getAutoFillTitle(meta.title, 80));
      }

      // Auto-fill notes with description only if empty
      if (!notes.trim() && meta.description) {
        setNotes(meta.description);
      }

      toast.success("已读取网页信息");
    } catch {
      toast.error("读取失败，请手动填写");
    } finally {
      setFetchingMeta(false);
    }
  }

  // File selected → show local preview
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate client-side
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("仅支持 PNG、JPG、WebP 格式");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("文件大小不能超过 10MB");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  // Add tag
  function addTag(name: string) {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 32) return;
    if (tags.includes(trimmed)) return;
    if (tags.length >= 12) {
      toast.error("最多 12 个标签");
      return;
    }
    setTags([...tags, trimmed]);
    setTagInput("");
  }

  function removeTag(name: string) {
    setTags(tags.filter((t) => t !== name));
  }

  async function handleSubmit() {
    if (!title.trim() || title.trim().length < 2) {
      toast.error("标题至少 2 个字符");
      return;
    }

    setSaving(true);

    try {
      let finalImageUrl = imageUrl;

      // Upload new image if selected
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadResult = await res.json();

        if (!uploadResult.success) {
          toast.error(uploadResult.error ?? "图片上传失败");
          setSaving(false);
          return;
        }
        finalImageUrl = uploadResult.imageUrl;
      }

      const input = {
        title: title.trim(),
        description: "",
        sourceUrl: sourceUrl.trim() || "",
        imageUrl: finalImageUrl,
        previewVariant: "linear",
        projectType: projectType || "",
        rating,
        notes: notes.trim(),
        tags,
      };

      if (mode === "create") {
        const result = await createInspiration(input);
        if (!result.success) {
          toast.error(result.error ?? "保存失败");
          setSaving(false);
          return;
        }
        toast.success("灵感已保存");
        router.push(`/inspirations/${result.id}`);
        router.refresh();
      } else if (mode === "edit" && initialData) {
        const result = await updateInspiration(initialData.id, input);
        if (!result.success) {
          toast.error(result.error ?? "更新失败");
          setSaving(false);
          return;
        }
        toast.success("灵感已更新");
        router.push(`/inspirations/${initialData.id}`);
        router.refresh();
      }
    } catch {
      toast.error("操作失败，请重试");
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Left: Upload Preview */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-[14px] font-medium">上传预览</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload zone */}
            <label
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-12 text-center transition-colors hover:border-ring/30 hover:bg-muted/50"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-[14px] font-medium text-foreground">上传 UI 截图</p>
              <p className="mt-1 text-[12px] text-muted-foreground">PNG、JPG、WebP，最大 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Preview */}
            {previewUrl ? (
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border">
                <Image
                  src={previewUrl}
                  alt="预览"
                  fill
                  className="object-cover"
                  unoptimized={previewUrl.startsWith("blob:")}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
                <p className="text-[12px] text-muted-foreground">选择图片后显示预览</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Basic Information */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-[14px] font-medium">基础信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">标题</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：Linear 项目仪表盘"
                className="rounded-[10px]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">来源链接</label>
              <div className="flex gap-2">
                <Input
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://linear.app/..."
                  className="flex-1 rounded-[10px]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1 rounded-[10px]"
                  onClick={handleFetchMetadata}
                  disabled={fetchingMeta || !sourceUrl.trim()}
                >
                  {fetchingMeta ? (
                    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
                  ) : (
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="inline-flex items-center leading-none">
                    {fetchingMeta ? "正在读取..." : "读取网页信息"}
                  </span>
                </Button>
              </div>

              {/* Preview card */}
              {metaResult && (
                <div className="mt-3 flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                  {/* Favicon */}
                  {metaResult.faviconUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={metaResult.faviconUrl}
                      alt=""
                      className="mt-0.5 h-4 w-4 shrink-0 rounded-sm"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-foreground">
                      {metaResult.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {metaResult.hostname}
                    </p>
                    {metaResult.description && (
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                        {metaResult.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-foreground">项目类型</label>
                <Select value={projectType} onValueChange={(v) => setProjectType(v ?? "")}>
                  <SelectTrigger className="rounded-[10px]">
                    <SelectValue placeholder="选择类型..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-foreground">评分</label>
                <RatingInput value={rating} onChange={setRating} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">风格标签</label>
              {/* Quick-pick tags */}
              <div className="mb-2 flex flex-wrap gap-1.5">
                {defaultStyleTags.slice(0, 10).map((tag) => (
                  <SelectableChip
                    key={tag}
                    selected={tags.includes(tag)}
                    onClick={() => (tags.includes(tag) ? removeTag(tag) : addTag(tag))}
                    variant="indigo"
                  >
                    {tag}
                  </SelectableChip>
                ))}
              </div>
              {/* Custom tag input */}
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="输入自定义标签..."
                  className="h-8 rounded-[10px] text-[12px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-[10px] text-[12px]"
                  onClick={() => addTag(tagInput)}
                >
                  添加
                </Button>
              </div>
              {/* Selected tags */}
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 text-[11px]">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-foreground">个人备注</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="这个 UI 好在哪里？可以描述布局、配色、字体、组件细节..."
                className="min-h-[80px] rounded-[10px]"
              />
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button className="rounded-[10px]" onClick={handleSubmit} disabled={saving}>
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span className="inline-flex items-center leading-none">{saving ? "保存中..." : mode === "create" ? "保存灵感" : "保存修改"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
