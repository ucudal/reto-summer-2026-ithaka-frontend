"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { useAuthStore } from "@/src/hooks/useAuthStore";

const TOKEN_EXPIRES_AT_KEY = "token-expires-at";
const WARNING_WINDOW_MS = 2 * 60_000;

const formatCountdown = (milliseconds: number) => {
  const safeMs = Math.max(milliseconds, 0);
  const totalSeconds = Math.ceil(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
};

export function SessionRefreshManager() {
  const { status, startRefreshToken, startLogout } = useAuthStore();

  const [millisecondsLeft, setMillisecondsLeft] = useState<number | null>(null);
  const [declinedCurrentCycle, setDeclinedCurrentCycle] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startLogoutRef = useRef(startLogout);

  useEffect(() => {
    startLogoutRef.current = startLogout;
  }, [startLogout]);

  const getExpiresAt = useCallback(() => {
    if (typeof window === "undefined") return null;

    const raw = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
    const parsed = Number(raw);

    if (!raw || !Number.isFinite(parsed)) {
      return null;
    }

    return parsed;
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      setMillisecondsLeft(null);
      setDeclinedCurrentCycle(false);
      return;
    }

    const tick = () => {
      const expiresAt = getExpiresAt();
      if (!expiresAt) {
        setMillisecondsLeft(null);
        return;
      }

      const nextMsLeft = expiresAt - Date.now();
      setMillisecondsLeft(nextMsLeft);

      if (nextMsLeft <= 0) {
        startLogoutRef.current();
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [getExpiresAt, status]);

  const shouldOpenDialog = useMemo(() => {
    if (status !== "authenticated") return false;
    if (declinedCurrentCycle) return false;
    if (millisecondsLeft === null) return false;

    return millisecondsLeft > 0 && millisecondsLeft <= WARNING_WINDOW_MS;
  }, [declinedCurrentCycle, millisecondsLeft, status]);

  const handleOpenChange = (open: boolean) => {
    if (!open && shouldOpenDialog) {
      setDeclinedCurrentCycle(true);
    }
  };

  const handleExtendSession = async () => {
    setIsRefreshing(true);
    const refreshed = await startRefreshToken();
    setIsRefreshing(false);

    if (refreshed) {
      const expiresAt = getExpiresAt();
      if (expiresAt) {
        setMillisecondsLeft(expiresAt - Date.now());
      }
      setDeclinedCurrentCycle(false);
      return;
    }

    startLogout();
  };

  return (
    <AlertDialog open={shouldOpenDialog} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tu sesión está por expirar</AlertDialogTitle>
          <AlertDialogDescription>
            Tu sesión vence en {formatCountdown(millisecondsLeft ?? 0)}. ¿Deseas
            extenderla?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isRefreshing}>
            No, continuar sin extender
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isRefreshing}
            onClick={handleExtendSession}
          >
            {isRefreshing ? "Extendiendo..." : "Sí, extender sesión"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
