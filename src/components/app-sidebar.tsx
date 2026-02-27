"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "@/public/logout.png";
import Image from "next/image";
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Users,
  Settings as SettingsIcon,
  HandHeart,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useState } from "react";
import { useRole } from "@/src/components/role-context";
import { useAuthStore } from "@/src/hooks/useAuthStore";
import { useSettings } from "@/src/components/settings-context";
import { useI18n } from "@/src/lib/i18n";

const navItems = [
  { href: "/", label: "nav.dashboard", icon: LayoutDashboard },
  { href: "/postulaciones", label: "nav.postulaciones", icon: Inbox },
  { href: "/proyectos", label: "nav.proyectos", icon: FolderKanban },
  { href: "/evaluaciones", label: "nav.evaluaciones", icon: ClipboardCheck },
  { href: "/apoyos", label: "Apoyos", icon: HandHeart },
  {
    href: "/gestion-usuarios",
    label: "nav.gestionUsuarios",
    icon: Users,
    adminOnly: true,
  },
];

export function AppSidebar() {
  const { startLogout, user } = useAuthStore();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { role } = useRole();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { openSettings, settings, setSettings } = useSettings();
  const isCompact = collapsed || settings.compactSidebar;
  const { t } = useI18n();
  const roleLabel =
    role === "admin"
      ? t("role.adminLabel")
      : role === "coordinador"
        ? t("role.coordinadorLabel")
        : role === "operador"
          ? t("role.operadorLabel")
          : role === "tutor"
            ? t("role.tutorLabel")
            : "";
  const handleToggle = () => {
    if (settings.compactSidebar) {
      setSettings({ compactSidebar: false });
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200",
        isCompact ? "w-16" : "w-64",
      )}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
          I
        </div>
        {!isCompact && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-accent-foreground">
              {t("app.title")}
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              {t("app.subtitle")}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {(() => {
            // Filtrar items según el rol
            let items = navItems;
            if (role === "tutor") {
              // Tutor: solo Dashboard y Proyectos
              items = navItems.filter(
                (i) => i.href === "/" || i.href === "/proyectos",
              );
            } else if (role === "coordinador"|| role === "operador") {
              // Coordinador: todo excepto Gestión de Usuarios
              items = navItems.filter((i) => !i.adminOnly);
            }
            // Admin: todos los items

            return items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!isCompact && <span>{t(item.label)}</span>}
                  </Link>
                </li>
              );
            });
          })()}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center justify-between">
          {!isCompact && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium">{user?.name || t("user.guest")}</span> {/* aca*/}
              <span className="text-xs text-sidebar-foreground/60">{roleLabel || role}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openSettings}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition"
              title={t("settings.titleButton")}
            >
              <SettingsIcon className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition"
              title={t("nav.logout")}
            >
              <Image src={Logout} alt="Logout" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>

      {role === "tutor" && (
        <button
          onClick={handleToggle}
          className={cn(
            "absolute top-1/2 translate-x-1/2 -translate-y-1/2 z-50",
            "rounded-full border bg-sidebar p-2 shadow-md",
          )}
          aria-label={isCompact ? t("sidebar.expand") : t("sidebar.collapse")}
        >
          {isCompact ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      )}

      {role === "admin" && (
        <button
          onClick={handleToggle}
          className={cn(
            "absolute bottom-1/3 translate-x-1/2 -translate-y-1/2 z-50",
            "rounded-full border bg-sidebar p-2 shadow-md",
          )}
          aria-label={isCompact ? t("sidebar.expand") : t("sidebar.collapse")}
        >
          {isCompact ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      )}


      {/* Confirmacion de logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {t("logout.title")}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              {t("logout.message")}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
              >
                {t("logout.cancel")}
              </button>
              <button
                onClick={() => { startLogout(); setShowLogoutConfirm(false); }}
                className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition text-sm font-medium"
              >
                {t("logout.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
