"use client";

import {
  addApoyo,
  addHito,
  getAuditForEntity,
  saveEvaluacion,
  toggleApoyoEstado,
  toggleHito,
  updateProyectoEstado,
  updateProyectoResponsable,
} from "@/src/app/actions";
import { StatusBadge } from "@/src/components/status-badge";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Textarea } from "@/src/components/ui/textarea";
import { useProyectosStore } from "@/src/hooks";
import type {
  AuditEntry,
  EstadoProyecto,
  Proyecto,
  TipoApoyo,
} from "@/src/lib/data";
import { RESPONSABLES_ITHAKA } from "@/src/lib/data";
import {
  getEstadoProyectoLabel,
  getEtapaLabel,
  getPotencialLabel,
  getTipoApoyoLabel,
  LOCALE_BY_LANG,
  useI18n,
} from "@/src/lib/i18n";
import type { Caso } from "@/src/types/caso";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  History,
  Mail,
  Plus,
  User,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export function ProyectoDetail({ id }: { id: string }) {
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [newHito, setNewHito] = useState("");
  const [nuevoApoyo, setNuevoApoyo] = useState<TipoApoyo | "">("");
  const [evalForm, setEvalForm] = useState({
    etapaEmprendimiento: "",
    potencialIncubacion: "" as "alto" | "medio" | "bajo" | "",
    pertenenciaUCU: false,
    notas: "",
  });
  const { t, lang } = useI18n();
  const { status, selectedProyecto, errorMessage, fetchProyecto } =
    useProyectosStore();

  const mapEstadoProyecto = (nombreEstado: string | null): EstadoProyecto => {
    const normalized = (nombreEstado ?? "").toLowerCase().replace(/\s+/g, "_");
    if (
      normalized === "recibida" ||
      normalized === "en_evaluacion" ||
      normalized === "proyecto_activo" ||
      normalized === "incubado" ||
      normalized === "cerrado"
    ) {
      return normalized;
    }
    return "recibida";
  };

  const mapCasoToProyecto = (caso: Caso): Proyecto => ({
    id: String(caso.id_caso),
    postulacionId: String(caso.id_caso),
    nombreProyecto: caso.nombre_caso,
    nombrePostulante: caso.emprendedor ?? "-",
    email: "-",
    tipoPostulante: "externo",
    descripcion: caso.descripcion ?? "-",
    estado: mapEstadoProyecto(caso.nombre_estado ?? null),
    responsableIthaka: caso.tutor ?? "",
    apoyos: [],
    hitos: [],
    creadoEn: caso.fecha_creacion,
    actualizadoEn: caso.fecha_creacion,
  });

  const isSelectedForCurrentId =
    selectedProyecto && String(selectedProyecto.id_caso) === String(id);

  const proyecto = isSelectedForCurrentId
    ? mapCasoToProyecto(selectedProyecto)
    : null;

  const loadData = useCallback(async () => {
    const [a] = await Promise.all([getAuditForEntity(id), fetchProyecto(id)]);
    setAudit(a);
  }, [id, fetchProyecto]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (status === "loading" || !proyecto) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-muted-foreground">
          {errorMessage || t("proyectoDetail.loading")}
        </p>
      </div>
    );
  }

  async function handleEstadoChange(estado: EstadoProyecto) {
    await updateProyectoEstado(id, estado);
    loadData();
  }

  async function handleResponsableChange(responsable: string) {
    await updateProyectoResponsable(id, responsable);
    loadData();
  }

  async function handleAddApoyo() {
    if (!nuevoApoyo) return;
    await addApoyo(id, nuevoApoyo);
    setNuevoApoyo("");
    loadData();
  }

  async function handleToggleApoyo(apoyoId: string) {
    await toggleApoyoEstado(id, apoyoId);
    loadData();
  }

  async function handleAddHito() {
    if (!newHito.trim()) return;
    await addHito(id, newHito.trim());
    setNewHito("");
    loadData();
  }

  async function handleToggleHito(hitoId: string) {
    await toggleHito(id, hitoId);
    loadData();
  }

  async function handleSaveEvaluacion() {
    if (!evalForm.potencialIncubacion || !evalForm.etapaEmprendimiento) return;
    await saveEvaluacion(id, {
      etapaEmprendimiento: evalForm.etapaEmprendimiento,
      potencialIncubacion: evalForm.potencialIncubacion as
        | "alto"
        | "medio"
        | "bajo",
      pertenenciaUCU: evalForm.pertenenciaUCU,
      notas: evalForm.notas,
    });
    loadData();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(LOCALE_BY_LANG[lang], {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/proyectos"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("proyectoDetail.back")}
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{proyecto.nombreProyecto}</h1>
              <StatusBadge status={proyecto.estado} />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {proyecto.id} | {t("proyectoDetail.postulacion")}:{" "}
              {proyecto.postulacionId}
            </p>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("proyectoDetail.postulante")}
              </p>
              <p className="text-sm font-medium">{proyecto.nombrePostulante}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("login.email")}
              </p>
              <p className="text-sm font-medium">{proyecto.email}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {t("proyectoDetail.creado")}
              </p>
              <p className="text-sm font-medium">
                {formatDate(proyecto.creadoEn)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">
            {t("proyectoDetail.descripcion")}
          </p>
          <p className="text-sm leading-relaxed">{proyecto.descripcion}</p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="gestion" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gestion">
            {t("proyectoDetail.gestion")}
          </TabsTrigger>
          <TabsTrigger value="apoyos">
            {t("proyectoDetail.apoyos")} ({proyecto.apoyos.length})
          </TabsTrigger>
          <TabsTrigger value="hitos">
            {t("proyectoDetail.hitos")} ({proyecto.hitos.length})
          </TabsTrigger>
          <TabsTrigger value="evaluacion">
            {t("proyectoDetail.evaluacion")}
          </TabsTrigger>
          <TabsTrigger value="auditoria">
            {t("proyectoDetail.auditoria")}
          </TabsTrigger>
        </TabsList>

        {/* Tab: Gestion */}
        <TabsContent value="gestion">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t("proyectoDetail.estadoTitle")}
                </CardTitle>
                <CardDescription>
                  {t("proyectoDetail.estadoDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={proyecto.estado}
                  onValueChange={(v) => handleEstadoChange(v as EstadoProyecto)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        "recibida",
                        "en_evaluacion",
                        "proyecto_activo",
                        "incubado",
                        "cerrado",
                      ] as const
                    ).map((key) => (
                      <SelectItem key={key} value={key}>
                        {getEstadoProyectoLabel(lang, key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t("proyectoDetail.responsableTitle")}
                </CardTitle>
                <CardDescription>
                  {t("proyectoDetail.responsableDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={proyecto.responsableIthaka || "sin_asignar"}
                  onValueChange={(v) =>
                    handleResponsableChange(v === "sin_asignar" ? "" : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("proyectoDetail.selectResponsable")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sin_asignar">
                      {t("proyectoDetail.sinAsignar")}
                    </SelectItem>
                    {RESPONSABLES_ITHAKA.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Apoyos */}
        <TabsContent value="apoyos">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("proyectoDetail.apoyosTitle")}
              </CardTitle>
              <CardDescription>
                {t("proyectoDetail.apoyosDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add apoyo */}
              <div className="flex items-center gap-2 mb-4">
                <Select
                  value={nuevoApoyo}
                  onValueChange={(v) => setNuevoApoyo(v as TipoApoyo)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t("proyectoDetail.tipoApoyo")} />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        "validalab",
                        "eolo",
                        "mentoria",
                        "tfg",
                        "incubadora_ulises",
                      ] as const
                    ).map((key) => (
                      <SelectItem key={key} value={key}>
                        {getTipoApoyoLabel(lang, key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleAddApoyo}
                  disabled={!nuevoApoyo}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t("proyectoDetail.agregarApoyo")}
                </Button>
              </div>

              {/* List */}
              {proyecto.apoyos.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {t("proyectoDetail.sinApoyos")}
                </p>
              ) : (
                <div className="space-y-2">
                  {proyecto.apoyos.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">
                          {getTipoApoyoLabel(lang, a.tipo)}
                        </Badge>
                        <StatusBadge status={a.estado} />
                        <span className="text-xs text-muted-foreground">
                          {t("proyectoDetail.desde")}:{" "}
                          {new Date(a.fechaInicio).toLocaleDateString(
                            LOCALE_BY_LANG[lang],
                          )}
                          {a.fechaFin &&
                            ` - ${t("proyectoDetail.hasta")}: ${new Date(
                              a.fechaFin,
                            ).toLocaleDateString(LOCALE_BY_LANG[lang])}`}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleApoyo(a.id)}
                      >
                        {a.estado === "activo"
                          ? t("proyectoDetail.finalizar")
                          : t("proyectoDetail.reactivar")}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Hitos */}
        <TabsContent value="hitos">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("proyectoDetail.hitosTitle")}
              </CardTitle>
              <CardDescription>{t("proyectoDetail.hitosDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add hito */}
              <div className="flex items-center gap-2 mb-4">
                <Input
                  placeholder={t("proyectoDetail.nuevoHito")}
                  value={newHito}
                  onChange={(e) => setNewHito(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddHito()}
                />
                <Button
                  size="sm"
                  onClick={handleAddHito}
                  disabled={!newHito.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t("proyectoDetail.agregar")}
                </Button>
              </div>

              {proyecto.hitos.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {t("proyectoDetail.sinHitos")}
                </p>
              ) : (
                <div className="space-y-2">
                  {proyecto.hitos.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleToggleHito(h.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleToggleHito(h.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      {h.completado ? (
                        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          h.completado
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {h.titulo}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Evaluacion */}
        <TabsContent value="evaluacion">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("proyectoDetail.evaluacionTitle")}
              </CardTitle>
              <CardDescription>
                {t("proyectoDetail.evaluacionDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("proyectoDetail.etapa")}</Label>
                  <Select
                    value={evalForm.etapaEmprendimiento}
                    onValueChange={(v) =>
                      setEvalForm((f) => ({
                        ...f,
                        etapaEmprendimiento: v,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("proyectoDetail.seleccionarEtapa")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        [
                          "Ideacion",
                          "Validacion",
                          "Traccion",
                          "Escalamiento",
                          "Consolidacion",
                        ] as const
                      ).map((key) => (
                        <SelectItem key={key} value={key}>
                          {getEtapaLabel(lang, key)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("proyectoDetail.potencial")}</Label>
                  <Select
                    value={evalForm.potencialIncubacion}
                    onValueChange={(v) =>
                      setEvalForm((f) => ({
                        ...f,
                        potencialIncubacion: v as "alto" | "medio" | "bajo",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("proyectoDetail.seleccionarPotencial")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alto">
                        {getPotencialLabel(lang, "alto")}
                      </SelectItem>
                      <SelectItem value="medio">
                        {getPotencialLabel(lang, "medio")}
                      </SelectItem>
                      <SelectItem value="bajo">
                        {getPotencialLabel(lang, "bajo")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Checkbox
                  id="pertenenciaUCU"
                  checked={evalForm.pertenenciaUCU}
                  onCheckedChange={(v) =>
                    setEvalForm((f) => ({
                      ...f,
                      pertenenciaUCU: v === true,
                    }))
                  }
                />
                <Label htmlFor="pertenenciaUCU">
                  {t("proyectoDetail.pertenencia")}
                </Label>
              </div>
              <div className="mt-4 space-y-2">
                <Label>{t("proyectoDetail.notas")}</Label>
                <Textarea
                  value={evalForm.notas}
                  onChange={(e) =>
                    setEvalForm((f) => ({ ...f, notas: e.target.value }))
                  }
                  placeholder={t("proyectoDetail.notasPlaceholder")}
                  rows={4}
                />
              </div>
              <Button
                className="mt-4"
                onClick={handleSaveEvaluacion}
                disabled={
                  !evalForm.etapaEmprendimiento || !evalForm.potencialIncubacion
                }
              >
                {proyecto.evaluacion
                  ? t("proyectoDetail.actualizarEval")
                  : t("proyectoDetail.guardarEval")}
              </Button>
              {proyecto.evaluacion && (
                <p className="text-xs text-muted-foreground mt-2">
                  {t("proyectoDetail.ultimaActualizacion")}:{" "}
                  {formatDate(proyecto.evaluacion.actualizadoEn)}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Auditoria */}
        <TabsContent value="auditoria">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("proyectoDetail.auditoriaTitle")}
              </CardTitle>
              <CardDescription>
                {t("proyectoDetail.auditoriaDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {audit.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {t("proyectoDetail.sinAuditoria")}
                </p>
              ) : (
                <div className="space-y-3">
                  {audit.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start gap-3 border-l-2 border-primary/20 pl-4 py-1"
                    >
                      <History className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{a.accion}</span>
                          {" - "}
                          <span className="text-muted-foreground">
                            {a.detalle}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("proyectoDetail.por")} {a.usuario}{" "}
                          {t("proyectoDetail.el")} {formatDate(a.fecha)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
