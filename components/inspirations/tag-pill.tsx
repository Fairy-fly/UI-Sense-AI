import type { Tag } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { displayStyleTag } from "@/lib/display-labels";

interface TagPillProps {
  tag: Pick<Tag, "name" | "color"> | string;
  className?: string;
}

export function TagPill({ tag, className }: TagPillProps) {
  const name = typeof tag === "string" ? tag : tag.name;

  return (
    <Badge variant="secondary" className={cn("text-[11px] font-normal", className)}>
      {displayStyleTag(name)}
    </Badge>
  );
}
