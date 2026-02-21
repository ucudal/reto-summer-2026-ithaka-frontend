import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { postulacionesSlice } from "./postulaciones/postulacionesSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    postulaciones: postulacionesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
