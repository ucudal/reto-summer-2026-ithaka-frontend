import ithakaApi from "@/src/api/api";

export interface CatalogoApoyoItem {
  id_catalogo_apoyo: number;
  nombre: string;
}

// DTOs para coincidir con el backend
export interface ApoyoBackendResponse {
  id_apoyo: number;
  id_catalogo_apoyo: number;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  id_caso: number;
  id_programa: number;
}

export interface CreateApoyoDTO {
  id_catalogo_apoyo: number;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  id_caso: number;
  id_programa: number;
}

export interface UpdateApoyoDTO {
  id_catalogo_apoyo?: number;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  id_caso?: number;
  id_programa?: number;
}

export interface Apoyo {
  id: string;
  idCatalogoApoyo: number;
  tipoApoyo?: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  idCaso: number;
  idPrograma: number;
}

function transformBackendToFrontend(backendApoyo: ApoyoBackendResponse): Apoyo {
  return {
    id: backendApoyo.id_apoyo.toString(),
    idCatalogoApoyo: backendApoyo.id_catalogo_apoyo,
    fechaInicio: backendApoyo.fecha_inicio,
    fechaFin: backendApoyo.fecha_fin,
    idCaso: backendApoyo.id_caso,
    idPrograma: backendApoyo.id_programa,
  };
}

export const apoyosService = {
  async getAll(): Promise<Apoyo[]> {
    const { data } = await ithakaApi.get<ApoyoBackendResponse[]>("/apoyos/");
    return data.map(transformBackendToFrontend);
  },

  async getCatalog(): Promise<CatalogoApoyoItem[]> {
    const { data } =
      await ithakaApi.get<CatalogoApoyoItem[]>("/catalogo_apoyos/");
    return data;
  },

  async getById(id: string): Promise<Apoyo> {
    const { data } = await ithakaApi.get<ApoyoBackendResponse>(`/apoyos/${id}`);
    return transformBackendToFrontend(data);
  },

  async getByCaso(idCaso: number): Promise<Apoyo[]> {
    const { data } = await ithakaApi.get<ApoyoBackendResponse[]>(
      `/apoyos/caso/${idCaso}`,
    );
    return data.map(transformBackendToFrontend);
  },

  async create(payload: CreateApoyoDTO) {
    const { data } = await ithakaApi.post<ApoyoBackendResponse>(
      "/apoyos/",
      payload,
    );
    return transformBackendToFrontend(data);
  },

  async update(id: string, payload: UpdateApoyoDTO) {
    const { data } = await ithakaApi.put<ApoyoBackendResponse>(
      `/apoyos/${id}`,
      payload,
    );
    return transformBackendToFrontend(data);
  },

  async delete(id: string) {
    await ithakaApi.delete(`/apoyos/${id}`);
  },
};
