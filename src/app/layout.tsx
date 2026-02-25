import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import { AppLayoutShell } from "@/src/components/app-layout-shell";
import { Providers } from "@/src/store/Providers";
import "./globals.css";

const _inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ithaka Backoffice - Centro de Emprendimiento e Innovacion UCU",
  description:
    "Backoffice administrativo para la gestion de postulaciones, proyectos y programas del ecosistema Ithaka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <AppLayoutShell>{children}</AppLayoutShell>
        </Providers>
      </body>
    </html>
  );
}
