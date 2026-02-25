export interface Caso {
  id_caso: number;
  nombre_caso: string;
  descripcion: string | null;
  datos_chatbot: Record<string, unknown> | null;
  consentimiento_datos: boolean;
  id_emprendedor: number;
  id_convocatoria: number | null;
  id_estado: number;
  fecha_creacion: string;
  nombre_estado?: string | null;
  emprendedor?: string | null;
  convocatoria?: string | null;
  tutor?: string | null;
}
