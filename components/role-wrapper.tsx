"use client"

import React from "react"
import RoleProvider from "@/components/role-context"
import RoleSelector from "@/components/role-selector"

export function RoleWrapper({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <RoleSelector />
      {children}
    </RoleProvider>
  )
}

export default RoleWrapper
