"use client"

import { useDispatch, useSelector } from "react-redux"
import {
  AppDispatch,
  RootState,
  onLoadingPostulacion,
  onSetSelectedPostulacion,
  onPostulacionError,
  clearSelectedPostulacion,
} from "@/src/store"
import { casosService } from "@/src/services/casos.service"
import axios from "axios"

export const usePostulacionesStore = () => {
  const { status, selectedPostulacion, errorMessage } = useSelector(
    (state: RootState) => state.postulaciones,
  )
  const dispatch: AppDispatch = useDispatch()

  const fetchPostulacion = async (id: number) => {
    dispatch(onLoadingPostulacion())
    try {
      const data = await casosService.getCaso(id)
      dispatch(onSetSelectedPostulacion(data))
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
  }

  const resetPostulacion = () => dispatch(clearSelectedPostulacion())

  return {
    status,
    selectedPostulacion,
    errorMessage,
    fetchPostulacion,
    resetPostulacion,
  }
}
