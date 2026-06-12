import Link from "next/link";
import type { Inspiration } from "@/types";
import { InspirationCard } from "@/components/inspirations/inspiration-card";
import { SectionCard } from "@/components/common/section-card";

interface RecentInspirationsProps {
  inspirations: Inspiration[];
}

export function RecentInspirations({ inspirations }: RecentInspirationsProps) {
  const recent = inspirations.slice(0, 4);

  return (
    <SectionCard
      title="最近灵感"
      description="最新添加到灵感库的 UI 参考。"
      action={
        <Link
          href="/inspirations"
          className="text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          查看全部 →
        </Link>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {recent.map((insp) => (
          <InspirationCard key={insp.id} inspiration={insp} />
        ))}
      </div>
    </SectionCard>
  );
}
