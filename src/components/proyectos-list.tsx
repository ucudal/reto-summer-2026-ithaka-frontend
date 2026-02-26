"use client";

import { StatusBadge } from "@/src/components/status-badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  getEstadoProyectoLabel,
  getTipoPostulanteLabel,
  useI18n,
} from "@/src/lib/i18n";
import { useProyectosStore } from "@/src/hooks";
import { Eye, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ProyectosList() {
  const {
    status,
    proyectos,
    errorMessage,
    fetchProyectos,
    setSelectedProyecto,
  } = useProyectosStore();
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const { t, lang } = useI18n();

  useEffect(() => {
    fetchProyectos();
  }, [fetchProyectos]);

  const filtered = proyectos.filter((p) => {
    console.log("Evaluando proyecto:", p);
    const matchSearch =
      p.nombre_caso.toLowerCase().includes(search.toLowerCase()) ||
      (p.emprendedor?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
      p.id_caso == Number(search);
    const matchEstado = filterEstado === "all" || p.nombre_estado === filterEstado;
    const tipoPostulante =
      String((p as { tipo_postulante?: string }).tipo_postulante ?? "").toLowerCase();
    const matchTipo = filterTipo === "all" || tipoPostulante === filterTipo;
    return matchSearch && matchEstado && matchTipo;
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {t("proyectos.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("proyectos.subtitle")}
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("proyectos.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder={t("postulaciones.estado")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("postulaciones.todosEstados")}
                </SelectItem>
                <SelectItem value="recibida">
                  {getEstadoProyectoLabel(lang, "recibida")}
                </SelectItem>
                <SelectItem value="en_evaluacion">
                  {getEstadoProyectoLabel(lang, "en_evaluacion")}
                </SelectItem>
                <SelectItem value="proyecto_activo">
                  {getEstadoProyectoLabel(lang, "proyecto_activo")}
                </SelectItem>
                <SelectItem value="incubado">
                  {getEstadoProyectoLabel(lang, "incubado")}
                </SelectItem>
                <SelectItem value="cerrado">
                  {getEstadoProyectoLabel(lang, "cerrado")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("postulaciones.tipoPostulante")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("postulaciones.todosTipos")}
                </SelectItem>
                <SelectItem value="estudiante_ucu">
                  {getTipoPostulanteLabel(lang, "estudiante_ucu")}
                </SelectItem>
                <SelectItem value="alumni">
                  {getTipoPostulanteLabel(lang, "alumni")}
                </SelectItem>
                <SelectItem value="docente_funcionario">
                  {getTipoPostulanteLabel(lang, "docente_funcionario")}
                </SelectItem>
                <SelectItem value="externo">
                  {getTipoPostulanteLabel(lang, "externo")}
                </SelectItem>
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
                <TableHead>{t("postulaciones.estado")}</TableHead>
                <TableHead>{t("proyectos.responsable")}</TableHead>             
                <TableHead className="text-right">
                  {t("postulaciones.acciones")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {status === "loading" ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t("proyectoDetail.loading")}
                  </TableCell>
                </TableRow>
              ) : status === "error" ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-destructive">
                    {errorMessage || t("proyectos.noResults")}
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {t("proyectos.noResults")}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id_caso}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {p.id_caso}
                    </TableCell>
                    <TableCell className="font-medium">
                      {p.nombre_caso}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{p.emprendedor}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.nombre_estado ?? ""} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {p.tutor || (
                          <span className="text-muted-foreground italic">
                            {t("proyectos.sinAsignar")}
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/proyectos/${p.id_caso}`}
                        onClick={() => setSelectedProyecto(p)}
                      >
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          {t("proyectos.verDetalle")}
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
  );
}
