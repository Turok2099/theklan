"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: string[];
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireRole = [],
  redirectTo = "/auth/login",
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Esperar a que termine la carga

    // Si requiere autenticación pero no hay usuario
    if (requireAuth && !user) {
      console.log("🔒 Usuario no autenticado, redirigiendo a:", redirectTo);
      router.push(redirectTo);
      return;
    }

    // Si hay usuario pero requiere roles específicos
    if (user && requireRole.length > 0) {
      const hasRequiredRole = requireRole.includes(user.role);
      if (!hasRequiredRole) {
        console.log("🚫 Usuario sin permisos suficientes, redirigiendo");
        router.push("/unauthorized");
        return;
      }
    }

    // Si no requiere autenticación pero hay usuario, redirigir al dashboard
    if (!requireAuth && user) {
      console.log("✅ Usuario autenticado, redirigiendo al dashboard");
      router.push("/dashboard");
      return;
    }
  }, [user, loading, requireAuth, requireRole, redirectTo, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si requiere autenticación pero no hay usuario, no mostrar contenido
  if (requireAuth && !user) {
    return null;
  }

  // Si hay usuario pero no tiene los roles requeridos, no mostrar contenido
  if (user && requireRole.length > 0 && !requireRole.includes(user.role)) {
    return null;
  }

  // Si no requiere autenticación pero hay usuario, no mostrar contenido (será redirigido)
  if (!requireAuth && user) {
    return null;
  }

  return <>{children}</>;
}

// Componentes de conveniencia para diferentes casos de uso
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <AuthGuard requireAuth={true}>{children}</AuthGuard>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={true} requireRole={["admin"]}>
      {children}
    </AuthGuard>
  );
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  return <AuthGuard requireAuth={false}>{children}</AuthGuard>;
}
