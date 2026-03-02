"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { AppSidebar } from "@/src/components/app-sidebar";
import { useRole } from "@/src/components/role-context";
import { SessionRefreshManager } from "@/src/components/session-refresh-manager";
import SettingsDrawer from "@/src/components/settings-drawer";
import { useAuthStore } from "@/src/hooks/useAuthStore";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setRole } = useRole();
  const { status, user, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "authenticated" && user) {
      const raw = (user.role || "").toString().toLowerCase();
      const valid: Array<"admin" | "coordinador" | "tutor" | "operador"> = [
        "admin",
        "coordinador",
        "tutor",
        "operador",
      ];
      if (valid.includes(raw as any)) {
        setRole(raw as any);
      } else {
        console.warn("app-shell: unexpected role from auth store", user.role);
      }
    } else if (status === "not-authenticated") {
      router.push("/login");
    }
  }, [status, user, router, setRole]);

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <SessionRefreshManager />
      <SettingsDrawer />
    </div>
  );
}
