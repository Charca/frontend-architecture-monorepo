import { createContext, useContext } from "react";
import type { AuthSession, PermissionKey } from "@commerceos/shared/types";
import type { LoginPayload } from "@commerceos/shared/api/auth";

export interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthSession>;
  logout: () => Promise<void>;
  switchAccount: (accountId: string) => Promise<AuthSession>;
  hasPermission: (permission: PermissionKey) => boolean;
  getFallbackPath: () => string;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
