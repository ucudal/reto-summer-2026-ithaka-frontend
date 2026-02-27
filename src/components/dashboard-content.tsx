"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import {
  getEstadoPostulacionLabel,
  getEstadoProyectoLabel,
  getTipoApoyoLabel,
  useI18n,
} from "@/src/lib/i18n";
import { metricasService } from "@/src/services/metricas.service";
import type { DashboardMetricsResponse } from "@/src/types/dashboard";
import {
  FileText,
  FolderKanban,
  Handshake,
  Rocket,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = [
  "hsl(215, 80%, 48%)",
  "hsl(160, 60%, 42%)",
  "hsl(35, 92%, 52%)",
  "hsl(280, 58%, 55%)",
  "hsl(350, 70%, 55%)",
];

type EstadoChartMode = "proyectos" | "postulaciones";

export function DashboardContent() {
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [estadoChartMode, setEstadoChartMode] =
    useState<EstadoChartMode>("proyectos");
  const { t, lang } = useI18n();

  useEffect(() => {
    metricasService.getDashboard().then(setMetrics);
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">{t("dashboard.loading")}</div>
      </div>
    );
  }

  const estadoSource =
    estadoChartMode === "proyectos"
      ? metrics.proyectos_por_estado
      : metrics.postulaciones_por_estado;

  const estadoData = estadoSource.map((estado) => {
    const translatedName =
      estadoChartMode === "proyectos"
        ? getEstadoProyectoLabel(
            lang,
            estado.nombre_estado as Parameters<
              typeof getEstadoProyectoLabel
            >[1],
          )
        : getEstadoPostulacionLabel(
            lang,
            estado.nombre_estado as Parameters<
              typeof getEstadoPostulacionLabel
            >[1],
          );

    return {
      name: translatedName || estado.nombre_estado,
      value: estado.cantidad,
    };
  });

  const apoyoData = [...metrics.distribucion_apoyos]
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5)
    .map((apoyo) => ({
      name:
        getTipoApoyoLabel(
          lang,
          apoyo.label as Parameters<typeof getTipoApoyoLabel>[1],
        ) || apoyo.label,
      value: apoyo.cantidad,
    }));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {t("nav.dashboard")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("dashboard.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 mb-8">
        <KPICard
          icon={FileText}
          label={t("dashboard.totalPostulaciones")}
          value={metrics.totales.total_postulaciones}
          color="text-primary"
        />
        <KPICard
          icon={FolderKanban}
          label={t("dashboard.totalProyectos")}
          value={metrics.totales.total_proyectos}
          color="text-success"
        />
        <KPICard
          icon={Rocket}
          label={t("dashboard.totalProyectosIncubados")}
          value={metrics.totales.total_proyectos_incubados}
          color="text-chart-4"
        />
        <KPICard
          icon={Users}
          label={t("dashboard.totalTutores")}
          value={metrics.totales.total_tutores}
          color="text-warning"
        />
        <KPICard
          icon={UserRound}
          label={t("dashboard.totalEmprendedores")}
          value={metrics.totales.total_emprendedores}
          color="text-primary"
        />
        <KPICard
          icon={Handshake}
          label={t("dashboard.totalApoyos")}
          value={metrics.totales.total_apoyos}
          color="text-chart-4"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-base">
                {estadoChartMode === "proyectos"
                  ? t("dashboard.proyectosPorEstado")
                  : t("dashboard.postulacionesPorEstado")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {t("dashboard.switchProyectos")}
                </span>
                <Switch
                  checked={estadoChartMode === "postulaciones"}
                  onCheckedChange={(checked) =>
                    setEstadoChartMode(checked ? "postulaciones" : "proyectos")
                  }
                  aria-label={t("dashboard.switchEstados")}
                />
                <span className="text-xs text-muted-foreground">
                  {t("dashboard.switchPostulaciones")}
                </span>
              </div>
            </div>
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
                {t("dashboard.noData")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("dashboard.distribucionApoyos")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {apoyoData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={apoyoData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="hsl(215, 80%, 48%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t("dashboard.noData")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
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
  );
}
