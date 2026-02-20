"use client"

import { useEffect, useState, useCallback } from "react"
import {
  getPostulacion,
  getAuditForEntity,
  updatePostulacionNotas,
} from "@/src/app/actions"
import type { Postulacion, AuditEntry } from "@/src/lib/data"
import { TIPO_POSTULANTE_LABELS } from "@/src/lib/data"
import { StatusBadge } from "@/src/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { ArrowLeft, User, Mail, Tag, Calendar, FileText, History } from "lucide-react"
import Link from "next/link"

export function PostulacionDetail({ id }: { id: string }) {
  const [postulacion, setPostulacion] = useState<Postulacion | null>(null)
  const [audit, setAudit] = useState<AuditEntry[]>([])
  const [notas, setNotas] = useState("")
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    const [p, a] = await Promise.all([
      getPostulacion(id),
      getAuditForEntity(id),
    ])
    setPostulacion(p)
    setAudit(a)
    if (p) setNotas(p.notas ?? "")
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (!postulacion) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-muted-foreground">Cargando postulacion...</p>
      </div>
    )
  }

  async function handleSaveNotas() {
    setSaving(true)
    await updatePostulacionNotas(id, notas)
    setSaving(false)
    loadData()
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
          <h1 className="text-2xl font-bold">{postulacion.nombreProyecto}</h1>
          <StatusBadge status={postulacion.estado} />
        </div>
        <p className="text-sm text-muted-foreground mt-1">{postulacion.id}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Postulante</p>
              <p className="text-sm font-medium">{postulacion.nombrePostulante}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{postulacion.email}</p>
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
              <p className="text-sm font-medium">{formatDate(postulacion.creadoEn)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="datos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="datos">Datos</TabsTrigger>
          <TabsTrigger value="notas">Notas</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="datos" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informacion del postulante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nombre</p>
                    <p className="text-sm font-medium">{postulacion.nombrePostulante}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{postulacion.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo postulante</p>
                    <p className="text-sm font-medium">
                      {TIPO_POSTULANTE_LABELS[postulacion.tipoPostulante]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha de postulacion</p>
                    <p className="text-sm font-medium">{formatDate(postulacion.creadoEn)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Descripcion del emprendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed">{postulacion.descripcion}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notas">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notas internas</CardTitle>
              <CardDescription>
                Observaciones y comentarios internos sobre esta postulacion
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
                <div className="flex items-center justify-between">
                  <Button size="sm" onClick={handleSaveNotas} disabled={saving}>
                    {saving ? "Guardando..." : "Guardar notas"}
                  </Button>
                  {postulacion.notas && (
                    <p className="text-xs text-muted-foreground">
                      Ultima actualizacion: {formatDate(postulacion.actualizadoEn)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historial de actividad</CardTitle>
              <CardDescription>
                Registro de cambios y eventos de esta postulacion
              </CardDescription>
            </CardHeader>
            <CardContent>
              {audit.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Sin registros de historial
                </p>
              ) : (
                <div className="space-y-3">
                  {audit.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start gap-3 border-l-2 border-primary/20 pl-4 py-1"
                    >
                      <History className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{a.accion}</span>
                          {" — "}
                          <span className="text-muted-foreground">{a.detalle}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Por {a.usuario} el {formatDate(a.fecha)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
