import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Caso } from "@/src/types/caso"

interface EvaluacionesState {
  status: "idle" | "loading" | "loaded" | "error"
  pendientes: Caso[]
  proyectos: Caso[]
  errorMessage?: string
}

const initialState: EvaluacionesState = {
  status: "idle",
  pendientes: [],
  proyectos: [],
  errorMessage: undefined,
}

export const evaluacionesSlice = createSlice({
  name: "evaluaciones",
  initialState,
  reducers: {
    onLoadingEvaluaciones: (state) => {
      state.status = "loading"
      state.errorMessage = undefined
    },
    onSetEvaluaciones: (
      state,
      { payload }: PayloadAction<{ pendientes: Caso[]; proyectos: Caso[] }>
    ) => {
      state.status = "loaded"
      state.pendientes = payload.pendientes
      state.proyectos = payload.proyectos
    },
    onEvaluacionesError: (state, { payload }: PayloadAction<string>) => {
      state.status = "error"
      state.errorMessage = payload
    },
  },
})

export const { onLoadingEvaluaciones, onSetEvaluaciones, onEvaluacionesError } =
  evaluacionesSlice.actions
