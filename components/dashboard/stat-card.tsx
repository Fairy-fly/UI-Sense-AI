import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-border bg-card p-5 transition-all hover:border-ring/20 sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-muted-foreground">{title}</p>
          <p className="mt-1.5 text-[32px] font-semibold leading-none tracking-tight text-foreground">
            {value}
          </p>
          {description && (
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
          {trend && (
            <p className="mt-1.5 text-[12px] text-muted-foreground">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-muted/80">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
