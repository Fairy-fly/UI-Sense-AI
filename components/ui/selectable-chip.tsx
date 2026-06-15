"use client";

/**
 * SelectableChip — v1.8
 *
 * Unified clickable chip/tag/pill component.
 * Not for display-only badges — use <Badge> for those.
 */

import { cn } from "@/lib/utils";

interface SelectableChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  variant?: "indigo" | "emerald" | "slate" | "amber" | "zinc";
  disabled?: boolean;
  className?: string;
}

const base =
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 active:scale-[0.98]";

const unselected =
  "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 hover:text-zinc-950";

const variantSelected: Record<string, string> = {
  indigo: "border-indigo-300 bg-indigo-50 text-indigo-800 ring-1 ring-indigo-500/20 shadow-sm",
  emerald: "border-emerald-300 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500/20 shadow-sm",
  slate: "border-slate-300 bg-slate-100 text-slate-800 ring-1 ring-slate-500/20 shadow-sm",
  amber: "border-amber-300 bg-amber-50 text-amber-800 ring-1 ring-amber-500/20 shadow-sm",
  zinc: "border-zinc-300 bg-zinc-100 text-zinc-800 ring-1 ring-zinc-500/20 shadow-sm",
};

const disabledClass = "opacity-50 cursor-not-allowed pointer-events-none";

export function SelectableChip({
  children,
  selected = false,
  onClick,
  variant = "indigo",
  disabled = false,
  className,
}: SelectableChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        base,
        disabled ? disabledClass : selected ? variantSelected[variant] : unselected,
        className,
      )}
    >
      {children}
    </button>
  );
}
