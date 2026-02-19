"use client";

import React from "react";
import {
  X,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Globe,
  Layout,
  Type,
  Contrast,
  Sparkles,
} from "lucide-react";
import { useSettings } from "@/src/components/settings-context";
import { useI18n } from "@/src/lib/i18n";

export function SettingsDrawer() {
  const { open, closeSettings, settings, setSettings } = useSettings();
  const { t } = useI18n();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={closeSettings} />
      <aside className="absolute right-0 top-0 h-full w-96 max-w-full bg-card text-card-foreground shadow-lg p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            <h3 className="text-lg font-semibold">{t("settings.title")}</h3>
          </div>
          <button onClick={closeSettings} className="p-2 rounded hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <section className="mb-6">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4" /> {t("settings.language")}
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() => setSettings({ language: "es" })}
              className={`px-3 py-2 rounded ${settings.language === "es" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              Español
            </button>
            <button
              onClick={() => setSettings({ language: "en" })}
              className={`px-3 py-2 rounded ${settings.language === "en" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              English
            </button>
            <button
              onClick={() => setSettings({ language: "pt" })}
              className={`px-3 py-2 rounded ${settings.language === "pt" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              Português
            </button>
          </div>
        </section>

        <section className="mb-6">
          <h4 className="text-sm font-medium mb-2">{t("settings.theme")}</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSettings({ theme: "light" })}
              className={`px-3 py-2 rounded flex items-center gap-2 ${settings.theme === "light" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              <Sun className="h-4 w-4" /> {t("settings.light")}
            </button>
            <button
              onClick={() => setSettings({ theme: "dark" })}
              className={`px-3 py-2 rounded flex items-center gap-2 ${settings.theme === "dark" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              <Moon className="h-4 w-4" /> {t("settings.dark")}
            </button>
          </div>
        </section>

        <section className="mb-6">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Layout className="h-4 w-4" /> {t("settings.visual")}
          </h4>
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                <span>{t("settings.compactSidebar")}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.compactSidebar}
                onChange={(e) => setSettings({ compactSidebar: e.target.checked })}
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>{t("settings.reduceMotion")}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => setSettings({ reducedMotion: e.target.checked })}
              />
            </label>

            <label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                <span>{t("settings.highContrast")}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => setSettings({ highContrast: e.target.checked })}
              />
            </label>

            <div>
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <Type className="h-4 w-4" /> {t("settings.fontSize")}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSettings({ fontSize: "small" })}
                  className={`px-3 py-2 rounded ${settings.fontSize === "small" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  A
                </button>
                <button
                  onClick={() => setSettings({ fontSize: "normal" })}
                  className={`px-3 py-2 rounded ${settings.fontSize === "normal" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  A+
                </button>
                <button
                  onClick={() => setSettings({ fontSize: "large" })}
                  className={`px-3 py-2 rounded ${settings.fontSize === "large" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  A++
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 flex justify-end">
          <button onClick={closeSettings} className="px-4 py-2 rounded bg-muted hover:bg-muted/80">
            {t("settings.close")}
          </button>
        </div>
      </aside>
    </div>
  );
}

export default SettingsDrawer;
