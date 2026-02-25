"use client"

import { useEffect, useState, useCallback } from "react"
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
import { Button } from "@/src/components/ui/button"
import { useRouter } from "next/navigation"
import { useI18n, getTipoPostulanteLabel, getEstadoPostulacionLabel, LOCALE_BY_LANG } from "@/src/lib/i18n"
import { casosService } from "@/src/services/casos.service"
import axios from "axios"

export function PostulacionesList() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [search, setSearch] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("all")
  const [filterFechaDesde, setFilterFechaDesde] = useState("")
  const [filterFechaHasta, setFilterFechaHasta] = useState("")
  const [filterConvocatoria, setFilterConvocatoria] = useState<string>("all")
  const [filterCompletitud, setFilterCompletitud] = useState<string>("all")
  const [loadingList, setLoadingList] = useState(false)
  const [errorList, setErrorList] = useState<string | null>(null)
  const router = useRouter()
  const { t, lang } = useI18n()

  const loadData = useCallback(async () => {
    setLoadingList(true)
    setErrorList(null)
    try {
      const data = await casosService.getPostulaciones(
        filterEstado === "all" ? undefined : filterEstado,
      )
      setPostulaciones(data)
    } catch (error) {
      setPostulaciones([])
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail
        setErrorList(
          typeof detail === "string"
            ? detail
            : "No se pudo cargar postulaciones desde el backend.",
        )
      } else {
        setErrorList("No se pudo cargar postulaciones desde el backend.")
      }
    } finally {
      setLoadingList(false)
    }
  }, [filterEstado])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filtered = postulaciones.filter((p) => {
    const matchSearch =
      p.nombreProyecto.toLowerCase().includes(search.toLowerCase()) ||
      p.nombrePostulante.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
    const created = new Date(p.creadoEn).getTime()
    const from = filterFechaDesde ? new Date(`${filterFechaDesde}T00:00:00`).getTime() : null
    const to = filterFechaHasta ? new Date(`${filterFechaHasta}T23:59:59`).getTime() : null
    const matchFecha = (from === null || created >= from) && (to === null || created <= to)
    const matchConvocatoria =
      filterConvocatoria === "all" || (p.convocatoria ?? "") === filterConvocatoria
    const matchCompletitud =
      filterCompletitud === "all" || (p.completitud ?? "incompleta") === filterCompletitud
    return matchSearch && matchFecha && matchConvocatoria && matchCompletitud
  })

  const convocatorias = Array.from(
    new Set(postulaciones.map((p) => p.convocatoria).filter(Boolean)),
  ) as string[]

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
            <Input
              type="date"
              value={filterFechaDesde}
              onChange={(e) => setFilterFechaDesde(e.target.value)}
              className="w-full sm:w-44"
            />
            <Input
              type="date"
              value={filterFechaHasta}
              onChange={(e) => setFilterFechaHasta(e.target.value)}
              className="w-full sm:w-44"
            />
            <Select value={filterConvocatoria} onValueChange={setFilterConvocatoria}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Convocatoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las convocatorias</SelectItem>
                {convocatorias.map((convocatoria) => (
                  <SelectItem key={convocatoria} value={convocatoria}>
                    {convocatoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCompletitud} onValueChange={setFilterCompletitud}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Completitud" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="completa">Completa</SelectItem>
                <SelectItem value="incompleta">Incompleta</SelectItem>
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
              {loadingList ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Cargando postulaciones...
                  </TableCell>
                </TableRow>
              ) : errorList ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-destructive">
                    {errorList}
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
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
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/postulaciones/${p.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          {t("postulaciones.verDetalle")}
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
