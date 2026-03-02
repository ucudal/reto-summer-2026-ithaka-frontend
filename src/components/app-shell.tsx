"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { AppSidebar } from "@/src/components/app-sidebar";
import { useRole } from "@/src/components/role-context";
import { SessionRefreshManager } from "@/src/components/session-refresh-manager";
import SettingsDrawer from "@/src/components/settings-drawer";
import { useAuthStore } from "@/src/hooks/useAuthStore";

type AppRole = "admin" | "coordinador" | "tutor" | "operador";

const ROLE_ALLOWED_PREFIXES: Record<AppRole, string[]> = {
  admin: [
    "/",
    "/postulaciones",
    "/proyectos",
    "/evaluaciones",
    "/apoyos",
    "/gestion-usuarios",
  ],
  coordinador: [
    "/",
    "/postulaciones",
    "/proyectos",
    "/evaluaciones",
    "/apoyos",
  ],
  operador: ["/", "/postulaciones", "/proyectos", "/evaluaciones", "/apoyos"],
  tutor: ["/", "/proyectos"],
};

const isPathAllowedForRole = (pathname: string, role: AppRole) => {
  const allowedPrefixes = ROLE_ALLOWED_PREFIXES[role];

  return allowedPrefixes.some((prefix) => {
    if (prefix === "/") {
      return pathname === "/";
    }

    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setRole } = useRole();
  const { status, user, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "authenticated" && user) {
      const raw = (user.role || "").toString().toLowerCase();
      const valid: AppRole[] = ["admin", "coordinador", "tutor", "operador"];
      if (valid.includes(raw as any)) {
        const normalizedRole = raw as AppRole;
        setRole(normalizedRole);

        if (
          (normalizedRole === "tutor" || normalizedRole === "coordinador") &&
          !isPathAllowedForRole(pathname, normalizedRole)
        ) {
          router.replace("/");
        }
      } else {
        console.warn("app-shell: unexpected role from auth store", user.role);
      }
    } else if (status === "not-authenticated") {
      router.push("/login");
    }
  }, [status, user, pathname, router, setRole]);

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
