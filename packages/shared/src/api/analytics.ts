import type { AnalyticsOverview } from "@commerceos/shared/types";
import { apiClient } from "@commerceos/shared/api/client";

export function fetchAnalyticsOverview() {
  return apiClient.get<AnalyticsOverview>("/api/analytics/overview");
}
