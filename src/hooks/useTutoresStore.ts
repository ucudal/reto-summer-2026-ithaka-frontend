"use client";

import { tutoresService } from "@/src/services/tutores.service";
import { useCallback, useState } from "react";
import axios from "axios";
import { Tutor } from "../types/tutor";

const normalizeRol = (rol: string) =>
  String(rol ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const useTutoresStore = () => {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTutores = useCallback(async () => {
    setLoading(true);
    try {
        const allUsuarios = await tutoresService.getAllUsuarios();
        console.log("Todos los usuarios:", allUsuarios); 
        const filtrados = allUsuarios.filter(
        (u) => u.id_rol === 3
        );
        
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
    async (id_caso: string | number, id_tutor: string | number, nombre_tutor: string) => {
      setLoading(true);
      try {
        const payload = {
          id_tutor: id_tutor === "sin_asignar" ? null : Number(id_tutor),
          tutor: nombre_tutor
        };
        const data = await tutoresService.updateResponsable(id_caso, payload);
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
    []
  );

  return {
    tutores,
    loading,
    fetchTutores,
    updateResponsable,
  };
};