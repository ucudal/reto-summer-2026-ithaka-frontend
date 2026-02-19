"use client"

import React from "react"
import { AppShell } from "@/src/components/app-shell"
import { useI18n } from "@/src/lib/i18n"

export default function GestionUsuariosPage() {
  const { t } = useI18n()
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("gestionUsuarios.title")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("gestionUsuarios.subtitle")}
          </p>
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("gestionUsuarios.sectionTitle")}
            </h2>
            <p className="text-muted-foreground">
              {t("gestionUsuarios.sectionDesc")}
            </p>
            {/* Aqui va el contenido de gestion de usuarios */}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
