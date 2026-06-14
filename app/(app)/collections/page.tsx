import { Plus } from "lucide-react";
import Link from "next/link";
import { PageHeading } from "@/components/layout/page-heading";
import { CollectionCard } from "@/components/collections/collection-card";
import { EmptyState } from "@/components/common/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCollections } from "@/lib/actions/collections";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <PageHeading
        title="收藏集"
        description="按项目方向或主题整理 UI 灵感，方便后续生成 Prompt 时批量参考。"
        action={
          <Link href="/collections/new" className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-1 rounded-[10px]")}>
            <Plus className="h-3.5 w-3.5 shrink-0" />
            <span className="inline-flex items-center leading-none">新建收藏集</span>
          </Link>
        }
      />

      {collections.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <CollectionCard key={c.id} collection={c as unknown as import("@/types").Collection} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="还没有收藏集"
          description="创建一个收藏集，把常用 UI 灵感按项目方向整理起来。"
          action={
            <Link href="/collections/new" className={cn(buttonVariants({ variant: "default", size: "default" }), "gap-1.5")}>
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span className="inline-flex items-center leading-none">新建收藏集</span>
            </Link>
          }
        />
      )}
    </>
  );
}
