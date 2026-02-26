import { ithakaApi } from "@/src/api";
import type {
  ActualizarEstadoPayload,
  CrearEstadoPayload,
  Estado,
} from "@/src/types/estado";

type EstadosResponse = Estado[] | { estados: Estado[] };

const unpackEstados = (data: EstadosResponse): Estado[] =>
  Array.isArray(data) ? data : (data.estados ?? []);

export const estadosService = {
  async getAll() {
    const { data } = await ithakaApi.get<EstadosResponse>("/estados");
    return unpackEstados(data);
  },

  async getById(id: number | string) {
    const { data } = await ithakaApi.get<Estado>(
      `/estados/${encodeURIComponent(String(id))}`,
    );
    return data;
  },

  async create(payload: CrearEstadoPayload) {
    const { data } = await ithakaApi.post<Estado>("/estados", payload);
    return data;
  },

  async update(id: number | string, payload: ActualizarEstadoPayload) {
    const { data } = await ithakaApi.put<Estado>(
      `/estados/${encodeURIComponent(String(id))}`,
      payload,
    );
    return data;
  },

  async delete(id: number | string) {
    await ithakaApi.delete(`/estados/${encodeURIComponent(String(id))}`);
  },
};
