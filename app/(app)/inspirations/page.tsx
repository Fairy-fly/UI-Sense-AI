import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { InspirationsContent } from "@/components/inspirations/inspirations-content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getInspirations } from "@/lib/actions/inspirations";
import { getTags } from "@/lib/actions/tags";

export default async function InspirationsPage() {
  const [inspirations, tags] = await Promise.all([getInspirations(), getTags()]);
  const allTags = tags.map((t) => t.name);

  return (
    <>
      <PageHeading
        title="UI 灵感库"
        description="收藏和整理符合你个人审美的 UI 参考。"
        action={
          <Link
            href="/inspirations/new"
            className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-1")}
          >
            <Plus className="h-3.5 w-3.5 shrink-0" />
            <span className="inline-flex items-center leading-none">上传灵感</span>
          </Link>
        }
      />

      <InspirationsContent inspirations={inspirations} allTags={allTags} />
    </>
  );
}
