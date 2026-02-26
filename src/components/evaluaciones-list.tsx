"use client"

import { useEffect } from "react"
import { useEvaluacionesStore } from "@/src/hooks/useEvaluacionesStore"
import type { Caso } from "@/src/types/caso"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"
import { ClipboardCheck, ArrowRight, CheckCircle2, AlertCircle, FolderOpen } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/src/lib/i18n"

const estadoStyles: Record<string, string> = {
  "En programa": "bg-primary/10 text-primary border-primary/20",
  "Activo": "bg-success/10 text-success border-success/20",
  "Finalizado": "bg-muted text-muted-foreground border-border",
}

export function EvaluacionesList() {
  const { status, pendientes, proyectos, fetchEvaluaciones } = useEvaluacionesStore()
  const { t } = useI18n()

  useEffect(() => {
    fetchEvaluaciones()
  }, [fetchEvaluaciones])

  const activos = proyectos.filter(
    (p) => (p.nombre_estado ?? "").toLowerCase() === "activo"
  )
  const finalizados = proyectos.filter(
    (p) => (p.nombre_estado ?? "").toLowerCase() === "finalizado"
  )

  if (status === "loading") {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("evaluaciones.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("evaluaciones.subtitle")}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("evaluaciones.pendientes")}</p>
                <p className="text-xl font-bold">{pendientes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FolderOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("evaluaciones.totalProyectos")}</p>
                <p className="text-xl font-bold">{proyectos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("evaluaciones.activos")}</p>
                <p className="text-xl font-bold">{activos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("evaluaciones.finalizados")}</p>
                <p className="text-xl font-bold">{finalizados.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending evaluations */}
      {pendientes.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              {t("evaluaciones.pendientesTitulo")}
            </h2>
            <div className="space-y-2">
              {pendientes.map((p: Caso) => (
                <div
                  key={p.id_caso}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      #{p.id_caso}
                    </span>
                    <span className="text-sm font-medium">
                      {p.nombre_caso}
                    </span>
                    {p.nombre_estado && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-warning/10 text-warning border-warning/20"
                      >
                        {p.nombre_estado}
                      </Badge>
                    )}
                    {p.emprendedor && p.emprendedor !== "-" && (
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {p.emprendedor}
                      </span>
                    )}
                  </div>
                  <Link href={`/postulaciones/${p.id_caso}`}>
                    <Button size="sm" variant="outline">
                      {t("evaluaciones.evaluar")}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("evaluaciones.proyecto")}</TableHead>
                <TableHead>{t("evaluaciones.estado")}</TableHead>
                <TableHead>{t("evaluaciones.emprendedor")}</TableHead>
                <TableHead>{t("evaluaciones.tutor")}</TableHead>
                <TableHead>{t("evaluaciones.fecha")}</TableHead>
                <TableHead className="text-right">{t("evaluaciones.acciones")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proyectos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {t("evaluaciones.noData")}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                proyectos.map((p: Caso) => (
                  <TableRow key={p.id_caso}>
                    <TableCell>
                      <div>
                        <span className="font-medium text-sm">
                          {p.nombre_caso}
                        </span>
                        <br />
                        <span className="text-xs text-muted-foreground font-mono">
                          #{p.id_caso}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${estadoStyles[p.nombre_estado ?? ""] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {p.nombre_estado ?? "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {p.emprendedor && p.emprendedor !== "-" ? p.emprendedor : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {p.tutor && p.tutor !== "-" ? p.tutor : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {p.fecha_creacion
                          ? new Date(p.fecha_creacion).toLocaleDateString()
                          : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/proyectos/${p.id_caso}`}>
                        <Button size="sm" variant="outline">
                          {t("evaluaciones.verDetalle")}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
