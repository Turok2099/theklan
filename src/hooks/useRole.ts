import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook para verificar si el usuario actual es administrador
 * @returns {boolean} true si el usuario es admin, false en caso contrario
 */
export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return user?.role === "admin";
}

/**
 * Hook para verificar si el usuario actual tiene un rol específico
 * @param role - El rol a verificar
 * @returns {boolean} true si el usuario tiene el rol especificado
 */
export function useHasRole(role: "admin" | "student" | "instructor"): boolean {
  const { user } = useAuth();
  return user?.role === role;
}

/**
 * Hook para obtener el rol del usuario actual
 * @returns {string | null} El rol del usuario o null si no está autenticado
 */
export function useUserRole(): string | null {
  const { user } = useAuth();
  return user?.role || null;
}
