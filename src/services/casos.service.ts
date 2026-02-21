import { ithakaApi } from "@/src/api";
import axios from "axios";

export interface Caso {
  id_caso: number;
  nombre_caso: string;
  descripcion: string;
  fecha_creacion: string;
  estado: string | null;
  emprendedor: string | null;
  convocatoria: string | null;
  consentimiento_datos: boolean;
  datos_chatbot: boolean;
  tutor: string | null;
}

export interface ListarCasosParams {
  skip?: number;
  limit?: number;
  id_estado?: number;
  tipo_caso?: string;
  nombre_estado?: string;
  id_emprendedor?: number;
}

export const casosService = {
  async listarCasos(params?: ListarCasosParams) {
    try {
      const response = await ithakaApi.get<{ casos: Caso[] }>("/casos", {
        params: {
          skip: params?.skip ?? 0,
          limit: params?.limit ?? 100,
          id_estado: params?.id_estado,
          tipo_caso: params?.tipo_caso,
          nombre_estado: params?.nombre_estado,
          id_emprendedor: params?.id_emprendedor,
        },
      });
      console.log("Casos obtenidos:", response.data.casos);
      return response.data.casos;
    } catch (err) {
      let message = "Error al listar casos";

      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.meta?.message ??
          err.response?.data?.message ??
          message;
      } else if (err instanceof Error) {
        message = err.message || message;
      }

      throw new Error(message);
    }
  },
};
