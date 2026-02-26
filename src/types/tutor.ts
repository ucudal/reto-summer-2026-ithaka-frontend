export interface Tutor {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email?: string;
  id_rol?: number;
}

export interface ActualizarResponsablePayload {
  id_tutor: number | null;
  tutor: string; 
}