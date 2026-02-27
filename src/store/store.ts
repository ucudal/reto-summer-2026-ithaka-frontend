import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { estadosSlice } from "./estados/estadosSlice";
import { postulacionesSlice } from "./postulaciones/postulacionesSlice";
import { proyectosSlice } from "./proyectos/proyectosSlice";
import { evaluacionesSlice } from "./evaluaciones/evaluacionesSlice";
import { notasSlice } from "./notas/notasSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    estados: estadosSlice.reducer,
    postulaciones: postulacionesSlice.reducer,
    proyectos: proyectosSlice.reducer,
    evaluaciones: evaluacionesSlice.reducer,
    notas: notasSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
