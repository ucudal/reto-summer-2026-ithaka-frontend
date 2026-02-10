"use client"

import { useEffect, useState, useCallback } from "react"
import { getProyectos } from "@/app/actions"
import type { Proyecto } from "@/lib/data"
import { StatusBadge } from "@/components/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ClipboardCheck, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

const potencialColors: Record<string, string> = {
  alto: "bg-success/10 text-success border-success/20",
  medio: "bg-warning/10 text-warning border-warning/20",
  bajo: "bg-destructive/10 text-destructive border-destructive/20",
}

export function EvaluacionesList() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])

  const loadData = useCallback(async () => {
    const data = await getProyectos()
    setProyectos(data)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const withEval = proyectos.filter((p) => p.evaluacion)
  const withoutEval = proyectos.filter((p) => !p.evaluacion)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Evaluaciones</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vista general de evaluaciones de proyectos
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Evaluados</p>
                <p className="text-xl font-bold">{withEval.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pendientes</p>
                <p className="text-xl font-bold">{withoutEval.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <ClipboardCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Potencial Alto</p>
                <p className="text-xl font-bold">
                  {
                    withEval.filter(
                      (p) => p.evaluacion?.potencialIncubacion === "alto"
                    ).length
                  }
                </p>
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
                <p className="text-xs text-muted-foreground">
                  Comunidad UCU
                </p>
                <p className="text-xl font-bold">
                  {
                    withEval.filter((p) => p.evaluacion?.pertenenciaUCU)
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending evaluations */}
      {withoutEval.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Proyectos pendientes de evaluacion
            </h2>
            <div className="space-y-2">
              {withoutEval.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {p.id}
                    </span>
                    <span className="text-sm font-medium">
                      {p.nombreProyecto}
                    </span>
                    <StatusBadge status={p.estado} />
                  </div>
                  <Link href={`/proyectos/${p.id}`}>
                    <Button size="sm" variant="outline">
                      Evaluar
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evaluated projects table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Potencial</TableHead>
                <TableHead>Comunidad UCU</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withEval.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No hay evaluaciones registradas
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                withEval.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium text-sm">
                          {p.nombreProyecto}
                        </span>
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {p.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.estado} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {p.evaluacion?.etapaEmprendimiento}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          potencialColors[
                            p.evaluacion?.potencialIncubacion || ""
                          ] || ""
                        }
                      >
                        {p.evaluacion?.potencialIncubacion
                          ? p.evaluacion.potencialIncubacion
                              .charAt(0)
                              .toUpperCase() +
                            p.evaluacion.potencialIncubacion.slice(1)
                          : "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {p.evaluacion?.pertenenciaUCU ? "Si" : "No"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/proyectos/${p.id}`}>
                        <Button size="sm" variant="outline">
                          Ver detalle
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
