import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ScrollToTop } from "@/components/layout/scroll-to-top";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <ScrollToTop />
      {children}
    </AppShell>
  );
}
