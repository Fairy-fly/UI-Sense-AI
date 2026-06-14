import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, ArrowLeft, Plus } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { InspirationCard } from "@/components/inspirations/inspiration-card";
import { EmptyState } from "@/components/common/empty-state";
import { DeleteCollectionButton } from "@/components/collections/delete-collection-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCollectionById } from "@/lib/actions/collections";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CollectionDetailPage({ params }: Props) {
  const { id } = await params;
  const collection = await getCollectionById(id);

  if (!collection) {
    notFound();
  }

  const inspirations = collection.inspirations as unknown as import("@/types").Inspiration[];

  return (
    <>
      <PageHeading
        title={collection.name}
        description={collection.description ?? `${collection._count?.inspirations ?? 0} 个灵感`}
        action={
          <div className="flex items-center gap-2">
            <Link
              href={`/collections/${id}/edit`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 rounded-[10px]")}
            >
              <Pencil className="h-3.5 w-3.5 shrink-0" />
              <span className="inline-flex items-center leading-none">编辑</span>
            </Link>
            <DeleteCollectionButton collectionId={id} />
            <Link
              href="/inspirations"
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-1 rounded-[10px]")}
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span className="inline-flex items-center leading-none">添加灵感</span>
            </Link>
          </div>
        }
      />

      {inspirations.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inspirations.map((insp) => (
            <InspirationCard key={insp.id} inspiration={insp as import("@/types").Inspiration} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="此收藏集还没有灵感"
          description="去灵感库浏览并添加合适的 UI 参考。"
          action={
            <Link href="/inspirations" className={cn(buttonVariants({ variant: "default", size: "default" }), "gap-1.5")}>
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span className="inline-flex items-center leading-none">浏览灵感库</span>
            </Link>
          }
        />
      )}

      <div className="mt-4">
        <Link href="/collections" className="inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" />
          返回收藏集列表
        </Link>
      </div>
    </>
  );
}
