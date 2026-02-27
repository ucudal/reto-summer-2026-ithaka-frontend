"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Loader2, Pencil, Trash2, Check, X, Plus } from "lucide-react"
import { useNotasStore } from "@/src/hooks"
import type { Nota } from "@/src/types/nota"

interface NotasTabProps {
  id_caso: number
}

export function NotasTab({ id_caso }: NotasTabProps) {
  const { status, notas, errorMessage, fetchNotas, createNota, updateNota, deleteNota, resetNotas } =
    useNotasStore()

  const [newContent, setNewContent] = useState("")
  const [newTipoNota, setNewTipoNota] = useState("Seguimiento")
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchNotas(id_caso)
    return () => {
      resetNotas()
    }
  }, [id_caso])

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCreate = async () => {
    if (!newContent.trim()) return
    setSaving(true)
    const ok = await createNota(id_caso, newContent.trim(), newTipoNota)
    if (ok) {
      setNewContent("")
      setNewTipoNota("Seguimiento")
      setIsCreating(false)
    }
    setSaving(false)
  }

  const handleEditStart = (nota: Nota) => {
    setEditingId(nota.id_nota)
    setEditContent(nota.contenido)
  }

  const handleEditSave = async (id_nota: number) => {
    if (!editContent.trim()) return
    setSaving(true)
    const ok = await updateNota(id_nota, editContent.trim())
    if (ok) setEditingId(null)
    setSaving(false)
  }

  const handleDelete = async (id_nota: number) => {
    await deleteNota(id_nota)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notas internas</CardTitle>
        <CardDescription>Observaciones y comentarios internos sobre este caso</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "loading" && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando notas...
          </div>
        )}

        {status === "error" && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        {(status === "loaded" || status === "idle") && (
          <>
            {notas.length === 0 && !isCreating && (
              <p className="text-sm text-muted-foreground">Sin notas registradas.</p>
            )}

            <div className="space-y-3">
              {notas.map((nota) => (
                <div
                  key={nota.id_nota}
                  className="rounded-md border border-border/60 bg-muted/30 p-3 space-y-2"
                >
                  {editingId === nota.id_nota ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="text-sm"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditSave(nota.id_nota)}
                          disabled={saving || !editContent.trim()}
                        >
                          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                          Guardar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                          disabled={saving}
                        >
                          <X className="h-3 w-3" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{nota.contenido}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(nota.fecha)}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => handleEditStart(nota)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(nota.id_nota)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isCreating ? (
              <div className="space-y-2">
                <Select value={newTipoNota} onValueChange={setNewTipoNota}>
                  <SelectTrigger className="w-48 text-sm">
                    <SelectValue placeholder="Tipo de nota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                    <SelectItem value="Comentario">Comentario</SelectItem>
                    <SelectItem value="Alerta">Alerta</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Escribe una nota..."
                  rows={4}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreate}
                    disabled={saving || !newContent.trim()}
                  >
                    {saving ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                    Guardar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setIsCreating(false); setNewContent(""); setNewTipoNota("Seguimiento") }}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsCreating(true)}
                className="mt-1"
              >
                <Plus className="h-3 w-3 mr-1" />
                Agregar nota
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
