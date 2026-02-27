export interface TotalesDashboard {
  total_postulaciones: number;
  total_proyectos: number;
  total_proyectos_incubados: number;
  total_tutores: number;
  total_emprendedores: number;
  total_apoyos: number;
}

export interface EstadoDashboard {
  id_estado: number;
  nombre_estado: string;
  cantidad: number;
  porcentaje: number;
}

export interface DistribucionApoyoDashboard {
  label: string;
  cantidad: number;
}

export interface DashboardMetricsResponse {
  filtros: Record<string, unknown>;
  totales: TotalesDashboard;
  proyectos_por_estado: EstadoDashboard[];
  postulaciones_por_estado: EstadoDashboard[];
  distribucion_apoyos: DistribucionApoyoDashboard[];
}
