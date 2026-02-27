import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { estadosSlice } from "./estados/estadosSlice";
import { postulacionesSlice } from "./postulaciones/postulacionesSlice";
import { proyectosSlice } from "./proyectos/proyectosSlice";
import { evaluacionesSlice } from "./evaluaciones/evaluacionesSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    estados: estadosSlice.reducer,
    postulaciones: postulacionesSlice.reducer,
    proyectos: proyectosSlice.reducer,
    evaluaciones: evaluacionesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
