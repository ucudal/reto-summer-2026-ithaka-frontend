import ithakaApi from "@/src/api/api";
import { Tutor } from "../types/tutor";

export const tutoresService = {
  getAllUsuarios: async (): Promise<Tutor[]> => {
    const { data } = await ithakaApi.get("/usuarios");
    return data;
  },

  createAsignacion: async (payload: {
    id_caso: number;
    id_usuario: number | null;
  }) => {
    const { data } = await ithakaApi.post("/asignaciones", payload);
    return data;
  },

  updateAsignacion: async (
    asignacionId: number,
    payload: { id_usuario: number | null },
  ) => {
    const { data } = await ithakaApi.put(
      `/asignaciones/${asignacionId}`,
      payload,
    );
    return data;
  },
};
