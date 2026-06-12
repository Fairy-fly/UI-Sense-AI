"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

export function RatingInput({ value, onChange, max = 5, disabled }: RatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? value;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
        {Array.from({ length: max }, (_, i) => {
          const star = i + 1;
          const filled = star <= active;

          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onChange(star)}
              onMouseEnter={() => !disabled && setHovered(star)}
              className={cn(
                "rounded p-0.5 transition-colors",
                disabled ? "cursor-default" : "cursor-pointer hover:text-amber-400",
              )}
            >
              <Star
                className={cn(
                  "h-5 w-5 transition-colors",
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-none text-muted-foreground/40",
                )}
              />
            </button>
          );
        })}
      </div>
      <span className="text-[12px] tabular-nums text-muted-foreground">
        <span className="font-medium text-foreground">{value}</span> / {max} 星
      </span>
    </div>
  );
}
