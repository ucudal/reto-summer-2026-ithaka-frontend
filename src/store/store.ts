import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { postulacionesSlice } from "./postulaciones/postulacionesSlice";
import { proyectosSlice } from "./proyectos/proyectosSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    postulaciones: postulacionesSlice.reducer,
    proyectos: proyectosSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
