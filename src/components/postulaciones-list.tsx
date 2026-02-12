"use client"

import { useEffect, useState, useCallback } from "react"
import { getPostulaciones, convertirAProyecto } from "@/src/app/actions"
import type { Postulacion, TipoPostulante, EstadoPostulacion } from "@/src/lib/data"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Search, ArrowUpRight, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function PostulacionesList() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [search, setSearch] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("all")
  const [filterTipo, setFilterTipo] = useState<string>("all")
  const [convertDialog, setConvertDialog] = useState<Postulacion | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const loadData = useCallback(async () => {
    const data = await getPostulaciones()
    setPostulaciones(data)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filtered = postulaciones.filter((p) => {
    const matchSearch =
      p.nombreProyecto.toLowerCase().includes(search.toLowerCase()) ||
      p.nombrePostulante.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filterEstado === "all" || p.estado === filterEstado
    const matchTipo = filterTipo === "all" || p.tipoPostulante === filterTipo
    return matchSearch && matchEstado && matchTipo
  })

  async function handleConvert() {
    if (!convertDialog) return
    setLoading(true)
    const result = await convertirAProyecto(convertDialog.id)
    setLoading(false)
    setConvertDialog(null)
    if (result) {
      router.push(`/proyectos/${result.id}`)
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Postulaciones</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bandeja de entrada de postulaciones desde el chatbot
          </p>
        </div>
        <Link href="/nueva-postulacion">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva postulacion
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, postulante o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="recibida">Recibida</SelectItem>
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
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No se encontraron postulaciones
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {p.id}
                    </TableCell>
                    <TableCell className="font-medium">{p.nombreProyecto}</TableCell>
                    <TableCell>
                      <div>
                        <span className="text-sm">{p.nombrePostulante}</span>
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {p.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">
                        {TIPO_POSTULANTE_LABELS[p.tipoPostulante as TipoPostulante]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.estado} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(p.creadoEn)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.estado === "recibida" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setConvertDialog(p)}
                          >
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            Crear proyecto
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Convert Dialog */}
      <Dialog
        open={!!convertDialog}
        onOpenChange={(open) => !open && setConvertDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convertir a proyecto</DialogTitle>
            <DialogDescription>
              Se creara un nuevo proyecto a partir de la postulacion{" "}
              <strong>{convertDialog?.nombreProyecto}</strong> de{" "}
              <strong>{convertDialog?.nombrePostulante}</strong>. Esta accion
              registrara el cambio en el historial de auditoria.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertDialog(null)}>
              Cancelar
            </Button>
            <Button onClick={handleConvert} disabled={loading}>
              {loading ? "Creando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
