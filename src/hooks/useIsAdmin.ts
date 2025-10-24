// Hook para verificar si el usuario actual es administrador
// Ubicación: src/hooks/useIsAdmin.ts

import { useAuth } from "@/contexts/AuthContext";

export function useIsAdmin(): boolean {
  const { user } = useAuth();

  return user?.role === "admin";
}
