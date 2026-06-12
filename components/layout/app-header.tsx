import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6 sm:px-8">
      {/* Left — search placeholder */}
      <div className="flex flex-1 items-center gap-2">
        <div className="hidden w-full max-w-[320px] items-center gap-2 rounded-[10px] border border-border bg-muted/50 px-3 py-1.5 text-[13px] text-muted-foreground sm:flex">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">搜索灵感、标签、Prompt...</span>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/inspirations/new"
          className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-1")}
        >
          <Plus className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline-flex items-center leading-none">新建灵感</span>
        </Link>
      </div>
    </header>
  );
}
