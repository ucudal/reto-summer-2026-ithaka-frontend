"use client";

import { StatusBadge } from "@/src/components/status-badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useEstadosStore, useProyectosStore } from "@/src/hooks";
import type { Proyecto } from "@/src/lib/data";
import { LOCALE_BY_LANG, useI18n } from "@/src/lib/i18n";
import type { Caso } from "@/src/types/caso";
import { ArrowLeft, Clock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "../hooks/use-toast";
import { useTutoresStore } from "../hooks/useTutoresStore";

export function ProyectoDetail({ id }: { id: string }) {
  type ProyectoView = Omit<Proyecto, "estado"> & {
    estado: string;
    responsableId?: string;
    asignacionId?: number | null;
  };

  const { updateResponsable, fetchTutores, tutores } = useTutoresStore();
  const [responsableSeleccionado, setResponsableSeleccionado] = useState("");
  const [pendingEstado, setPendingEstado] = useState("");
  const [savingEstado, setSavingEstado] = useState(false);
  const { t, lang } = useI18n();
  const {
    status,
    selectedProyecto,
    errorMessage,
    fetchProyecto,
    fetchProyectos,
    updateProyectoEstado,
  } = useProyectosStore();
  const { estadosProyecto, fetchEstados } = useEstadosStore();

  const estadoOptions = estadosProyecto
    .map((estado) => {
      const rawName = String(estado.nombre_estado ?? "").trim();
      return {
        value: rawName,
        label: rawName,
      };
    })
    .filter((estado) => Boolean(estado.value))
    .filter(
      (estado, index, array) =>
        array.findIndex((item) => item.value === estado.value) === index,
    );

  const mapCasoToProyecto = (caso: Caso): ProyectoView => ({
    id: String(caso.id_caso),
    postulacionId: String(caso.id_caso),
    nombreProyecto: caso.nombre_caso,
    nombrePostulante: caso.emprendedor ?? "-",
    email: "-",
    tipoPostulante: "externo",
    descripcion: caso.descripcion ?? "-",
    estado: String(caso.nombre_estado ?? "").trim(),
    responsableIthaka:
      caso.tutor_nombre && caso.tutor_nombre !== "Sin asignar"
        ? caso.tutor_nombre
        : "Sin asignar",
    responsableId:
      caso.id_tutor && typeof caso.id_tutor === "number"
        ? String(caso.id_tutor)
        : "sin_asignar",
    asignacionId: typeof caso.asignacion === "number" ? caso.asignacion : null,
    apoyos: [],
    hitos: [],
    evaluacion: undefined,
    creadoEn: caso.fecha_creacion,
    actualizadoEn: caso.fecha_creacion,
  });

  const isSelectedForCurrentId =
    selectedProyecto && String(selectedProyecto.id_caso) === String(id);

  const proyecto = isSelectedForCurrentId
    ? mapCasoToProyecto(selectedProyecto)
    : null;

  useEffect(() => {
    fetchProyecto(id);
  }, [fetchProyecto, id]);

  useEffect(() => {
    fetchTutores();
  }, [fetchTutores]);

  useEffect(() => {
    fetchEstados();
  }, [fetchEstados]);

  useEffect(() => {
    if (proyecto) {
      setResponsableSeleccionado(
        proyecto.responsableId && proyecto.responsableId !== ""
          ? proyecto.responsableId
          : "sin_asignar",
      );
    }
  }, [proyecto?.responsableId]);

  useEffect(() => {
    if (proyecto?.estado) {
      setPendingEstado(proyecto.estado);
    }
  }, [proyecto?.estado]);

  if (status === "loading" || !proyecto) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-muted-foreground">
          {errorMessage || t("proyectoDetail.loading")}
        </p>
      </div>
    );
  }

  function handleEstadoChange(estado: string) {
    if (!estado) return;
    setPendingEstado(estado);
  }

  async function saveResponsableChange(newResponsableId: string) {
    await updateResponsable(
      id,
      newResponsableId,
      proyecto?.asignacionId ?? null,
    );
  }

  async function handleGuardarCambios() {
    const willChangeEstado =
      pendingEstado && pendingEstado !== proyecto?.estado;
    const willChangeResponsable =
      responsableSeleccionado !== proyecto?.responsableId;

    if (!willChangeEstado && !willChangeResponsable) return;

    try {
      setSavingEstado(true);

      if (willChangeEstado) {
        await updateProyectoEstado(id, pendingEstado);
      }

      if (willChangeResponsable) {
        await saveResponsableChange(responsableSeleccionado);
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      await fetchProyectos();
      await fetchProyecto(id);

      toast({ title: "Cambios guardados" });
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      toast({ title: "Error al guardar", variant: "destructive" });
    } finally {
      setSavingEstado(false);
    }
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
          <Button
            onClick={handleGuardarCambios}
            disabled={
              savingEstado ||
              ((!pendingEstado || pendingEstado === proyecto.estado) &&
                responsableSeleccionado === proyecto.responsableId)
            }
          >
            {savingEstado ? t("common.loading") : "Guardar cambios"}
          </Button>
        </div>
      </div>

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

      <Card className="mb-6">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">
            {t("proyectoDetail.descripcion")}
          </p>
          <p className="text-sm leading-relaxed">{proyecto.descripcion}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("proyectoDetail.estadoTitle")}
            </CardTitle>
            <CardDescription>{t("proyectoDetail.estadoDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={pendingEstado || proyecto.estado}
              onValueChange={handleEstadoChange}
            >
              <SelectTrigger disabled={estadoOptions.length === 0}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {estadoOptions.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
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
              value={responsableSeleccionado || "sin_asignar"}
              onValueChange={setResponsableSeleccionado}
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
                {tutores.map((tutor) => (
                  <SelectItem
                    key={tutor.id_usuario}
                    value={String(tutor.id_usuario)}
                  >
                    {tutor.nombre} {tutor.apellido}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
