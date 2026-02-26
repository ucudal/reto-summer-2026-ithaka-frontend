export interface Estado {
  id_estado: number;
  nombre_estado: string;
  id_tipo_caso?: number;
  tipo_caso?: string | null;
}

export interface CrearEstadoPayload {
  nombre_estado: string;
  id_tipo_caso?: number;
  tipo_caso?: string;
}

export interface ActualizarEstadoPayload {
  nombre_estado?: string;
  id_tipo_caso?: number;
  tipo_caso?: string;
}
