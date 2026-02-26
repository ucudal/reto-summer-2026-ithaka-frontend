"use client";

import { tutoresService } from "@/src/services/tutores.service";
import axios from "axios";
import { useCallback, useState } from "react";
import { Tutor } from "../types/tutor";

export const useTutoresStore = () => {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTutores = useCallback(async () => {
    setLoading(true);
    try {
      const allUsuarios = await tutoresService.getAllUsuarios();
      console.log("Todos los usuarios:", allUsuarios);
      const filtrados = allUsuarios.filter((u) => u.id_rol === 3);

      console.log("Filtrados:", filtrados);
      setTutores(filtrados);
      return filtrados;
    } catch (err) {
      console.error("Error al cargar tutores:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResponsable = useCallback(
    async (
      id_caso: string | number,
      id_tutor: string | number,
      asignacionId?: number | null,
    ) => {
      setLoading(true);
      try {
        const idUsuario = id_tutor === "sin_asignar" ? null : Number(id_tutor);
        const casoId = Number(id_caso);

        if (!Number.isFinite(casoId)) {
          throw new Error("ID de caso inválido");
        }

        const data =
          typeof asignacionId === "number" && Number.isFinite(asignacionId)
            ? await tutoresService.updateAsignacion(asignacionId, {
                id_usuario: idUsuario,
              })
            : await tutoresService.createAsignacion({
                id_caso: casoId,
                id_usuario: idUsuario,
              });

        return data;
      } catch (err) {
        let message = "Error al actualizar responsable";
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.detail ?? message;
        }
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    tutores,
    loading,
    fetchTutores,
    updateResponsable,
  };
};
