"use client"

import { useRole } from "@/src/components/role-context"
import { useI18n } from "@/src/lib/i18n"

export function RoleSelector() {
  const { role, setRole } = useRole()
  const { t } = useI18n()

  if (role) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold">{t("role.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("role.subtitle")}</p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => setRole("tutor")}
            className="rounded-md border border-border px-4 py-2 hover:bg-muted text-left"
          >
            <div className="font-medium">{t("role.tutor")}</div>
            <div className="text-xs text-muted-foreground">{t("role.tutorDesc")}</div>
          </button>
          <button
            onClick={() => setRole("coordinador")}
            className="rounded-md border border-border px-4 py-2 hover:bg-muted text-left"
          >
            <div className="font-medium">{t("role.coordinador")}</div>
            <div className="text-xs text-muted-foreground">{t("role.coordinadorDesc")}</div>
          </button>
          <button
            onClick={() => setRole("admin")}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {t("role.admin")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoleSelector
