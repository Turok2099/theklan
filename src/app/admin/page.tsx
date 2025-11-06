"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ResponsivaData {
  id: string;
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  fecha_nacimiento: string;
  telefono: string;
  contacto_emergencia_nombre: string;
  contacto_emergencia_telefono: string;
  acepta_terminos: boolean;
  acepta_aviso_privacidad: boolean;
  firma_digital?: string;
  fecha_firma?: string;
  created_at: string;
  user_id?: string;
}

interface UserData {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  email_verified?: boolean;
  nombre?: string;
  apellido_paterno?: string;
  responsiva_status?: {
    hasResponsiva: boolean;
    isCompleted: boolean;
    isSigned: boolean;
  };
}

interface PaymentData {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  paid_at: string | null;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [responsivas, setResponsivas] = useState<ResponsivaData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔍 Iniciando carga de datos del admin dashboard...");

      // Obtener usuarios y responsivas
      const usersResponse = await fetch("/api/admin/users");
      if (!usersResponse.ok) {
        const errorData = await usersResponse.json();
        throw new Error(
          errorData.error ||
            `Error ${usersResponse.status}: ${usersResponse.statusText}`
        );
      }
      const usersData = await usersResponse.json();

      // Obtener pagos
      const paymentsResponse = await fetch("/api/admin/payments");
      if (!paymentsResponse.ok) {
        const errorData = await paymentsResponse.json();
        throw new Error(
          errorData.error ||
            `Error ${paymentsResponse.status}: ${paymentsResponse.statusText}`
        );
      }
      const paymentsData = await paymentsResponse.json();

      console.log("✅ Datos obtenidos de API:", {
        totalUsers: usersData.totalUsers,
        totalResponsivas: usersData.totalResponsivas,
        totalPayments: paymentsData.totalPayments,
      });

      setResponsivas(usersData.responsivas || []);
      setUsers(usersData.users || []);
      setPayments(paymentsData.payments || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user, fetchData]);

  // Mostrar loading mientras el auth se está cargando
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Ahora sí verificar el rol después de que terminó de cargar
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Obtener nombre para mostrar (igual que en dashboard de usuario)
  const getDisplayName = () => {
    if (!user) return "Administrador";
    const nombre = (user.profile_data as { nombre?: string })?.nombre;
    return nombre || user.email || "Administrador";
  };

  // Calcular pagos del mes actual
  const getCurrentMonthPayments = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return payments.filter((p) => {
      const paymentDate = new Date(p.paid_at || p.created_at);
      return (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear &&
        p.status === "succeeded"
      );
    });
  };

  const paymentsThisMonth = getCurrentMonthPayments();
  const totalAmountThisMonth = paymentsThisMonth.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Bienvenido, {getDisplayName()}
          </h1>
        </div>

        {/* Grid de Cards de Gestión */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
            {/* Card de Gestión de Usuarios */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Gestión de Usuarios
                    </h2>
                  </div>
                  <div className="hidden md:block">
                    <svg
                      className="w-10 h-10 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium mb-1">
                      Total de Usuarios
                    </p>
                    <p className="text-xl font-bold text-blue-900">
                      {users.length}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-medium mb-1">
                      Emails Verificados
                    </p>
                    <p className="text-xl font-bold text-green-900">
                      {users.filter((u) => u.email_verified).length}
                    </p>
                  </div>
                </div>

                <a
                  href="/admin/users"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  Ver Todos los Usuarios
                </a>
              </div>
            </div>

            {/* Card de Gestión de Responsivas */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Gestión de Responsivas
                    </h2>
                  </div>
                  <div className="hidden md:block">
                    <svg
                      className="w-10 h-10 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-xs text-yellow-600 font-medium mb-1">
                      Total de Responsivas
                    </p>
                    <p className="text-xl font-bold text-yellow-900">
                      {responsivas.length}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-medium mb-1">
                      Responsivas Firmadas
                    </p>
                    <p className="text-xl font-bold text-green-900">
                      {
                        responsivas.filter(
                          (r) => r.acepta_terminos && r.acepta_aviso_privacidad
                        ).length
                      }
                    </p>
                  </div>
                </div>

                <a
                  href="/admin/responsivas"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Ver Todas las Responsivas
                </a>
              </div>
            </div>

            {/* Card de Gestión de Pagos */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Gestión de Pagos
                    </h2>
                  </div>
                  <div className="hidden md:block">
                    <svg
                      className="w-10 h-10 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-medium mb-1">
                      Pagos Este Mes
                    </p>
                    <p className="text-xl font-bold text-green-900">
                      {paymentsThisMonth.length}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-medium mb-1">
                      Ingresos del Mes
                    </p>
                    <p className="text-xl font-bold text-blue-900">
                      {formatAmount(totalAmountThisMonth, "mxn")}
                    </p>
                  </div>
                </div>

                <a
                  href="/admin/pagos"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  Ver Todos los Pagos
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
