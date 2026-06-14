import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Sparkles, ExternalLink, Calendar, Pencil } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { InspirationDetail } from "@/components/inspirations/inspiration-detail";
import { DeleteInspirationButton } from "@/components/inspirations/delete-inspiration-button";
import { MockPreview } from "@/components/common/mock-preview";
import { buttonVariants } from "@/components/ui/button";
import { cn, getHostname } from "@/lib/utils";
import { displayProjectType } from "@/lib/display-labels";
import { getInspirationById } from "@/lib/actions/inspirations";
import { AddToCollectionPanel } from "@/components/collections/add-to-collection-panel";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InspirationDetailPage({ params }: Props) {
  const { id } = await params;
  const inspiration = await getInspirationById(id);

  if (!inspiration) {
    notFound();
  }

  const previewVariant = inspiration.previewVariant ?? "linear";
  const hasRealImage = inspiration.imageUrl && inspiration.imageUrl.length > 0;

  return (
    <>
      <PageHeading
        title={inspiration.title}
        description={
          inspiration.sourceUrl
            ? `${displayProjectType(inspiration.projectType ?? "")} · ${getHostname(inspiration.sourceUrl) ?? inspiration.sourceUrl}`
            : displayProjectType(inspiration.projectType ?? "")
        }
        action={
          <div className="flex items-center gap-2">
            <Link
              href={`/inspirations/${id}/edit`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 rounded-[10px]")}
            >
              <Pencil className="h-3.5 w-3.5 shrink-0" />
              <span className="inline-flex items-center leading-none">编辑</span>
            </Link>
            <DeleteInspirationButton inspirationId={id} />
            <Link
              href="/prompts"
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-1 rounded-[10px]")}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span className="inline-flex items-center leading-none">生成 Prompt</span>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Large preview */}
        <div className="lg:col-span-3">
          <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
            {hasRealImage ? (
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={inspiration.imageUrl}
                  alt={inspiration.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <MockPreview variant={previewVariant} className="aspect-[16/10] w-full rounded-none" />
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h3 className="mb-3 text-[14px] font-medium text-foreground">描述</h3>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              {inspiration.description}
            </p>
            <div className="mt-4 flex items-center gap-4 text-[12px] text-muted-foreground">
              {inspiration.sourceUrl && (
                <a
                  href={inspiration.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-foreground underline-offset-2 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  访问来源
                </a>
              )}
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {inspiration.createdAt.toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Info + Analysis */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <InspirationDetail inspiration={inspiration} />
            <AddToCollectionPanel inspirationId={id} />
          </div>
        </div>
      </div>
    </>
  );
}
