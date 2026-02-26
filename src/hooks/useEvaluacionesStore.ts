"use client"

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { ithakaApi } from "@/src/api"
import {
  AppDispatch,
  RootState,
  onLoadingEvaluaciones,
  onSetEvaluaciones,
  onEvaluacionesError,
} from "@/src/store"
import type { Caso } from "@/src/types/caso"

type CasoApi = {
  id_caso: number
  nombre_caso: string
  descripcion: string | null
  fecha_creacion: string
  id_estado: number
  nombre_estado: string | null
  tipo_caso: string | null
  emprendedor: string | null
  convocatoria: string | null
  datos_chatbot: Record<string, unknown> | null
  tutor_nombre: string | null
  id_tutor: number | string | null
  asignacion: number | string | null
}

const unpack = (data: unknown): CasoApi[] => {
  if (Array.isArray(data)) return data as CasoApi[]
  if (data && typeof data === "object" && "casos" in data)
    return (data as { casos: CasoApi[] }).casos ?? []
  return []
}

const toCaso = (c: CasoApi): Caso => ({
  id_caso: c.id_caso,
  nombre_caso: c.nombre_caso,
  descripcion: c.descripcion,
  datos_chatbot: c.datos_chatbot,
  consentimiento_datos: false,
  id_emprendedor: 0,
  id_convocatoria: null,
  id_estado: c.id_estado,
  nombre_estado: c.nombre_estado ?? undefined,
  tipo_caso: c.tipo_caso ?? undefined,
  convocatoria: c.convocatoria,
  fecha_creacion: c.fecha_creacion,
  emprendedor: c.emprendedor ?? "-",
  tutor: c.tutor_nombre ?? "-",
  id_tutor: typeof c.id_tutor === "number" ? c.id_tutor : null,
})

export const useEvaluacionesStore = () => {
  const { status, pendientes, proyectos, errorMessage } = useSelector(
    (state: RootState) => state.evaluaciones,
  )
  const dispatch: AppDispatch = useDispatch()

  const fetchEvaluaciones = useCallback(async () => {
    dispatch(onLoadingEvaluaciones())
    try {
      const [resPend, resProy] = await Promise.all([
        ithakaApi.get("/casos/", { params: { tipo_caso: "postulacion" } }),
        ithakaApi.get("/casos/", { params: { tipo_caso: "proyecto" } }),
      ])

      const pendientesCasos: Caso[] = unpack(resPend.data)
        .filter((c) => c.nombre_estado === "En evaluación")
        .map(toCaso)

      const proyectosCasos: Caso[] = unpack(resProy.data).map(toCaso)

      dispatch(onSetEvaluaciones({ pendientes: pendientesCasos, proyectos: proyectosCasos }))
    } catch (err) {
      let message = "Error al cargar evaluaciones"
      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.detail ??
          err.response?.data?.message ??
          message
      }
      dispatch(onEvaluacionesError(message))
    }
  }, [dispatch])

  return {
    status,
    pendientes,
    proyectos,
    errorMessage,
    fetchEvaluaciones,
  }
}
