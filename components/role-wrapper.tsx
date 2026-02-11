"use client"

import React from "react"
import RoleProvider from "@/components/role-context"

export function RoleWrapper({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      {children}
    </RoleProvider>
  )
}

export default RoleWrapper
