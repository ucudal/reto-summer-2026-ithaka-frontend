"use server"

import {
  store,
  type EstadoPostulacion,
  type EstadoProyecto,
  type TipoApoyo,
  type TipoPostulante,
} from "@/src/lib/data"

// ---- Postulaciones ----

export async function getPostulaciones() {
  return store.getPostulaciones()
}

export async function getPostulacion(id: string) {
  return store.getPostulacion(id) ?? null
}

export async function createPostulacion(formData: FormData) {
  const data = {
    nombreProyecto: formData.get("nombreProyecto") as string,
    nombrePostulante: formData.get("nombrePostulante") as string,
    email: formData.get("email") as string,
    tipoPostulante: formData.get("tipoPostulante") as TipoPostulante,
    descripcion: formData.get("descripcion") as string,
    estado: (formData.get("estado") as EstadoPostulacion) || "recibida",
  }
  return store.addPostulacion(data)
}

export async function updatePostulacionEstado(id: string, estado: EstadoPostulacion) {
  return store.updatePostulacionEstado(id, estado) ?? null
}

// ---- Proyectos ----

export async function getProyectos() {
  return store.getProyectos()
}

export async function getProyecto(id: string) {
  return store.getProyecto(id) ?? null
}

export async function convertirAProyecto(postulacionId: string) {
  return store.convertirAProyecto(postulacionId)
}

export async function updateProyectoEstado(id: string, estado: EstadoProyecto) {
  return store.updateProyectoEstado(id, estado, "Operador")
}

export async function updateProyectoResponsable(id: string, responsable: string) {
  return store.updateProyectoResponsable(id, responsable, "Coordinador")
}

// ---- Apoyos ----

export async function addApoyo(proyectoId: string, tipo: TipoApoyo) {
  return store.addApoyo(proyectoId, tipo, "Coordinador")
}

export async function toggleApoyoEstado(proyectoId: string, apoyoId: string) {
  return store.toggleApoyoEstado(proyectoId, apoyoId, "Coordinador")
}

// ---- Hitos ----

export async function addHito(proyectoId: string, titulo: string) {
  return store.addHito(proyectoId, titulo)
}

export async function toggleHito(proyectoId: string, hitoId: string) {
  return store.toggleHito(proyectoId, hitoId)
}

// ---- Evaluaciones ----

export async function saveEvaluacion(
  proyectoId: string,
  data: {
    etapaEmprendimiento: string
    potencialIncubacion: "alto" | "medio" | "bajo"
    pertenenciaUCU: boolean
    notas: string
  }
) {
  return store.setEvaluacion(proyectoId, data)
}

// ---- Audit ----

export async function getAuditForEntity(entidadId: string) {
  return store.getAuditForEntity(entidadId)
}

// ---- Metrics ----

export async function getMetrics() {
  return store.getMetrics()
}
