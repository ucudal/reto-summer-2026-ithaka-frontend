import ithakaApi from "@/src/api/api"
import type { EstadoPostulacion, Postulacion, TipoPostulante } from "@/src/lib/data"
import type { Caso } from "@/src/types/caso"

type CasoApi = Caso & {
  tipo_caso?: "postulacion" | "proyecto" | "Postulacion" | "Proyecto" | string
  nombre_estado?: string
  convocatoria?: string | null
  nombre_convocatoria?: string | null
}

type CasosListResponse = CasoApi[] | { casos: CasoApi[] }

const normalizeTipoPostulante = (caso: CasoApi): TipoPostulante => {
  const value = (caso.datos_chatbot?.tipoPostulante ??
    caso.datos_chatbot?.tipo_postulante ??
    caso.datos_chatbot?.vinculo_institucional ??
    "externo") as string

  if (value === "estudiante_ucu") return value
  if (value === "alumni") return value
  if (value === "docente_funcionario") return value
  return "externo"
}

const normalizePostulacionEstado = (caso: CasoApi): EstadoPostulacion => {
  const raw = (caso.nombre_estado ?? "").toLowerCase()
  if (raw.includes("borrador")) return "borrador"
  if (raw.includes("postulad")) return "recibida"
  return "recibida"
}

const normalizeNombrePostulante = (caso: CasoApi) =>
  (caso.datos_chatbot?.nombrePostulante ??
    caso.datos_chatbot?.nombre_postulante ??
    caso.datos_chatbot?.nombre ??
    `Emprendedor #${caso.id_emprendedor}`) as string

const normalizeEmail = (caso: CasoApi) =>
  (caso.datos_chatbot?.email ?? caso.datos_chatbot?.correo ?? "") as string

const getConvocatoria = (caso: CasoApi) =>
  typeof caso.convocatoria === "string"
    ? caso.convocatoria
    : typeof caso.nombre_convocatoria === "string"
      ? caso.nombre_convocatoria
      : ""

const mapPostulacionEstadoFilterToBackend = (estado?: string) => {
  if (!estado) return undefined
  if (estado === "recibida") return "Postulado"
  if (estado === "borrador") return "Borrador"
  return estado
}

const toPostulacion = (caso: CasoApi): Postulacion => {
  const nombreProyecto = caso.nombre_caso ?? "Sin nombre"
  const nombrePostulante = normalizeNombrePostulante(caso)
  const email = normalizeEmail(caso)
  const descripcion = caso.descripcion ?? ""
  const completitud =
    nombreProyecto && nombrePostulante && email ? "completa" : "incompleta"

  return {
    id: String(caso.id_caso),
    nombreProyecto,
    nombrePostulante,
    email,
    tipoPostulante: normalizeTipoPostulante(caso),
    descripcion,
    notas: "",
    estado: normalizePostulacionEstado(caso),
    convocatoria: getConvocatoria(caso),
    completitud,
    creadoEn: caso.fecha_creacion,
    actualizadoEn: caso.fecha_creacion,
  }
}

const unpackCasos = (data: CasosListResponse): CasoApi[] =>
  Array.isArray(data) ? data : data.casos ?? []

export const casosService = {
  async getPostulaciones(nombreEstado?: string): Promise<Postulacion[]> {
    const backendEstado = mapPostulacionEstadoFilterToBackend(nombreEstado)
    const { data } = await ithakaApi.get<CasosListResponse>("/casos/", {
      params: {
        tipo_caso: "postulacion",
        ...(backendEstado ? { nombre_estado: backendEstado } : {}),
      },
    })

    return unpackCasos(data).map(toPostulacion)
  },

  async getCaso(id: number): Promise<CasoApi> {
    const { data } = await ithakaApi.get<CasoApi>(`/casos/${id}`)
    return data
  },
}
