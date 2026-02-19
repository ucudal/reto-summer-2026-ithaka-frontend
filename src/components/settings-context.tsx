"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

type Language = "es" | "en" | "pt";
type ThemeMode = "light" | "dark";
type FontSize = "small" | "normal" | "large";

interface SettingsState {
  language: Language;
  theme: ThemeMode;
  compactSidebar: boolean;
  fontSize: FontSize;
  reducedMotion: boolean;
  highContrast: boolean;
}

interface SettingsContextValue {
  settings: SettingsState;
  setSettings: (s: Partial<SettingsState>) => void;
  open: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const defaultSettings: SettingsState = {
  language: "es",
  theme: "light",
  compactSidebar: false,
  fontSize: "normal",
  reducedMotion: false,
  highContrast: false,
};

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [settings, setSettingsState] = useState<SettingsState>(defaultSettings);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ithaka_settings");
      if (raw) {
        const parsed = JSON.parse(raw) as SettingsState & { theme?: string };
        if (parsed.theme === "system") parsed.theme = "light";
        setSettingsState(parsed as SettingsState);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("ithaka_settings", JSON.stringify(settings));
    } catch (_) {}
  }, [settings]);

  useEffect(() => {
    if (settings.theme === "light") setTheme("light");
    else setTheme("dark");
  }, [settings.theme, setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.fontSize = settings.fontSize;
    root.classList.toggle("reduce-motion", settings.reducedMotion);
    root.classList.toggle("high-contrast", settings.highContrast);
    root.lang = settings.language;
  }, [settings.fontSize, settings.reducedMotion, settings.highContrast, settings.language]);

  const setSettings = (patch: Partial<SettingsState>) =>
    setSettingsState((prev) => ({ ...prev, ...patch }));

  const value: SettingsContextValue = {
    settings,
    setSettings,
    open,
    openSettings: () => setOpen(true),
    closeSettings: () => setOpen(false),
  };

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

export default SettingsProvider;
