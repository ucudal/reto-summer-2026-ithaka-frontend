"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMetrics } from "@/app/actions"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  ESTADO_PROYECTO_LABELS,
  TIPO_APOYO_LABELS,
} from "@/lib/data"
import {
  FileText,
  FolderKanban,
  Rocket,
  Users,
  GraduationCap,
  Award,
  TrendingUp,
  ArrowRight,
} from "lucide-react"

type Metrics = Awaited<ReturnType<typeof getMetrics>>

const CHART_COLORS = [
  "hsl(215, 80%, 48%)",
  "hsl(160, 60%, 42%)",
  "hsl(35, 92%, 52%)",
  "hsl(280, 58%, 55%)",
  "hsl(350, 70%, 55%)",
]

export function DashboardContent() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  useEffect(() => {
    getMetrics().then(setMetrics)
  }, [])

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando metricas...</div>
      </div>
    )
  }

  const estadoData = Object.entries(metrics.distribucionEstado).map(
    ([key, value]) => ({
      name: ESTADO_PROYECTO_LABELS[key as keyof typeof ESTADO_PROYECTO_LABELS] || key,
      value,
    })
  )

  const apoyoData = Object.entries(metrics.distribucionApoyo).map(
    ([key, value]) => ({
      name: TIPO_APOYO_LABELS[key as keyof typeof TIPO_APOYO_LABELS] || key,
      value,
    })
  )

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vision general del ecosistema Ithaka
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        <KPICard
          icon={FileText}
          label="Total Postulaciones"
          value={metrics.totalPostulaciones}
          color="text-primary"
        />
        <KPICard
          icon={FolderKanban}
          label="Proyectos Activos"
          value={metrics.proyectosActivos}
          color="text-success"
        />
        <KPICard
          icon={Rocket}
          label="Proyectos Incubados"
          value={metrics.incubados}
          color="text-chart-4"
        />
        <KPICard
          icon={Users}
          label="Comunidad UCU"
          value={`${metrics.porcentajeUCU}%`}
          subtitle={`${metrics.comunidadUCU} de ${metrics.totalPostulaciones}`}
          color="text-warning"
        />
      </div>

      {/* Second row KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        <KPICard
          icon={GraduationCap}
          label="Estudiantes UCU"
          value={metrics.estudiantesUCU}
          color="text-primary"
        />
        <KPICard
          icon={Award}
          label="Alumni"
          value={metrics.alumni}
          color="text-success"
        />
        <KPICard
          icon={TrendingUp}
          label="Postulacion a Proyecto"
          value={`${metrics.conversionPostulacionProyecto}%`}
          color="text-warning"
        />
        <KPICard
          icon={ArrowRight}
          label="Proyecto a Incubacion"
          value={`${metrics.conversionProyectoIncubacion}%`}
          color="text-chart-4"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Proyectos por estado</CardTitle>
          </CardHeader>
          <CardContent>
            {estadoData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={estadoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {estadoData.map((_, index) => (
                      <Cell
                        key={`cell-${
                          // biome-ignore lint: index key ok for chart
                          index
                        }`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Sin datos disponibles
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Distribucion de apoyos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {apoyoData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={apoyoData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(215, 80%, 48%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Sin datos disponibles
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KPICard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  subtitle?: string
  color: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className={`rounded-lg bg-muted p-2 ${color}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
