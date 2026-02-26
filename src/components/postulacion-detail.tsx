"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Badge } from "@/src/components/ui/badge"
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { usePostulacionesStore } from "@/src/hooks"

export function PostulacionDetail({ id }: { id: string }) {
  const { status, selectedPostulacion, errorMessage, fetchPostulacion, resetPostulacion } = usePostulacionesStore()
  const [notas, setNotas] = useState("")

  const postulacionId = Number(id)

  useEffect(() => {
    if (!isNaN(postulacionId)) fetchPostulacion(postulacionId)
    return () => { resetPostulacion() }
  }, [postulacionId])

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isNaN(postulacionId)) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-destructive text-sm">ID de postulacion invalido.</p>
      </div>
    )
  }

  if (status === "loading") {
    return (
      <div className="p-6 lg:p-8 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Cargando postulacion...</span>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="p-6 lg:p-8">
        <Link
          href="/postulaciones"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a postulaciones
        </Link>
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{errorMessage ?? "No se pudo cargar el caso."}</p>
        </div>
      </div>
    )
  }

  if (!selectedPostulacion) return null

  const postulacion = selectedPostulacion

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/postulaciones"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a postulaciones
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{postulacion.nombre_caso}</h1>
          <Badge variant="outline" className="text-xs font-medium bg-primary/10 text-primary border-primary/20">
            Estado #{postulacion.id_estado}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Postulación #{postulacion.id_caso}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Emprendedor</p>
              <p className="text-sm font-medium">ID #{postulacion.id_emprendedor}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              {postulacion.consentimiento_datos ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <XCircle className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Consentimiento</p>
              <p className="text-sm font-medium">
                {postulacion.consentimiento_datos ? "Otorgado" : "No otorgado"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fecha</p>
              <p className="text-sm font-medium">{formatDate(postulacion.fecha_creacion)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="datos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="datos">Datos</TabsTrigger>
          <TabsTrigger value="notas">Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="datos" className="space-y-4">
          {postulacion.descripcion && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Descripcion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed">{postulacion.descripcion}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {postulacion.datos_chatbot && Object.keys(postulacion.datos_chatbot).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Respuestas del formulario</CardTitle>
                <CardDescription>
                  Informacion estructurada recopilada por el chatbot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  {Object.entries(postulacion.datos_chatbot).map(([key, value]) => (
                    <div
                      key={key}
                      className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-1 border-b border-border/50 pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="text-xs font-medium text-muted-foreground capitalize">
                        {key.replace(/_/g, " ")}
                      </dt>
                      <dd className="text-sm text-foreground">
                        {typeof value === "boolean"
                          ? value ? "Si" : "No"
                          : Array.isArray(value)
                          ? value.join(", ")
                          : typeof value === "object" && value !== null
                          ? JSON.stringify(value)
                          : String(value ?? "—")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}

          {!postulacion.descripcion && (!postulacion.datos_chatbot || Object.keys(postulacion.datos_chatbot).length === 0) && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Sin datos adicionales disponibles.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notas">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notas internas</CardTitle>
              <CardDescription>
                Observaciones y comentarios internos sobre este caso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label>Notas</Label>
                <Textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Observaciones, comentarios internos..."
                  rows={6}
                />
                <Button size="sm" disabled>
                  Guardar notas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
