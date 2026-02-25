import type { Estado } from "@/src/types/estado";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EstadosState {
  status: "idle" | "loading" | "loaded" | "error";
  estados: Estado[];
  selectedEstado: Estado | null;
  errorMessage?: string;
}

const initialState: EstadosState = {
  status: "idle",
  estados: [],
  selectedEstado: null,
  errorMessage: undefined,
};

export const estadosSlice = createSlice({
  name: "estados",
  initialState,
  reducers: {
    onLoadingEstados: (state) => {
      state.status = "loading";
      state.errorMessage = undefined;
    },
    onSetEstados: (state, { payload }: PayloadAction<Estado[]>) => {
      state.status = "loaded";
      state.estados = payload;
    },
    onSetSelectedEstado: (state, { payload }: PayloadAction<Estado | null>) => {
      state.status = "loaded";
      state.selectedEstado = payload;
    },
    onAddEstado: (state, { payload }: PayloadAction<Estado>) => {
      state.status = "loaded";
      state.estados = [...state.estados, payload];
    },
    onUpdateEstado: (state, { payload }: PayloadAction<Estado>) => {
      state.status = "loaded";
      state.estados = state.estados.map((estado) =>
        estado.id_estado === payload.id_estado ? payload : estado,
      );
      if (state.selectedEstado?.id_estado === payload.id_estado) {
        state.selectedEstado = payload;
      }
    },
    onDeleteEstado: (state, { payload }: PayloadAction<number>) => {
      state.status = "loaded";
      state.estados = state.estados.filter(
        (estado) => estado.id_estado !== payload,
      );
      if (state.selectedEstado?.id_estado === payload) {
        state.selectedEstado = null;
      }
    },
    onEstadosError: (state, { payload }: PayloadAction<string>) => {
      state.status = "error";
      state.errorMessage = payload;
    },
    clearSelectedEstado: (state) => {
      state.selectedEstado = null;
      state.errorMessage = undefined;
    },
  },
});

export const {
  onLoadingEstados,
  onSetEstados,
  onSetSelectedEstado,
  onAddEstado,
  onUpdateEstado,
  onDeleteEstado,
  onEstadosError,
  clearSelectedEstado,
} = estadosSlice.actions;
