"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useRole";

interface AdminRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente para proteger rutas que requieren permisos de administrador
 */
export function AdminRoute({ children, fallback }: AdminRouteProps) {
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-gray-600">
              Debes iniciar sesión para acceder a esta página.
            </p>
            <div className="mt-6">
              <a
                href="/auth/login"
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Acceso Restringido
            </h1>
            <p className="text-gray-600 mb-4">
              No tienes permisos de administrador para acceder a esta página.
            </p>
            <p className="text-sm text-gray-500">
              Tu rol actual: <span className="font-semibold">{user.role}</span>
            </p>
            <div className="mt-6">
              <a
                href="/dashboard"
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Ir al Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
