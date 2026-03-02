import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Apoyo, CatalogoApoyoItem } from "@/src/services/apoyos.service";

interface ApoyosState {
  status: "idle" | "loading" | "loaded" | "error";
  apoyos: Apoyo[];
  catalogo: CatalogoApoyoItem[];
  errorMessage?: string;
}

const initialState: ApoyosState = {
  status: "idle",
  apoyos: [],
  catalogo: [],
  errorMessage: undefined,
};

export const apoyosSlice = createSlice({
  name: "apoyos",
  initialState,
  reducers: {
    onLoadingApoyos: (state) => {
      state.status = "loading";
      state.errorMessage = undefined;
    },
    onSetApoyos: (state, { payload }: PayloadAction<Apoyo[]>) => {
      state.status = "loaded";
      state.apoyos = payload;
    },
    onSetCatalogo: (state, { payload }: PayloadAction<CatalogoApoyoItem[]>) => {
      state.catalogo = payload;
    },
    onAddApoyo: (state, { payload }: PayloadAction<Apoyo>) => {
      state.status = "loaded";
      state.apoyos.unshift(payload);
    },
    onDeleteApoyo: (state, { payload }: PayloadAction<string>) => {
      state.status = "loaded";
      state.apoyos = state.apoyos.filter((a) => a.id !== payload);
    },
    onApoyosError: (state, { payload }: PayloadAction<string>) => {
      state.status = "error";
      state.errorMessage = payload;
    },
    clearApoyos: (state) => {
      state.status = "idle";
      state.apoyos = [];
      state.catalogo = [];
      state.errorMessage = undefined;
    },
  },
});

export const {
  onLoadingApoyos,
  onSetApoyos,
  onSetCatalogo,
  onAddApoyo,
  onDeleteApoyo,
  onApoyosError,
  clearApoyos,
} = apoyosSlice.actions;
