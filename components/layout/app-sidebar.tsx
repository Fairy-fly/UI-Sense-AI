"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME, APP_TAGLINE, PHASE_BADGE, navItems } from "@/lib/constants";

function isNavActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;

  // /inspirations/[id] 详情页匹配 Inspirations
  if (href === "/inspirations") {
    return pathname.startsWith("/inspirations/") && pathname !== "/inspirations/new";
  }

  // /collections/[id] 详情页/编辑页匹配 Collections
  if (href === "/collections") {
    return pathname.startsWith("/collections/") && pathname !== "/collections/new";
  }

  return false;
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-border bg-card">
      {/* Logo area */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-semibold tracking-tight text-foreground">
            {APP_NAME}
          </span>
          <span className="text-[10px] text-muted-foreground">{APP_TAGLINE}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = isNavActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] font-medium transition-colors duration-150",
                isActive
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer badge */}
      <div className="border-t border-border px-5 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-foreground/40" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-foreground" />
          </span>
          <span className="text-[11px] text-muted-foreground">{PHASE_BADGE}</span>
        </div>
      </div>
    </aside>
  );
}
