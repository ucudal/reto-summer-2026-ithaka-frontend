import { ithakaApi } from "@/src/api";
import axios from "axios";
import { casosService } from "./casos.service";

export interface Proyecto {
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

export interface ListarProyectosParams {
  skip?: number;
  limit?: number;
  id_estado?: number;
  nombre_estado?: string;
  id_emprendedor?: number;
}

export const proyectosService = {
  async listarProyectos(params?: ListarProyectosParams) {
    return await casosService.listarCasos({
      ...params,
      tipo_caso: "Proyecto",
    });
  },
};
