"use client"

import { Badge } from "@/src/components/ui/badge"
import { cn } from "@/src/lib/utils"
import { getEstadoApoyoLabel, getEstadoPostulacionLabel, getEstadoProyectoLabel, useI18n } from "@/src/lib/i18n"

const statusStyles: Record<string, string> = {
  borrador: "bg-muted text-muted-foreground",
  recibida: "bg-primary/10 text-primary border-primary/20",
  en_evaluacion: "bg-warning/10 text-warning border-warning/20",
  proyecto_activo: "bg-success/10 text-success border-success/20",
  incubado: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  cerrado: "bg-muted text-muted-foreground",
  activo: "bg-success/10 text-success border-success/20",
  finalizado: "bg-muted text-muted-foreground",
}

export function StatusBadge({ status }: { status: string }) {
  const { lang } = useI18n()
  const label =
    (status === "borrador" || status === "recibida")
      ? getEstadoPostulacionLabel(lang, status)
      : (status === "en_evaluacion" || status === "proyecto_activo" || status === "incubado" || status === "cerrado")
        ? getEstadoProyectoLabel(lang, status)
        : (status === "activo" || status === "finalizado")
          ? getEstadoApoyoLabel(lang, status)
          : status
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium",
        statusStyles[status] || "bg-muted text-muted-foreground"
      )}
    >
      {label}
    </Badge>
  )
}
