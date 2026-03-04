import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Nota } from "@/src/types/nota"

interface NotasState {
  status: "idle" | "loading" | "loaded" | "error"
  notas: Nota[]
  errorMessage?: string
}

const initialState: NotasState = {
  status: "idle",
  notas: [],
  errorMessage: undefined,
}

export const notasSlice = createSlice({
  name: "notas",
  initialState,
  reducers: {
    onLoadingNotas: (state) => {
      state.status = "loading"
      state.errorMessage = undefined
    },
    onSetNotas: (state, { payload }: PayloadAction<Nota[]>) => {
      state.status = "loaded"
      state.notas = payload
    },
    onAddNota: (state, { payload }: PayloadAction<Nota>) => {
      state.notas.unshift(payload)
    },
    onUpdateNota: (state, { payload }: PayloadAction<Nota>) => {
      const index = state.notas.findIndex((n) => n.id_nota === payload.id_nota)
      if (index !== -1) state.notas[index] = payload
    },
    onDeleteNota: (state, { payload }: PayloadAction<number>) => {
      state.notas = state.notas.filter((n) => n.id_nota !== payload)
    },
    onNotasError: (state, { payload }: PayloadAction<string>) => {
      state.status = "error"
      state.errorMessage = payload
    },
    clearNotas: (state) => {
      state.status = "idle"
      state.notas = []
      state.errorMessage = undefined
    },
  },
})

export const {
  onLoadingNotas,
  onSetNotas,
  onAddNota,
  onUpdateNota,
  onDeleteNota,
  onNotasError,
  clearNotas,
} = notasSlice.actions
