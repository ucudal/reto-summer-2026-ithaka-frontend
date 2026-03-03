"use client";

import { ithakaApi } from "@/src/api";
import {
  AppDispatch,
  RootState,
  clearSelectedPostulacion,
  onLoadingPostulacion,
  onPostulacionError,
  onSetSelectedPostulacion,
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

export const usePostulacionesStore = () => {
  const { status, selectedPostulacion, errorMessage } = useSelector(
    (state: RootState) => state.postulaciones,
  );
  const dispatch: AppDispatch = useDispatch();

  const fetchPostulacion = useCallback(
    async (id: number) => {
      dispatch(onLoadingPostulacion());
      try {
        const { data } = await ithakaApi.get("/casos/", {
          params: { tipo_caso: "postulacion" },
        });
        const casos: Caso[] = data?.casos ?? data ?? [];
        const found = casos.find((c) => c.id_caso === id);
        if (found) {
          dispatch(onSetSelectedPostulacion(found));
        } else {
          dispatch(onPostulacionError("Postulación no encontrada"));
        }
      } catch (err) {
        let message = "Error al cargar la postulación";
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message;
        }
        dispatch(onPostulacionError(message));
      }
    },
    [dispatch],
  );

  const resetPostulacion = useCallback(
    () => dispatch(clearSelectedPostulacion()),
    [dispatch],
  );

  const updatePostulacionEstado = useCallback(
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
        let message = "Error al cambiar el estado de la postulación";
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
        dispatch(onPostulacionError(message));
        throw err;
      }
    },
    [dispatch],
  );

  return {
    status,
    selectedPostulacion,
    errorMessage,
    fetchPostulacion,
    updatePostulacionEstado,
    resetPostulacion,
  };
};
