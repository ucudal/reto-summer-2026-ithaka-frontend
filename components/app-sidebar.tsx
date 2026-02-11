"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Logout from "@/public/logout.png"
import Image from "next/image";
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  ClipboardCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useRole } from "@/components/role-context"


const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/postulaciones", label: "Postulaciones", icon: Inbox },
  { href: "/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/evaluaciones", label: "Evaluaciones", icon: ClipboardCheck },
  { href: "/nueva-postulacion", label: "Nueva Postulacion", icon: FileText },
  { href: "/gestion-usuarios", label: "Gestion de Usuarios", icon: Users, adminOnly: true },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { role } = useRole()

  return (
    <aside
      className={cn(
        "relatiev flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
          I
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-accent-foreground">
              Ithaka
            </span>
            <span className="text-xs text-sidebar-foreground/60">Backoffice</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {(() => {
            const { role } = useRole()
            
            // Filtrar items según el rol
            let items = navItems
            if (role === "tutor") {
              // Tutor: solo Dashboard y Proyectos
              items = navItems.filter(i => i.href === "/" || i.href === "/proyectos")
            } else if (role === "coordinador") {
              // Coordinador: todo excepto Gestión de Usuarios
              items = navItems.filter(i => !i.adminOnly)
            }
            // Admin: todos los items
            
            return items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })
          })()}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center justify-between">
          
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium">
                Juan
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                {role}
              </span>
            </div>
          )}

          <button
            onClick={() => {console.log("Hola")}}
            aria-label={collapsed ? "Abrir configuración" : "Cerrar configuración"}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition"
          >
            <Image
              src={Logout}
              alt="Logout"
              width={20}
              height={20}
            />
          </button>

        </div>
      </div>


      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
            absolute
            top-1/2
            left-1/8
            translate-x-1/2
            -translate-y-1/2
            z-50
            rounded-full
            border
            bg-sidebar
            p-2
            shadow-md
          "
        aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside> 
  )
}
