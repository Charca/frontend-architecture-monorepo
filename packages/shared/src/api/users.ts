import type { AccountMember, AuthUser } from "@commerceos/shared/types";
import { apiClient } from "@commerceos/shared/api/client";

export function fetchAccountUser(accountId: string, userId: string) {
  return apiClient.get<AccountMember>(`/api/accounts/${accountId}/users/${userId}`);
}

export function fetchProfile() {
  return apiClient.get<AuthUser>("/api/me");
}

export function updateProfile(payload: Partial<AuthUser>) {
  return apiClient.patch<AuthUser>("/api/me", payload);
}
