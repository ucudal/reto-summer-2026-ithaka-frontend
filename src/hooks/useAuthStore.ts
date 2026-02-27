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
      const { data } = await ithakaApi.post("/auth/login", {
        email,
        password,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("token-init-date", Date.now().toString());
      }

      dispatch(
        onLogin({
          name: data.usuario.nombre,
          role: data.usuario.rol,
          email: data.usuario.email,
          id: data.usuario.id_usuario,
        }),
      );
    } catch (err) {
      let message = "Credenciales incorrectas";

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.detail ?? message;
      } else if (err instanceof Error) {
        message = err.message || message;
      }

      dispatch(onLogout(message));
    }
  };

  const checkAuthToken = async () => {
    if (typeof window === "undefined") return;

    dispatch(onChecking());
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(onLogout(""));
      return;
    }

    try {
      const { data } = await ithakaApi.get("/auth/me");

      dispatch(
        onLogin({
          name: data.nombre,
          email: data.email,
          role: data.rol,
          id: data.id_usuario,
        }),
      );
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("token-init-date");
      dispatch(onLogout(""));
    }
  };

  const startLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token-init-date");
    dispatch(onLogout(""));

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
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
