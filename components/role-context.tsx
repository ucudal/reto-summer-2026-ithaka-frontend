"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Role = "admin" | "coordinador" | "tutor" | null

type RoleContextValue = {
  role: Role
  setRole: (r: Role) => void
}

const RoleContext = createContext<RoleContextValue>({
  role: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setRole: () => {},
})

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null)

  return (
    <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}

export default RoleProvider
