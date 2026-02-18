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
        //ESTO AJUSTAR CUANDO TENGAMOS EL BACK
        email,
        password,
      });

      const { data } = response.data; //esto tambien ajustar dependiendo como manden la respuesta

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("token-init-date", Date.now().toString());
      }

      dispatch(
        onLogin({
          name: data.user.name,
          role: data.user.role,
          email: data.user.email,
        }),
      );
    } catch (err) {
      let message = "Credenciales incorrectas";

      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.meta?.message ??
          err.response?.data?.message ??
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
      const resp = await ithakaApi.get("/renew"); //ESTO AJUSTAR LUEGO TAMBIEN SI ES QUE NOS DAN UN ENDPOINT DE RENEW
      const { data } = resp.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", Date.now().toString());

      dispatch(
        onLogin({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
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
