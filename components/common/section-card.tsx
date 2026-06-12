import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function SectionCard({ title, description, children, className, action }: SectionCardProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 sm:p-6", className)}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-medium text-foreground">{title}</h3>
          {description && (
            <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
