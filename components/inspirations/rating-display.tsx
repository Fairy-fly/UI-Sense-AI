import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingDisplay({ rating, maxRating = 5, size = "sm", className }: RatingDisplayProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          className={cn(
            size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}
