"use client";

import { ithakaApi } from "@/src/api";
import {
  AppDispatch,
  RootState,
  clearSelectedProyecto,
  onLoadingProyecto,
  onProyectoError,
  onSetProyectos,
  onSetSelectedProyecto,
} from "@/src/store";
import type { Caso } from "@/src/types/caso";
import type { Estado } from "@/src/types/estado";
import axios from "axios";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const normalizeText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");

export const useProyectosStore = () => {
  const { status, proyectos, selectedProyecto, errorMessage } = useSelector(
    (state: RootState) => state.proyectos,
  );
  const dispatch: AppDispatch = useDispatch();

  const fetchProyectos = useCallback(
    async (skip = 0, limit = 100) => {
      dispatch(onLoadingProyecto());
      try {
        const { data } = await ithakaApi.get("/casos", {
          params: {
            tipo_caso: "proyecto",
            skip,
            limit,
          },
        });
        const casos: Caso[] = data?.casos ?? data ?? [];
        dispatch(onSetProyectos(casos));
      } catch (err) {
        let message = "Error al cargar los proyectos";
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message;
        }
        dispatch(onProyectoError(message));
      }
    },
    [dispatch],
  );

  const fetchProyecto = useCallback(
    async (id: number | string) => {
      dispatch(onLoadingProyecto());
      try {
        const idCaso = Number(id);
        const { data } = await ithakaApi.get("/casos/", {
          params: { tipo_caso: "proyecto" },
        });
        const casos: Caso[] = data?.casos ?? data ?? [];
        const found = casos.find((c) => c.id_caso === idCaso);
        if (found) {
          dispatch(onSetSelectedProyecto(found));
          dispatch(onSetProyectos(casos));
        } else {
          dispatch(onProyectoError("Proyecto no encontrado"));
        }
      } catch (err) {
        let message = "Error al cargar el proyecto";
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message;
        }
        dispatch(onProyectoError(message));
      }
    },
    [dispatch],
  );

  const setSelectedProyecto = useCallback(
    (proyecto: Caso) => {
      dispatch(onSetSelectedProyecto(proyecto));
    },
    [dispatch],
  );

  const updateProyectoEstado = useCallback(
    async (id: number | string, nombreEstado: string) => {
      try {
        const idCaso = String(id).trim();
        const estadoObjetivo = String(nombreEstado).trim();

        const [{ data: casoActual }, { data: estadosData }] = await Promise.all(
          [
            ithakaApi.get<Caso>(`/casos/${idCaso}`),
            ithakaApi.get<Estado[] | { estados: Estado[] }>("/estados"),
          ],
        );

        const estados = Array.isArray(estadosData)
          ? estadosData
          : (estadosData?.estados ?? []);

        const estadoMatch = estados.find(
          (estado) =>
            normalizeText(String(estado.nombre_estado ?? "")) ===
            normalizeText(estadoObjetivo),
        );

        if (!estadoMatch) {
          throw new Error(`Estado inválido: ${estadoObjetivo}`);
        }

        await ithakaApi.put(`/casos/${idCaso}`, {
          nombre_caso: casoActual.nombre_caso,
          descripcion: casoActual.descripcion ?? "",
          datos_chatbot: casoActual.datos_chatbot ?? {},
          id_emprendedor: casoActual.id_emprendedor,
          id_convocatoria: casoActual.id_convocatoria,
          id_estado: estadoMatch.id_estado,
        });
      } catch (err) {
        let message = "Error al cambiar el estado del proyecto";
        if (axios.isAxiosError(err)) {
          const detail = err.response?.data?.detail;
          const detailMessage = Array.isArray(detail)
            ? detail
                .map((item) => item?.msg)
                .filter(Boolean)
                .join(". ")
            : undefined;

          message =
            detailMessage ??
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message;
        } else if (err instanceof Error && err.message) {
          message = err.message;
        }
        dispatch(onProyectoError(message));
        throw err;
      }
    },
    [dispatch],
  );

  const resetProyecto = useCallback(() => {
    dispatch(clearSelectedProyecto());
  }, [dispatch]);

  return {
    status,
    proyectos,
    selectedProyecto,
    errorMessage,
    fetchProyectos,
    fetchProyecto,
    updateProyectoEstado,
    setSelectedProyecto,
    resetProyecto,
  };
};
