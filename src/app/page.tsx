"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useRole } from "@/src/components/role-context"
import { AppShell } from "@/src/components/app-shell"
import { DashboardContent } from "@/src/components/dashboard-content"

export default function Page() {
  const router = useRouter()
  const { role } = useRole()

  useEffect(() => {
    if (!role) {
      router.push("/login")
    }
  }, [role, router])

  if (!role) {
    return null
  }

  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  )
}
