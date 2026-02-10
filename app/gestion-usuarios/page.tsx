import React from "react"

export default function GestionUsuariosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-2">
          Panel administrativo para gestionar usuarios del sistema
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Usuarios</h2>
          <p className="text-muted-foreground">
            Este es el espacio para gestionar los usuarios del sistema.
          </p>
          {/* Aquí va el contenido de gestión de usuarios */}
        </div>
      </div>
    </div>
  )
}
