"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  onChecking,
  onLogin,
  onLogout,
  RootState,
} from "../store";
import { User } from "../types/user";
import { ithakaApi } from "../api";
import axios from "axios";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector(
    (state: RootState) => state.auth,
  ) as {
    status: string;
    user: User | null;
    errorMessage: string | undefined;
  };
  const dispatch: AppDispatch = useDispatch();

  const startLogin = async ({ email, password }: LoginCredentials) => {
    dispatch(onChecking());
    try {
      const response = await ithakaApi.post("/auth/login", {
        email,
        password,
      });

      const { access_token, usuario } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", access_token);
        localStorage.setItem("token-init-date", Date.now().toString());
      }

      dispatch(
        onLogin({
          name: usuario.nombre,
          role: usuario.rol,
          email: usuario.email,
        }),
      );
    } catch (err) {
      let message = "Credenciales incorrectas";

      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.detail ??
          message;
      } else if (err instanceof Error) {
        message = err.message || message;
      }

      dispatch(onLogout(message));
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(onLogout(""));
      return;
    }

    try {
      const resp = await ithakaApi.get("/auth/me");
      const usuario = resp.data;

      dispatch(
        onLogin({
          name: usuario.nombre,
          email: usuario.email,
          role: usuario.rol,
        }),
      );
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("token-init-date");
      dispatch(onLogout(""));
    }
  };

  const startLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token-init-date");
    dispatch(onLogout(""));
  };

  return {
    status,
    user,
    errorMessage,

    startLogin,
    checkAuthToken,
    startLogout,
  };
};
