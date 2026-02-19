"use client"

import React from "react"
import { AppShell } from "@/src/components/app-shell"
import { UsuariosList } from "@/src/components/usuarios-list"
import { useI18n } from "@/src/lib/i18n"

export default function GestionUsuariosPage() {
  const { t } = useI18n()
  return (
    <AppShell>
      <UsuariosList />
    </AppShell>
  )
}
