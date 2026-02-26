import ithakaApi from "@/src/api/api"
import type { Usuario, Rol } from "@/src/lib/data"

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
    comunidad: "externo" as any,
    estado: backendUser.activo ? "activo" : "inactivo",
    fotoPerfil: "",
    ultimoAcceso: new Date().toISOString(),
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  }
}

export const usuariosService = {
  async getRoles() {
    try {
      const { data } = await ithakaApi.get<Array<{ id_rol: number; nombre_rol: string }>>("/api/v1/roles/")
      return data
    } catch (error) {
      console.error("Error trayendo roles:", error)
      throw error
    }
  },

  async getAll(): Promise<Usuario[]> {
    try {
      const { data } = await ithakaApi.get<UsuarioBackendResponse[]>("/api/v1/usuarios/")
      console.log("Usuarios del backend:", data)
      const transformed = data.map(transformBackendToFrontend)
      console.log("Usuarios transformados:", transformed)
      return transformed
    } catch (error) {
      console.error("Error en getAll:", error)
      throw error
    }
  },

  async getById(id: string): Promise<Usuario> {
    const { data } = await ithakaApi.get<UsuarioBackendResponse>(`/api/v1/usuarios/${id}`)
    return transformBackendToFrontend(data)
  },

  async create(payload: Omit<Usuario, "id" | "creadoEn" | "ultimoAcceso"> & { password: string }) {
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

    const { data } = await ithakaApi.post<UsuarioBackendResponse>("/api/v1/usuarios/", dto)
    return transformBackendToFrontend(data)
  },

  async update(id: string, payload: Partial<Usuario> & { password?: string }) {
    const dto: UpdateUsuarioDTO = {}

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

    const { data } = await ithakaApi.put<UsuarioBackendResponse>(`/api/v1/usuarios/${id}`, dto)
    return transformBackendToFrontend(data)
  },

  async delete(id: string) {
    await ithakaApi.delete(`/api/v1/usuarios/${id}`)
  },

  async reactivate(id: string) {
    const { data } = await ithakaApi.put<UsuarioBackendResponse>(`/api/v1/usuarios/${id}/reactivar`, {})
    return transformBackendToFrontend(data)
  },
}
