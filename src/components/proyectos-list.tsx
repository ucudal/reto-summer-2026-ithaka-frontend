"use client"

import { useEffect, useState, useCallback } from "react"
import { getProyectos } from "@/src/app/actions"
import type { Proyecto, EstadoProyecto, TipoPostulante } from "@/src/lib/data"
import { TIPO_POSTULANTE_LABELS } from "@/src/lib/data"
import { StatusBadge } from "@/src/components/status-badge"
import { Card, CardContent } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Button } from "@/src/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Search, Eye } from "lucide-react"
import Link from "next/link"

export function ProyectosList() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [search, setSearch] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("all")
  const [filterTipo, setFilterTipo] = useState<string>("all")

  const loadData = useCallback(async () => {
    const data = await getProyectos()
    setProyectos(data)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filtered = proyectos.filter((p) => {
    const matchSearch =
      p.nombreProyecto.toLowerCase().includes(search.toLowerCase()) ||
      p.nombrePostulante.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filterEstado === "all" || p.estado === filterEstado
    const matchTipo = filterTipo === "all" || p.tipoPostulante === filterTipo
    return matchSearch && matchEstado && matchTipo
  })

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Proyectos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestion del ciclo de vida de ideas y emprendimientos
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, postulante o ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="recibida">Recibida</SelectItem>
                <SelectItem value="en_evaluacion">En evaluacion</SelectItem>
                <SelectItem value="proyecto_activo">Proyecto activo</SelectItem>
                <SelectItem value="incubado">Incubado</SelectItem>
                <SelectItem value="cerrado">Cerrado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tipo postulante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="estudiante_ucu">Estudiante UCU</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
                <SelectItem value="docente_funcionario">
                  Docente/Funcionario UCU
                </SelectItem>
                <SelectItem value="externo">Externo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Postulante</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Apoyos</TableHead>
                <TableHead>Actualizado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No se encontraron proyectos
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {p.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {p.nombreProyecto}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{p.nombrePostulante}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">
                        {TIPO_POSTULANTE_LABELS[p.tipoPostulante as TipoPostulante]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.estado} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {p.responsableIthaka || (
                          <span className="text-muted-foreground italic">
                            Sin asignar
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {p.apoyos.length > 0
                          ? `${p.apoyos.filter((a) => a.estado === "activo").length} activos`
                          : (
                              <span className="text-muted-foreground">-</span>
                            )}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(p.actualizadoEn)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/proyectos/${p.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
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
