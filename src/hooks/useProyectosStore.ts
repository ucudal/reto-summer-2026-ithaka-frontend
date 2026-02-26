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
import axios from "axios";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

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
        const idCaso = String(id).trim();
        const { data } = await ithakaApi.get(
          `/casos/${encodeURIComponent(idCaso)}`,
        );
        dispatch(onSetSelectedProyecto(data?.caso ?? data));
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
        console.log("Updating proyecto estado:", { idCaso, nombreEstado });
        await ithakaApi.put(`/casos/${idCaso}/cambiar_estado`, null, {
          params: {
            nombre_estado: nombreEstado,
            tipo_caso: "proyecto",
          },
        });
      } catch (err) {
        let message = "Error al cambiar el estado del proyecto";
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message;
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
