import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { Providers } from "@/src/store/Providers"

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ithaka Backoffice - Centro de Emprendimiento e Innovacion UCU",
  description:
    "Backoffice administrativo para la gestion de postulaciones, proyectos y programas del ecosistema Ithaka.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
