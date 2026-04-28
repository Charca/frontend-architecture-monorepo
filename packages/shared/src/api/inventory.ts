import type { InventoryItem } from "@commerceos/shared/types";
import { apiClient } from "@commerceos/shared/api/client";

export function fetchInventory() {
  return apiClient.get<InventoryItem[]>("/api/inventory");
}

export function updateInventory(itemId: string, payload: Partial<InventoryItem>) {
  return apiClient.patch<InventoryItem>(`/api/inventory/${itemId}`, payload);
}
