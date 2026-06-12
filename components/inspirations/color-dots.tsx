import { cn } from "@/lib/utils";

function getColorClass(tagColor: string | null): string {
  if (!tagColor) return "bg-muted-foreground/30";
  const map: Record<string, string> = {
    neutral: "bg-stone-400",
    zinc: "bg-zinc-400",
    slate: "bg-slate-400",
    stone: "bg-stone-500",
    violet: "bg-violet-400",
    indigo: "bg-indigo-400",
    amber: "bg-amber-400",
  };
  return map[tagColor] ?? "bg-muted-foreground/30";
}

interface ColorDotsProps {
  tags?: { color?: string | null }[];
  className?: string;
}

export function ColorDots({ tags, className }: ColorDotsProps) {
  if (!tags || tags.length === 0) return null;

  const uniqueColors = [...new Set(tags.map((t) => t.color).filter(Boolean))];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {uniqueColors.slice(0, 5).map((color) => (
        <span
          key={color}
          className={cn("inline-block h-2 w-2 rounded-full", getColorClass(color ?? null))}
        />
      ))}
    </div>
  );
}
