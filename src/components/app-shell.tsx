"use client"

import React from "react"

import { AppSidebar } from "@/src/components/app-sidebar"
import SettingsDrawer from "@/src/components/settings-drawer"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <SettingsDrawer />
    </div>
  )
}
