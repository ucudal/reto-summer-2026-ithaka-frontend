import ithakaApi from "@/src/api/api"
import { store } from "@/src/lib/data"
import type { Usuario } from "@/src/lib/data"

const USE_MOCK = true

export const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    if (USE_MOCK) {
      return Promise.resolve(store.getUsuarios())
    }

    const { data } = await ithakaApi.get<Usuario[]>("/usuarios")
    return data
  },

  async create(payload: Omit<Usuario, "id" | "creadoEn" | "ultimoAcceso">) {
    if (USE_MOCK) {
      return Promise.resolve(store.addUsuario(payload as any))
    }

    const { data } = await ithakaApi.post<Usuario>("/usuarios", payload)
    return data
  },

  async update(id: string, payload: Partial<Usuario>) {
    if (USE_MOCK) {
      return Promise.resolve(store.updateUsuario(id, payload))
    }

    const { data } = await ithakaApi.put<Usuario>(`/usuarios/${id}`, payload)
    return data
  },

  async delete(id: string) {
    if (USE_MOCK) {
      return Promise.resolve(store.deleteUsuario(id))
    }

    await ithakaApi.delete(`/usuarios/${id}`)
  },
}
