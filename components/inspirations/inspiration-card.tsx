import Link from "next/link";
import Image from "next/image";
import type { Inspiration } from "@/types";
import { RatingDisplay } from "@/components/inspirations/rating-display";
import { TagPill } from "@/components/inspirations/tag-pill";
import { ColorDots } from "@/components/inspirations/color-dots";
import { MockPreview } from "@/components/common/mock-preview";

interface InspirationCardProps {
  inspiration: Inspiration;
}

export function InspirationCard({ inspiration }: InspirationCardProps) {
  const { id, title, sourceUrl, projectType, rating, tags, createdAt, previewVariant, imageUrl } = inspiration;
  const hasRealImage = imageUrl && imageUrl.length > 0;

  return (
    <Link
      href={`/inspirations/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-ring/20 hover:shadow-sm"
    >
      {/* Preview image */}
      <div className="aspect-[16/10] w-full overflow-hidden">
        {hasRealImage ? (
          <Image
            src={imageUrl}
            alt={title}
            width={640}
            height={400}
            className="h-full w-full object-cover"
          />
        ) : (
          <MockPreview variant={previewVariant ?? "linear"} className="h-full w-full rounded-none" />
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-[14px] font-medium leading-snug text-foreground group-hover:text-primary/80">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          {projectType && (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px]">{projectType}</span>
          )}
          {sourceUrl && (
            <span className="truncate">{new URL(sourceUrl).hostname}</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <RatingDisplay rating={rating} />
            <ColorDots tags={tags} />
          </div>
          <span className="text-[11px] text-muted-foreground">
            {createdAt.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}
          </span>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {tags.slice(0, 3).map((tag) => (
              <TagPill key={tag.id} tag={tag} />
            ))}
            {tags.length > 3 && (
              <span className="text-[11px] text-muted-foreground">+{tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
