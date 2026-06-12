import type { Inspiration } from "@/types";
import { InspirationCard } from "@/components/inspirations/inspiration-card";

interface InspirationGridProps {
  inspirations: Inspiration[];
}

export function InspirationGrid({ inspirations }: InspirationGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {inspirations.map((inspiration) => (
        <InspirationCard key={inspiration.id} inspiration={inspiration} />
      ))}
    </div>
  );
}
