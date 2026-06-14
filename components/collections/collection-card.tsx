import Link from "next/link";
import { FolderKanban, Calendar } from "lucide-react";
import type { Collection } from "@/types";

const COVER_COLORS: Record<string, string> = {
  slate: "bg-slate-100 border-slate-200",
  zinc: "bg-zinc-100 border-zinc-200",
  neutral: "bg-neutral-100 border-neutral-200",
  stone: "bg-stone-100 border-stone-200",
  rose: "bg-rose-50 border-rose-200",
  sky: "bg-sky-50 border-sky-200",
  amber: "bg-amber-50 border-amber-200",
  emerald: "bg-emerald-50 border-emerald-200",
  violet: "bg-violet-50 border-violet-200",
};

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const coverClass = collection.coverColor
    ? (COVER_COLORS[collection.coverColor] ?? COVER_COLORS.slate)
    : COVER_COLORS.slate;

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-ring/20 hover:shadow-sm"
    >
      {/* Cover area */}
      <div className={`flex h-24 items-center justify-center border-b ${coverClass}`}>
        <FolderKanban className="h-8 w-8 text-muted-foreground/40" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="truncate text-[14px] font-medium leading-snug text-foreground group-hover:text-primary/80">
          {collection.name}
        </h3>
        {collection.description && (
          <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
            {collection.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
          <span>{collection._count?.inspirations ?? 0} 个灵感</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {collection.updatedAt.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}
          </span>
        </div>
      </div>
    </Link>
  );
}
