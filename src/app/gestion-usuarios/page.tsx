import React from "react"
import { AppShell } from "@/src/components/app-shell"
import { UsuariosList } from "@/src/components/usuarios-list"

export default function GestionUsuariosPage() {
  return (
    <AppShell>
      <UsuariosList />
    </AppShell>
  )
}
