import type { Caso } from "@/src/types/caso";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProyectosState {
  status: "idle" | "loading" | "loaded" | "error";
  proyectos: Caso[];
  selectedProyecto: Caso | null;
  errorMessage?: string;
}

const initialState: ProyectosState = {
  status: "idle",
  proyectos: [],
  selectedProyecto: null,
  errorMessage: undefined,
};

export const proyectosSlice = createSlice({
  name: "proyectos",
  initialState,
  reducers: {
    onLoadingProyecto: (state) => {
      state.status = "loading";
      state.errorMessage = undefined;
    },
    onSetSelectedProyecto: (state, { payload }: PayloadAction<Caso>) => {
      state.status = "loaded";
      state.selectedProyecto = payload;
    },
    onSetProyectos: (state, { payload }: PayloadAction<Caso[]>) => {
      state.status = "loaded";
      state.proyectos = payload;
    },
    onProyectoError: (state, { payload }: PayloadAction<string>) => {
      state.status = "error";
      state.errorMessage = payload;
    },
    clearSelectedProyecto: (state) => {
      state.selectedProyecto = null;
      state.errorMessage = undefined;
    },
  },
});

export const {
  onLoadingProyecto,
  onSetSelectedProyecto,
  onSetProyectos,
  onProyectoError,
  clearSelectedProyecto,
} = proyectosSlice.actions;
