import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

const statusLabels: Record<string, string> = {
  borrador: "Borrador",
  recibida: "Recibida",
  en_evaluacion: "En evaluacion",
  proyecto_activo: "Proyecto activo",
  incubado: "Incubado",
  cerrado: "Cerrado",
  activo: "Activo",
  finalizado: "Finalizado",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium",
        statusStyles[status] || "bg-muted text-muted-foreground"
      )}
    >
      {statusLabels[status] || status}
    </Badge>
  )
}
