export interface Caso {
  id_caso: number
  nombre_caso: string
  descripcion: string | null
  datos_chatbot: Record<string, unknown> | null
  consentimiento_datos: boolean
  id_emprendedor: number
  id_convocatoria: number | null
  id_estado: number
  nombre_estado?: string
  tipo_caso?: "Postulacion" | "Proyecto" | string
  convocatoria?: string | null
  nombre_convocatoria?: string | null
  fecha_creacion: string
  emprendedor?: string | "-" 
  tutor?: string | "-"
  id_tutor?: number | null
}
