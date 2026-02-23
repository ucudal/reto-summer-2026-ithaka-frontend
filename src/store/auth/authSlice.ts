import { User } from "@/src/types/user";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  status: "checking" | "authenticated" | "not-authenticated";
  user: User | null;
  errorMessage?: string;
}

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "not-authenticated",
    user: null,
    errorMessage: undefined,
  } as AuthState,
  reducers: {
    onChecking: (state) => {
      state.status = "checking";
      state.user = null;
      state.errorMessage = undefined;
    },
    onLogin: (state, { payload }) => {
      state.status = "authenticated";
      state.user = payload;
      state.errorMessage = undefined;
    },
    onLogout: (state, { payload }) => {
      state.status = "not-authenticated";
      state.user = payload;
      state.errorMessage = payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
  },
});

export const { onChecking, onLogin, onLogout, clearErrorMessage } =
  authSlice.actions;
