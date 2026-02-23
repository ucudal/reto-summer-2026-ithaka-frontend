"use client";

import {
  ListarProyectosParams,
  Proyecto,
  proyectosService,
} from "@/src/services/proyectos.service";
import { useCallback, useState } from "react";

interface UseProyectosState {
  proyectos: Proyecto[];
  loading: boolean;
  error: string | null;
}

export const useProyectos = () => {
  const [state, setState] = useState<UseProyectosState>({
    proyectos: [],
    loading: false,
    error: null,
  });

  // Obtener todos los proyectos
  const obtenerTodosProyectos = useCallback(
    async (skip?: number, limit?: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const proyectos = await proyectosService.listarProyectos({
          skip: skip ?? 0,
          limit: limit ?? 100,
        });
        setState((prev) => ({ ...prev, proyectos, loading: false }));
        return proyectos;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error desconocido";
        setState((prev) => ({ ...prev, error: message, loading: false }));
        throw err;
      }
    },
    [],
  );

  // Obtener proyectos por estado
  const obtenerPorEstado = useCallback(
    async (nombre_estado: string, skip?: number, limit?: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const proyectos = await proyectosService.listarProyectos({
          skip: skip ?? 0,
          limit: limit ?? 100,
          nombre_estado,
        });
        setState((prev) => ({ ...prev, proyectos, loading: false }));
        return proyectos;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error desconocido";
        setState((prev) => ({ ...prev, error: message, loading: false }));
        throw err;
      }
    },
    [],
  );

  // Obtener proyectos por emprendedor
  const obtenerPorEmprendedor = useCallback(
    async (id_emprendedor: number, skip?: number, limit?: number) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const proyectos = await proyectosService.listarProyectos({
          skip: skip ?? 0,
          limit: limit ?? 100,
          id_emprendedor,
        });
        setState((prev) => ({ ...prev, proyectos, loading: false }));
        return proyectos;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error desconocido";
        setState((prev) => ({ ...prev, error: message, loading: false }));
        throw err;
      }
    },
    [],
  );

  // Obtener proyectos con filtros personalizados
  const obtenerConFiltros = useCallback(
    async (params: ListarProyectosParams) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const proyectos = await proyectosService.listarProyectos(params);
        setState((prev) => ({ ...prev, proyectos, loading: false }));
        return proyectos;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error desconocido";
        setState((prev) => ({ ...prev, error: message, loading: false }));
        throw err;
      }
    },
    [],
  );

  // Limpiar estado de error
  const limpiarError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // Estado
    proyectos: state.proyectos,
    loading: state.loading,
    error: state.error,

    // Métodos
    obtenerTodosProyectos,
    obtenerPorEstado,
    obtenerPorEmprendedor,
    obtenerConFiltros,
    limpiarError,
  };
};
