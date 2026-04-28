import type { SettingsData } from "@commerceos/shared/types";
import { apiClient } from "@commerceos/shared/api/client";

export function fetchSettings() {
  return apiClient.get<SettingsData>("/api/settings");
}

export function updateSettings(payload: Partial<SettingsData>) {
  return apiClient.patch<SettingsData>("/api/settings", payload);
}
