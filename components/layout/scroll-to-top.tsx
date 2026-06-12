"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const main = document.querySelector("[data-app-scroll-container]");
    if (main instanceof HTMLElement) {
      main.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}
