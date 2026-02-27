export interface Nota {
  id_nota: number
  contenido: string
  fecha: string
  id_usuario: number
  id_caso: number
}

export interface NotaCreate {
  contenido: string
  id_usuario: number
  id_caso: number
}

export interface NotaUpdate {
  contenido: string
}
