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
        <p className="mt-2 text-sm text-muted-foreground">Elegí "Tutor" para ver solo Dashboard y Proyectos.</p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setRole("tutor")}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Soy Tutor
          </button>
          <button
            onClick={() => setRole("admin")}
            className="flex-1 rounded-md border border-border px-4 py-2 hover:bg-muted"
          >
            Soy Admin
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoleSelector
