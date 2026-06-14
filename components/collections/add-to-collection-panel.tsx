"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  getCollections,
  getInspirationCollections,
  addInspirationToCollection,
  removeInspirationFromCollection,
} from "@/lib/actions/collections";
import type { Collection } from "@/types";

interface AddToCollectionPanelProps {
  inspirationId: string;
}

export function AddToCollectionPanel({ inspirationId }: AddToCollectionPanelProps) {
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [memberIds, setMemberIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [collections, memberships] = await Promise.all([
        getCollections(),
        getInspirationCollections(inspirationId),
      ]);
      setAllCollections(collections as unknown as Collection[]);
      setMemberIds(new Set(memberships.map((m) => m.collectionId)));
      setLoading(false);
    }
    load();
  }, [inspirationId]);

  async function toggle(collectionId: string) {
    if (memberIds.has(collectionId)) {
      const result = await removeInspirationFromCollection(inspirationId, collectionId);
      if (result.success) {
        setMemberIds((prev) => { const next = new Set(prev); next.delete(collectionId); return next; });
        toast.success("已从收藏集移除");
      } else {
        toast.error(result.error ?? "移除失败");
      }
    } else {
      const result = await addInspirationToCollection(inspirationId, collectionId);
      if (result.success) {
        setMemberIds((prev) => new Set(prev).add(collectionId));
        toast.success("已添加到收藏集");
      } else {
        toast.error(result.error ?? "添加失败");
      }
    }
  }

  const memberCollections = allCollections.filter((c) => memberIds.has(c.id));
  const nonMemberCollections = allCollections.filter((c) => !memberIds.has(c.id));

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-[14px] font-medium text-foreground">收藏集</h3>

      {loading ? (
        <p className="text-[12px] text-muted-foreground">加载中...</p>
      ) : (
        <>
          {/* Currently in */}
          {memberCollections.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {memberCollections.map((c) => (
                <Badge key={c.id} variant="secondary" className="cursor-pointer gap-1 text-[11px] hover:bg-muted" onClick={() => toggle(c.id)}>
                  {c.name}
                  <X className="h-3 w-3 shrink-0" />
                </Badge>
              ))}
            </div>
          )}

          {memberCollections.length === 0 && (
            <p className="mb-3 text-[12px] text-muted-foreground">暂未加入任何收藏集。</p>
          )}

          {/* Add to */}
          {nonMemberCollections.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="mb-2 text-[11px] text-muted-foreground">添加到：</p>
              <div className="flex flex-wrap gap-1.5">
                {nonMemberCollections.map((c) => (
                  <Badge key={c.id} variant="outline" className="cursor-pointer gap-1 text-[11px] hover:bg-muted" onClick={() => toggle(c.id)}>
                    <Plus className="h-3 w-3 shrink-0" />
                    {c.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {allCollections.length === 0 && (
            <div className="border-t border-border pt-3">
              <p className="text-[12px] text-muted-foreground">
                还没有收藏集。
                <Link href="/collections/new" className="ml-1 text-foreground underline-offset-2 hover:underline">新建一个</Link>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
