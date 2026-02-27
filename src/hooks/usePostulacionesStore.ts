"use client"

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { ithakaApi } from "@/src/api"
import {
  AppDispatch,
  RootState,
  onLoadingPostulacion,
  onSetSelectedPostulacion,
  onPostulacionError,
  clearSelectedPostulacion,
} from "@/src/store"
import type { Caso } from "@/src/types/caso"

export const usePostulacionesStore = () => {
  const { status, selectedPostulacion, errorMessage } = useSelector(
    (state: RootState) => state.postulaciones,
  )
  const dispatch: AppDispatch = useDispatch()

  const fetchPostulacion = useCallback(
    async (id: number) => {
      dispatch(onLoadingPostulacion())
      try {
        const { data } = await ithakaApi.get("/casos/", {
          params: { tipo_caso: "postulacion" },
        })
        const casos: Caso[] = data?.casos ?? data ?? []
        const found = casos.find((c) => c.id_caso === id)
        if (found) {
          dispatch(onSetSelectedPostulacion(found))
        } else {
          dispatch(onPostulacionError("Postulación no encontrada"))
        }
      } catch (err) {
        let message = "Error al cargar la postulación"
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message
        }
        dispatch(onPostulacionError(message))
      }
    },
    [dispatch],
  )

  const resetPostulacion = useCallback(
    () => dispatch(clearSelectedPostulacion()),
    [dispatch],
  )

  return {
    status,
    selectedPostulacion,
    errorMessage,
    fetchPostulacion,
    resetPostulacion,
  }
}
