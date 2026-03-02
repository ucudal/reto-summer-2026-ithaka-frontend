"use client";

import { AppShell } from "@/src/components/app-shell";
import { usePathname } from "next/navigation";

export function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/login") || pathname.startsWith("/chatbot")) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
