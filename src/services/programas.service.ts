import ithakaApi from "@/src/api/api"

export interface ProgramaResponse {
  id_programa: number
  nombre: string
  activo: boolean
}

export const programasService = {
  async getAll(): Promise<ProgramaResponse[]> {
    try {
      const { data } = await ithakaApi.get<ProgramaResponse[]>("/programas/")
      return data
    } catch (error) {
      console.error("Error en getAll programas:", error)
      throw error
    }
  },
}
