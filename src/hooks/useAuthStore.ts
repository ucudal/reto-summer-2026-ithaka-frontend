"use client";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ithakaApi } from "../api";
import {
  AppDispatch,
  onChecking,
  onLogin,
  onLogout,
  RootState,
} from "../store";
import { User } from "../types/user";

const AUTH_STORAGE_KEYS = {
  token: "token",
  tokenInitDate: "token-init-date",
  tokenExpireMinutes: "token-expire-minutes",
  tokenExpiresAt: "token-expires-at",
  refreshToken: "refresh-token",
} as const;

const getExpireMinutesFromResponse = (
  data: Record<string, unknown>,
): number => {
  const raw =
    data.ACCESS_TOKEN_EXPIRE_MINUTES ??
    data.access_token_expire_minutes ??
    data.accessTokenExpireMinutes;

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

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

      const expireMinutes = getExpireMinutesFromResponse(data);
      const now = Date.now();

      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEYS.token, data.access_token);
        localStorage.setItem(AUTH_STORAGE_KEYS.tokenInitDate, now.toString());

        if (expireMinutes > 0) {
          localStorage.setItem(
            AUTH_STORAGE_KEYS.tokenExpireMinutes,
            expireMinutes.toString(),
          );
          localStorage.setItem(
            AUTH_STORAGE_KEYS.tokenExpiresAt,
            (now + expireMinutes * 60_000).toString(),
          );
        }

        if (typeof data.refresh_token === "string" && data.refresh_token) {
          localStorage.setItem(
            AUTH_STORAGE_KEYS.refreshToken,
            data.refresh_token,
          );
        }
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
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.token);
    if (!token) {
      dispatch(onLogout(""));
      return;
    }

    const tokenExpiresAt = localStorage.getItem(
      AUTH_STORAGE_KEYS.tokenExpiresAt,
    );
    const tokenInitDate = localStorage.getItem(AUTH_STORAGE_KEYS.tokenInitDate);
    const tokenExpireMinutes = localStorage.getItem(
      AUTH_STORAGE_KEYS.tokenExpireMinutes,
    );

    if (!tokenExpiresAt && tokenInitDate && tokenExpireMinutes) {
      const initDate = Number(tokenInitDate);
      const expireMinutes = Number(tokenExpireMinutes);

      if (
        Number.isFinite(initDate) &&
        Number.isFinite(expireMinutes) &&
        expireMinutes > 0
      ) {
        localStorage.setItem(
          AUTH_STORAGE_KEYS.tokenExpiresAt,
          (initDate + expireMinutes * 60_000).toString(),
        );
      }
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
      localStorage.removeItem(AUTH_STORAGE_KEYS.token);
      localStorage.removeItem(AUTH_STORAGE_KEYS.tokenInitDate);
      localStorage.removeItem(AUTH_STORAGE_KEYS.tokenExpireMinutes);
      localStorage.removeItem(AUTH_STORAGE_KEYS.tokenExpiresAt);
      localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
      dispatch(onLogout(""));
    }
  };

  const startRefreshToken = async () => {
    if (typeof window === "undefined") return false;

    const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);
    if (!refreshToken) {
      return false;
    }

    try {
      const { data } = await ithakaApi.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const newAccessToken =
        (typeof data.access_token === "string" && data.access_token) ||
        (typeof data.token === "string" && data.token) ||
        null;

      if (!newAccessToken) {
        return false;
      }

      const now = Date.now();
      const expireMinutes = getExpireMinutesFromResponse(data);
      const currentExpireMinutes = Number(
        localStorage.getItem(AUTH_STORAGE_KEYS.tokenExpireMinutes) || "0",
      );
      const effectiveExpireMinutes =
        expireMinutes > 0 ? expireMinutes : currentExpireMinutes;

      localStorage.setItem(AUTH_STORAGE_KEYS.token, newAccessToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.tokenInitDate, now.toString());

      if (effectiveExpireMinutes > 0) {
        localStorage.setItem(
          AUTH_STORAGE_KEYS.tokenExpireMinutes,
          effectiveExpireMinutes.toString(),
        );
        localStorage.setItem(
          AUTH_STORAGE_KEYS.tokenExpiresAt,
          (now + effectiveExpireMinutes * 60_000).toString(),
        );
      }

      if (typeof data.refresh_token === "string" && data.refresh_token) {
        localStorage.setItem(
          AUTH_STORAGE_KEYS.refreshToken,
          data.refresh_token,
        );
      }

      return true;
    } catch {
      return false;
    }
  };

  const startLogout = async () => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.token);
    localStorage.removeItem(AUTH_STORAGE_KEYS.tokenInitDate);
    localStorage.removeItem(AUTH_STORAGE_KEYS.tokenExpireMinutes);
    localStorage.removeItem(AUTH_STORAGE_KEYS.tokenExpiresAt);
    localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
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
    startRefreshToken,
    startLogout,
  };
};
