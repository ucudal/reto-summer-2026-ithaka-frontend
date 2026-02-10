"use client"

import React from "react"
import { useRole } from "@/components/role-context"

export function RoleSelector() {
  const { role, setRole } = useRole()

  if (role) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Seleccioná tu rol</h2>
        <p className="mt-2 text-sm text-muted-foreground">Elige tu rol para acceder a la plataforma.</p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => setRole("tutor")}
            className="rounded-md border border-border px-4 py-2 hover:bg-muted text-left"
          >
            <div className="font-medium">Tutor</div>
            <div className="text-xs text-muted-foreground">Dashboard y Proyectos</div>
          </button>
          <button
            onClick={() => setRole("coordinador")}
            className="rounded-md border border-border px-4 py-2 hover:bg-muted text-left"
          >
            <div className="font-medium">Coordinador</div>
            <div className="text-xs text-muted-foreground">Acceso completo excepto Gestión de Usuarios</div>
          </button>
          <button
            onClick={() => setRole("admin")}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Admin (Acceso Total)
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoleSelector
