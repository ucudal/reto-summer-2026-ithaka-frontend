"use client"

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { ithakaApi } from "@/src/api"
import {
  AppDispatch,
  RootState,
  onLoadingNotas,
  onSetNotas,
  onAddNota,
  onUpdateNota,
  onDeleteNota,
  onNotasError,
  clearNotas,
} from "@/src/store"
import type { Nota } from "@/src/types/nota"

export const useNotasStore = () => {
  const { status, notas, errorMessage } = useSelector(
    (state: RootState) => state.notas,
  )
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch: AppDispatch = useDispatch()

  const fetchNotas = useCallback(
    async (id_caso: number) => {
      dispatch(onLoadingNotas())
      try {
        const { data } = await ithakaApi.get("/notas/", {
          params: { id_caso },
        })
        const list: Nota[] = Array.isArray(data) ? data : []
        dispatch(onSetNotas(list))
      } catch (err) {
        let message = "Error al cargar las notas"
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message
        }
        dispatch(onNotasError(message))
      }
    },
    [dispatch],
  )

  const createNota = useCallback(
    async (id_caso: number, contenido: string, tipo_nota: string): Promise<boolean> => {
      if (!user?.id) return false
      try {
        const { data } = await ithakaApi.post("/notas/", {
          contenido,
          tipo_nota,
          id_usuario: user.id,
          id_caso,
        })
        dispatch(onAddNota(data as Nota))
        return true
      } catch (err) {
        let message = "Error al crear la nota"
        if (axios.isAxiosError(err)) {
          const detail = err.response?.data?.detail
          if (Array.isArray(detail)) {
            message = detail.map((e: { msg: string }) => e.msg).join(", ")
          } else {
            message = detail ?? err.response?.data?.message ?? message
          }
        }
        dispatch(onNotasError(message))
        return false
      }
    },
    [dispatch, user],
  )

  const updateNota = useCallback(
    async (id_nota: number, contenido: string): Promise<boolean> => {
      try {
        const { data } = await ithakaApi.put(`/notas/${id_nota}`, { contenido })
        dispatch(onUpdateNota(data as Nota))
        return true
      } catch (err) {
        let message = "Error al actualizar la nota"
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message
        }
        dispatch(onNotasError(message))
        return false
      }
    },
    [dispatch],
  )

  const deleteNota = useCallback(
    async (id_nota: number): Promise<boolean> => {
      try {
        await ithakaApi.delete(`/notas/${id_nota}`)
        dispatch(onDeleteNota(id_nota))
        return true
      } catch (err) {
        let message = "Error al eliminar la nota"
        if (axios.isAxiosError(err)) {
          message =
            err.response?.data?.detail ??
            err.response?.data?.message ??
            message
        }
        dispatch(onNotasError(message))
        return false
      }
    },
    [dispatch],
  )

  const resetNotas = useCallback(() => dispatch(clearNotas()), [dispatch])

  return {
    status,
    notas,
    errorMessage,
    fetchNotas,
    createNota,
    updateNota,
    deleteNota,
    resetNotas,
  }
}
