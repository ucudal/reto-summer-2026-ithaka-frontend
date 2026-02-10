"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPostulacion } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MessageSquare, Send, Save } from "lucide-react"

type Step = "nombre" | "postulante" | "tipo" | "descripcion" | "confirmar"

const steps: Step[] = ["nombre", "postulante", "tipo", "descripcion", "confirmar"]

export function NuevaPostulacionForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nombreProyecto: "",
    nombrePostulante: "",
    email: "",
    tipoPostulante: "",
    descripcion: "",
  })

  const step = steps[currentStep]

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function canAdvance() {
    switch (step) {
      case "nombre":
        return form.nombreProyecto.trim().length > 0
      case "postulante":
        return (
          form.nombrePostulante.trim().length > 0 &&
          form.email.trim().includes("@")
        )
      case "tipo":
        return form.tipoPostulante.length > 0
      case "descripcion":
        return form.descripcion.trim().length > 10
      default:
        return true
    }
  }

  async function handleSubmit(asBorrador: boolean) {
    setLoading(true)
    const fd = new FormData()
    fd.set("nombreProyecto", form.nombreProyecto)
    fd.set("nombrePostulante", form.nombrePostulante)
    fd.set("email", form.email)
    fd.set("tipoPostulante", form.tipoPostulante)
    fd.set("descripcion", form.descripcion)
    fd.set("estado", asBorrador ? "borrador" : "recibida")
    await createPostulacion(fd)
    setLoading(false)
    router.push("/postulaciones")
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Nueva Postulacion</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Simula el ingreso de una postulacion desde el chatbot
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= currentStep ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Chat-like conversation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary p-2">
              <MessageSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Chatbot Ithaka</CardTitle>
              <CardDescription>Paso {currentStep + 1} de {steps.length}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {step === "nombre" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3 text-sm max-w-[80%]">
                Hola, bienvenido a Ithaka. Contame, cual es el nombre de tu proyecto o idea?
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombreProyecto">Nombre del proyecto</Label>
                <Input
                  id="nombreProyecto"
                  placeholder="Ej: EcoTrack, MindfulU..."
                  value={form.nombreProyecto}
                  onChange={(e) => update("nombreProyecto", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === "postulante" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3 text-sm max-w-[80%]">
                Excelente! Ahora necesito tus datos de contacto.
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombrePostulante">Nombre completo</Label>
                <Input
                  id="nombrePostulante"
                  placeholder="Tu nombre completo"
                  value={form.nombrePostulante}
                  onChange={(e) => update("nombrePostulante", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
            </div>
          )}

          {step === "tipo" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3 text-sm max-w-[80%]">
                Perfecto. Cual es tu vinculo con la UCU?
              </div>
              <div className="space-y-2">
                <Label>Tipo de postulante</Label>
                <Select
                  value={form.tipoPostulante}
                  onValueChange={(v) => update("tipoPostulante", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu vinculo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estudiante_ucu">Estudiante UCU</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                    <SelectItem value="docente_funcionario">
                      Docente/Funcionario UCU
                    </SelectItem>
                    <SelectItem value="externo">Externo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === "descripcion" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3 text-sm max-w-[80%]">
                Genial! Ahora contame brevemente de que se trata tu idea o
                emprendimiento.
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripcion de la idea</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe tu idea en unas lineas..."
                  value={form.descripcion}
                  onChange={(e) => update("descripcion", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {step === "confirmar" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-3 text-sm max-w-[80%]">
                Perfecto! Revisa los datos antes de enviar tu postulacion.
              </div>
              <div className="rounded-lg border p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Proyecto:</span>
                  <span className="font-medium">{form.nombreProyecto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Postulante:</span>
                  <span className="font-medium">{form.nombrePostulante}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{form.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vinculo UCU:</span>
                  <span className="font-medium">{form.tipoPostulante}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Descripcion:</span>
                  <p className="mt-1">{form.descripcion}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Al enviar, aceptas que tus datos seran utilizados para la
                evaluacion de tu postulacion y contacto por parte del equipo
                Ithaka.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-2">
              {step === "confirmar" ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Guardar borrador
                  </Button>
                  <Button onClick={() => handleSubmit(false)} disabled={loading}>
                    <Send className="h-4 w-4 mr-1" />
                    {loading ? "Enviando..." : "Enviar postulacion"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
                  disabled={!canAdvance()}
                >
                  Siguiente
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
