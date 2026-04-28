import type { DashboardSummary } from "@commerceos/shared/types";
import { apiClient } from "@commerceos/shared/api/client";

export function fetchDashboardSummary() {
  return apiClient.get<DashboardSummary>("/api/dashboard/summary");
}
