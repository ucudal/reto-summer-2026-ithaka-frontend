import { ithakaApi } from "@/src/api";
import type { DashboardMetricsResponse } from "@/src/types/dashboard";

export const metricasService = {
  async getDashboard(): Promise<DashboardMetricsResponse> {
    const { data } = await ithakaApi.get<DashboardMetricsResponse>(
      "/metricas/dashboard",
    );

    return data;
  },
};
