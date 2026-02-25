import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from ".";
//aca metemos los slice cuando tengamos

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    //aca van los reducers de los slices, por ahora esta este de auth nomas
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;