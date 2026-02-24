import ithakaApi from "@/src/api/api"
import { store, type EstadoPostulacion, type Postulacion } from "@/src/lib/data"

const USE_MOCK = false

export type PostulacionesFilters = {
  estado?: EstadoPostulacion
  fechaDesde?: string
  fechaHasta?: string
  convocatoria?: string
  completitud?: "completa" | "incompleta"
}

export const postulacionesService = {
  async getAll(filters: PostulacionesFilters = {}): Promise<Postulacion[]> {
    if (USE_MOCK) {
      return Promise.resolve(store.getPostulaciones())
    }

    const params = new URLSearchParams()
    if (filters.estado) params.set("estado", filters.estado)
    if (filters.fechaDesde) params.set("fechaDesde", filters.fechaDesde)
    if (filters.fechaHasta) params.set("fechaHasta", filters.fechaHasta)
    if (filters.convocatoria) params.set("convocatoria", filters.convocatoria)
    if (filters.completitud) params.set("completitud", filters.completitud)

    const { data } = await ithakaApi.get<Postulacion[]>("/api/postulaciones", {
      params,
    })

    return data
  },
}
