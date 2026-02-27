import ithakaApi from "@/src/api/api"

// Catálogo de tipos de apoyo (según el backend)
export const TIPOS_APOYO = [
  "Ningún apoyo adicional (No UCU y no valor estratégico)",
  "IPE Postulación VIN ANII/ANDE",
  "IPE Postulación Semilla ANDE",
  "IPE Emprendedores innovadores ANII",
  "Otros Financiamientos",
  "Programa de incubación general",
  "Cursos de Uruguay Emprendedor",
  "Valida Lab UCU",
  "Mentoría / Tutoría",
  "Ingreso al catálogo de emprendimientos",
  "Acceso a laboratorios (Industrial, Alimentos Química, electrónica, IoT)",
  "Club de beneficios",
  "Centro Ignis (Industrias creativas)",
  "Comunidad UCU",
  "Actividades de Networking",
  "Tema para retos FIT",
  "Becario/s",
  "Sesión de IA (investigación mercado, estrategias, etc)",
  "Otras",
]

// DTOs para coincidir con el backend
export interface ApoyoBackendResponse {
  id_apoyo: number
  tipo_apoyo: string
  fecha_inicio: string | null
  fecha_fin: string | null
  id_caso: number
  id_programa: number
}

export interface CreateApoyoDTO {
  tipo_apoyo: string
  fecha_inicio?: string | null
  fecha_fin?: string | null
  id_caso: number
  id_programa: number
}

export interface UpdateApoyoDTO {
  tipo_apoyo?: string
  fecha_inicio?: string | null
  fecha_fin?: string | null
  id_caso?: number
  id_programa?: number
}

export interface Apoyo {
  id: string
  tipoApoyo: string
  fechaInicio: string | null
  fechaFin: string | null
  idCaso: number
  idPrograma: number
  nombreCaso?: string
  nombrePrograma?: string
}

// Transformar respuesta del backend al formato del frontend
function transformBackendToFrontend(backendApoyo: ApoyoBackendResponse): Apoyo {
  return {
    id: backendApoyo.id_apoyo.toString(),
    tipoApoyo: backendApoyo.tipo_apoyo,
    fechaInicio: backendApoyo.fecha_inicio,
    fechaFin: backendApoyo.fecha_fin,
    idCaso: backendApoyo.id_caso,
    idPrograma: backendApoyo.id_programa,
  }
}

export const apoyosService = {
  async getAll(): Promise<Apoyo[]> {
    try {
      const { data } = await ithakaApi.get<ApoyoBackendResponse[]>("/apoyos/")
      return data.map(transformBackendToFrontend)
    } catch (error) {
      console.error("Error en getAll apoyos:", error)
      throw error
    }
  },

  async getById(id: string): Promise<Apoyo> {
    const { data } = await ithakaApi.get<ApoyoBackendResponse>(`/apoyos/${id}`)
    return transformBackendToFrontend(data)
  },

  async getByCaso(idCaso: number): Promise<Apoyo[]> {
    const { data } = await ithakaApi.get<ApoyoBackendResponse[]>(`/apoyos/caso/${idCaso}`)
    return data.map(transformBackendToFrontend)
  },

  async create(payload: CreateApoyoDTO) {
    const { data } = await ithakaApi.post<ApoyoBackendResponse>("/apoyos/", payload)
    return transformBackendToFrontend(data)
  },

  async update(id: string, payload: UpdateApoyoDTO) {
    const { data } = await ithakaApi.put<ApoyoBackendResponse>(`/apoyos/${id}`, payload)
    return transformBackendToFrontend(data)
  },

  async delete(id: string) {
    await ithakaApi.delete(`/apoyos/${id}`)
  },
}
