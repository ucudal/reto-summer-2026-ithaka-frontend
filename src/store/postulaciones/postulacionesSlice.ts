import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Caso } from "@/src/types/caso"

interface PostulacionesState {
  status: "idle" | "loading" | "loaded" | "error"
  selectedPostulacion: Caso | null
  errorMessage?: string
}

const initialState: PostulacionesState = {
  status: "idle",
  selectedPostulacion: null,
  errorMessage: undefined,
}

export const postulacionesSlice = createSlice({
  name: "postulaciones",
  initialState,
  reducers: {
    onLoadingPostulacion: (state) => {
      state.status = "loading"
      state.errorMessage = undefined
    },
    onSetSelectedPostulacion: (state, { payload }: PayloadAction<Caso>) => {
      state.status = "loaded"
      state.selectedPostulacion = payload
    },
    onPostulacionError: (state, { payload }: PayloadAction<string>) => {
      state.status = "error"
      state.errorMessage = payload
    },
    clearSelectedPostulacion: (state) => {
      state.status = "idle"
      state.selectedPostulacion = null
      state.errorMessage = undefined
    },
  },
})

export const { onLoadingPostulacion, onSetSelectedPostulacion, onPostulacionError, clearSelectedPostulacion } =
  postulacionesSlice.actions
