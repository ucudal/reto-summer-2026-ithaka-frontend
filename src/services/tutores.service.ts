import ithakaApi from "@/src/api/api";
import { Tutor } from "../types/tutor";

export const tutoresService = {
  getAllUsuarios: async (): Promise<Tutor[]> => {
    const { data } = await ithakaApi.get('/usuarios'); 
    return data;
  },

  updateResponsable: async (id_caso: string | number, payload: { id_tutor: number | null, tutor: string }) => {
    const { data } = await ithakaApi.put(`/casos/${id_caso}`, payload);
    return data;
  }
};