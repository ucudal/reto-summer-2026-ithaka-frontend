"use client";

import { estadosService } from "@/src/services/estados.service";
import {
  AppDispatch,
  RootState,
  clearSelectedEstado,
  onAddEstado,
  onDeleteEstado,
  onEstadosError,
  onLoadingEstados,
  onSetEstados,
  onSetSelectedEstado,
  onUpdateEstado,
} from "@/src/store";
import type {
  ActualizarEstadoPayload,
  CrearEstadoPayload,
  Estado,
} from "@/src/types/estado";
import axios from "axios";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const normalizeTipoCaso = (estado: Estado) =>
  String(estado.tipo_caso ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const useEstadosStore = () => {
  const { status, estados, selectedEstado, errorMessage } = useSelector(
    (state: RootState) => state.estados,
  );
  const dispatch: AppDispatch = useDispatch();

  const fetchEstados = useCallback(async () => {
    dispatch(onLoadingEstados());
    try {
      const data = await estadosService.getAll();
      dispatch(onSetEstados(data));
      return data;
    } catch (err) {
      let message = "Error al cargar los estados";
      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.detail ?? err.response?.data?.message ?? message;
      }
      dispatch(onEstadosError(message));
      throw err;
    }
  }, [dispatch]);

  const fetchEstadoById = useCallback(
    async (id: number | string) => {
      dispatch(onLoadingEstados());
      try {
        const data = await estadosService.getById(id);
        dispatch(onSetSelectedEstado(data));
        return data;
      } catch (err) {
        let message = "Error al cargar el estado";
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message;
        }
        dispatch(onEstadosError(message));
        throw err;
      }
    },
    [dispatch],
  );

  const createEstado = useCallback(
    async (payload: CrearEstadoPayload) => {
      dispatch(onLoadingEstados());
      try {
        const data = await estadosService.create(payload);
        dispatch(onAddEstado(data));
        return data;
      } catch (err) {
        let message = "Error al crear el estado";
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message;
        }
        dispatch(onEstadosError(message));
        throw err;
      }
    },
    [dispatch],
  );

  const updateEstado = useCallback(
    async (id: number | string, payload: ActualizarEstadoPayload) => {
      dispatch(onLoadingEstados());
      try {
        const data = await estadosService.update(id, payload);
        dispatch(onUpdateEstado(data));
        return data;
      } catch (err) {
        let message = "Error al actualizar el estado";
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message;
        }
        dispatch(onEstadosError(message));
        throw err;
      }
    },
    [dispatch],
  );

  const deleteEstado = useCallback(
    async (id: number | string) => {
      dispatch(onLoadingEstados());
      try {
        await estadosService.delete(id);
        dispatch(onDeleteEstado(Number(id)));
      } catch (err) {
        let message = "Error al eliminar el estado";
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message;
        }
        dispatch(onEstadosError(message));
        throw err;
      }
    },
    [dispatch],
  );

  const setSelectedEstado = useCallback(
    (estado: Estado | null) => {
      dispatch(onSetSelectedEstado(estado));
    },
    [dispatch],
  );

  const resetSelectedEstado = useCallback(() => {
    dispatch(clearSelectedEstado());
  }, [dispatch]);

  const estadosProyecto = estados.filter(
    (estado) => normalizeTipoCaso(estado) === "proyecto",
  );

  return {
    status,
    estados,
    estadosProyecto,
    selectedEstado,
    errorMessage,
    fetchEstados,
    fetchEstadoById,
    createEstado,
    updateEstado,
    deleteEstado,
    setSelectedEstado,
    resetSelectedEstado,
  };
};
