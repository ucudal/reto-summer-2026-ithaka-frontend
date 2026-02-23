import ithakaApi from "@/src/api/api"
import { store } from "@/src/lib/data"
import type { Usuario, Rol } from "@/src/lib/data"

const USE_MOCK = true

// DTOs para coincidir con el backend
interface UsuarioBackendResponse {
  id_usuario: number
  nombre: string
  apellido: string | null
  email: string
  activo: boolean
  id_rol: number
}

interface CreateUsuarioDTO {
  nombre: string
  apellido: string
  email: string
  password: string
  id_rol: number
}

interface UpdateUsuarioDTO {
  nombre?: string
  apellido?: string
  email?: string
  password?: string
  id_rol?: number
}

// Mapeo de roles string a id_rol
const rolToIdRol: Record<Rol, number> = {
  admin: 1,
  coordinador: 2,
  tutor: 3,
  operador: 4,
}

const idRolToRol: Record<number, Rol> = {
  1: "admin",
  2: "coordinador",
  3: "tutor",
  4: "operador",
}

// Función para transformar la respuesta del backend al formato del frontend
function transformBackendToFrontend(backendUser: UsuarioBackendResponse): Usuario {
  return {
    id: backendUser.id_usuario.toString(),
    nombre: backendUser.nombre + (backendUser.apellido ? ` ${backendUser.apellido}` : ""),
    email: backendUser.email,
    rol: idRolToRol[backendUser.id_rol] || "operador",
    comunidad: "externo", // El backend no maneja este campo
    estado: backendUser.activo ? "activo" : "inactivo",
    fotoPerfil: "", // El backend no maneja este campo
    ultimoAcceso: new Date().toISOString(),
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  }
}

export const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    if (USE_MOCK) {
      return Promise.resolve(store.getUsuarios())
    }

    const { data } = await ithakaApi.get<UsuarioBackendResponse[]>("/usuarios")
    return data.map(transformBackendToFrontend)
  },

  async create(payload: Omit<Usuario, "id" | "creadoEn" | "ultimoAcceso"> & { password: string }) {
    if (USE_MOCK) {
      return Promise.resolve(store.addUsuario(payload as any))
    }

    // Separar nombre y apellido
    const nombreParts = payload.nombre.split(" ")
    const nombre = nombreParts[0]
    const apellido = nombreParts.slice(1).join(" ") || ""

    const dto: CreateUsuarioDTO = {
      nombre,
      apellido,
      email: payload.email,
      password: payload.password,
      id_rol: rolToIdRol[payload.rol] || 4,
    }

    const { data } = await ithakaApi.post<UsuarioBackendResponse>("/usuarios", dto)
    return transformBackendToFrontend(data)
  },

  async update(id: string, payload: Partial<Usuario> & { password?: string }) {
    if (USE_MOCK) {
      return Promise.resolve(store.updateUsuario(id, payload))
    }

    const dto: UpdateUsuarioDTO = {}

    // Si se actualiza el nombre, separar en nombre y apellido
    if (payload.nombre) {
      const nombreParts = payload.nombre.split(" ")
      dto.nombre = nombreParts[0]
      dto.apellido = nombreParts.slice(1).join(" ") || ""
    }

    if (payload.email) {
      dto.email = payload.email
    }

    if (payload.rol) {
      dto.id_rol = rolToIdRol[payload.rol]
    }

    if (payload.password) {
      dto.password = payload.password
    }

    const { data } = await ithakaApi.put<UsuarioBackendResponse>(`/usuarios/${id}`, dto)
    return transformBackendToFrontend(data)
  },

  async delete(id: string) {
    if (USE_MOCK) {
      return Promise.resolve(store.deleteUsuario(id))
    }

    await ithakaApi.delete(`/usuarios/${id}`)
  },

  async reactivate(id: string) {
    if (USE_MOCK) {
      return Promise.resolve(store.updateUsuario(id, { estado: "activo" }))
    }

    const { data } = await ithakaApi.put<UsuarioBackendResponse>(`/usuarios/${id}/reactivar`, {})
    return transformBackendToFrontend(data)
  },
}
