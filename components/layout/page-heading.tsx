import type { ReactNode } from "react";

interface PageHeadingProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeading({ title, description, action }: PageHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-3 shrink-0 sm:mt-0">{action}</div>}
    </div>
  );
}
