"use client"

import { useEffect, useState, useCallback } from "react"
import { getPostulaciones, convertirAProyecto } from "@/src/app/actions"
import type { Postulacion, TipoPostulante } from "@/src/lib/data"
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
import { Search, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useI18n, getTipoPostulanteLabel, getEstadoPostulacionLabel, LOCALE_BY_LANG } from "@/src/lib/i18n"

export function PostulacionesList() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [search, setSearch] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("all")
  const [filterTipo, setFilterTipo] = useState<string>("all")
  const [convertDialog, setConvertDialog] = useState<Postulacion | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t, lang } = useI18n()

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
    return new Date(dateStr).toLocaleDateString(LOCALE_BY_LANG[lang], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("postulaciones.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("postulaciones.subtitle")}
          </p>
        </div>
        <Link href="/nueva-postulacion">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("postulaciones.nueva")}
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
                placeholder={t("postulaciones.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t("postulaciones.estado")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("postulaciones.todosEstados")}</SelectItem>
                <SelectItem value="borrador">{getEstadoPostulacionLabel(lang, "borrador")}</SelectItem>
                <SelectItem value="recibida">{getEstadoPostulacionLabel(lang, "recibida")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("postulaciones.tipoPostulante")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("postulaciones.todosTipos")}</SelectItem>
                <SelectItem value="estudiante_ucu">{getTipoPostulanteLabel(lang, "estudiante_ucu")}</SelectItem>
                <SelectItem value="alumni">{getTipoPostulanteLabel(lang, "alumni")}</SelectItem>
                <SelectItem value="docente_funcionario">
                  {getTipoPostulanteLabel(lang, "docente_funcionario")}
                </SelectItem>
                <SelectItem value="externo">{getTipoPostulanteLabel(lang, "externo")}</SelectItem>
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
                <TableHead>{t("postulaciones.id")}</TableHead>
                <TableHead>{t("postulaciones.proyecto")}</TableHead>
                <TableHead>{t("postulaciones.postulante")}</TableHead>
                <TableHead>{t("postulaciones.tipo")}</TableHead>
                <TableHead>{t("postulaciones.estado")}</TableHead>
                <TableHead>{t("postulaciones.fecha")}</TableHead>
                <TableHead className="text-right">{t("postulaciones.acciones")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {t("postulaciones.noResults")}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/postulaciones/${p.id}`)}
                  >
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
                        {getTipoPostulanteLabel(lang, p.tipoPostulante as TipoPostulante)}
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
                            onClick={(e) => {
                              e.stopPropagation()
                              setConvertDialog(p)
                            }}
                          >
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            {t("postulaciones.crearProyecto")}
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
            <DialogTitle>{t("postulaciones.convertirTitulo")}</DialogTitle>
            <DialogDescription>
              {t("postulaciones.convertirTexto")}{" "}
              <strong>{convertDialog?.nombreProyecto}</strong> {t("common.of")}{" "}
              <strong>{convertDialog?.nombrePostulante}</strong>. {t("postulaciones.convertirTexto2")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertDialog(null)}>
              {t("common.cancelar")}
            </Button>
            <Button onClick={handleConvert} disabled={loading}>
              {loading ? t("common.creando") : t("common.confirmar")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
