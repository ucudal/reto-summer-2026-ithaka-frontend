"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  AppDispatch,
  RootState,
  onLoadingApoyos,
  onSetApoyos,
  onSetCatalogo,
  onAddApoyo,
  onDeleteApoyo,
  onApoyosError,
  clearApoyos,
} from "@/src/store";
import {
  apoyosService,
  type CreateApoyoDTO,
} from "@/src/services/apoyos.service";

export const useApoyosStore = () => {
  const { status, apoyos, catalogo, errorMessage } = useSelector(
    (state: RootState) => state.apoyos,
  );
  const dispatch: AppDispatch = useDispatch();

  const fetchApoyos = useCallback(async () => {
    dispatch(onLoadingApoyos());
    try {
      const [apoyosData, catalogoData] = await Promise.all([
        apoyosService.getAll(),
        apoyosService.getCatalog(),
      ]);
      const enriched = apoyosData.map((a) => ({
        ...a,
        tipoApoyo: catalogoData.find(
          (c) => c.id_catalogo_apoyo === a.idCatalogoApoyo,
        )?.nombre,
      }));
      dispatch(onSetCatalogo(catalogoData));
      dispatch(onSetApoyos(enriched));
    } catch (err) {
      let message = "Error al cargar los apoyos";
      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.detail ?? err.response?.data?.message ?? message;
      }
      dispatch(onApoyosError(message));
    }
  }, [dispatch]);

  const createApoyo = useCallback(
    async (payload: CreateApoyoDTO) => {
      try {
        const created = await apoyosService.create(payload);
        const nombre = catalogo.find(
          (c) => c.id_catalogo_apoyo === payload.id_catalogo_apoyo,
        )?.nombre;
        dispatch(onAddApoyo({ ...created, tipoApoyo: nombre }));
        return created;
      } catch (err) {
        let message = "Error al crear el apoyo";
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message;
        }
        dispatch(onApoyosError(message));
        throw err;
      }
    },
    [dispatch, catalogo],
  );

  const deleteApoyo = useCallback(
    async (id: string) => {
      try {
        await apoyosService.delete(id);
        dispatch(onDeleteApoyo(id));
      } catch (err) {
        let message = "Error al eliminar el apoyo";
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message;
        }
        dispatch(onApoyosError(message));
        throw err;
      }
    },
    [dispatch],
  );

  const resetApoyos = useCallback(() => dispatch(clearApoyos()), [dispatch]);

  return {
    status,
    apoyos,
    catalogo,
    errorMessage,
    fetchApoyos,
    createApoyo,
    deleteApoyo,
    resetApoyos,
  };
};
