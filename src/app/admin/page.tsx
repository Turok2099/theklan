"use client";

import useSWR from "swr";
import { useAuth } from "@/contexts/AuthContext";

import {
  Users,
  FileSignature,
  CreditCard,
  ArrowRight,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();

  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
  } = useSWR(user?.role === "admin" ? "/api/admin/users" : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
  });

  const {
    data: paymentsData,
    error: paymentsError,
    isLoading: paymentsLoading,
  } = useSWR(user?.role === "admin" ? "/api/admin/payments" : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
  });

  const loading = usersLoading || paymentsLoading;
  const error = usersError || paymentsError;

  const users: UserData[] = usersData?.users || [];
  const responsivas: ResponsivaData[] = usersData?.responsivas || [];
  const payments: PaymentData[] = paymentsData?.payments || [];

  // Mostrar loading mientras el auth se está cargando
  if (authLoading) {
    return (
      <div className="min-h-screen bg-pure-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Ahora sí verificar el rol después de que terminó de cargar
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-pure-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-400">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pure-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pure-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-400 mb-4">Error al cargar los datos. Por favor, intenta de nuevo.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-900/20"
          >
            Recargar
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
    <div className="min-h-screen bg-pure-black flex items-center pt-32 pb-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-400 text-lg">
            Bienvenido, <span className="text-red-500 font-semibold">{getDisplayName()}</span>
          </p>
        </div>

        {/* Grid de Cards de Gestión */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl w-full">
            {/* Card de Gestión de Usuarios */}
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl overflow-hidden hover:border-blue-500/30 transition-all group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white text-right">
                    Gestión de<br />Usuarios
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                      Total
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {users.length}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 opacity-20">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-1">
                      Verificados
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {users.filter((u) => u.email_verified).length}
                    </p>
                  </div>
                </div>

                <a
                  href="/admin/users"
                  className="flex items-center justify-between w-full px-4 py-3 bg-white/5 hover:bg-blue-600/20 text-gray-300 hover:text-blue-400 border border-white/10 hover:border-blue-500/50 rounded-lg transition-all group/btn"
                >
                  <span className="text-sm font-semibold">Ver Todos</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Card de Gestión de Responsivas */}
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl overflow-hidden hover:border-yellow-500/30 transition-all group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors">
                    <FileSignature className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white text-right">
                    Gestión de<br />Responsivas
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                      Total
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {responsivas.length}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 opacity-20">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-1">
                      Firmadas
                    </p>
                    <p className="text-2xl font-bold text-white">
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
                  className="flex items-center justify-between w-full px-4 py-3 bg-white/5 hover:bg-yellow-600/20 text-gray-300 hover:text-yellow-400 border border-white/10 hover:border-yellow-500/50 rounded-lg transition-all group/btn"
                >
                  <span className="text-sm font-semibold">Ver Todas</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Card de Gestión de Pagos */}
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl overflow-hidden hover:border-green-500/30 transition-all group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                    <CreditCard className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white text-right">
                    Gestión de<br />Pagos
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                      Pagos Mes
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {paymentsThisMonth.length}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 opacity-20">
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest mb-1">
                      Ingresos
                    </p>
                    <p className="text-xl font-bold text-white truncate" title={formatAmount(totalAmountThisMonth, "mxn")}>
                      {formatAmount(totalAmountThisMonth, "mxn")}
                    </p>
                  </div>
                </div>

                <a
                  href="/admin/pagos"
                  className="flex items-center justify-between w-full px-4 py-3 bg-white/5 hover:bg-green-600/20 text-gray-300 hover:text-green-400 border border-white/10 hover:border-green-500/50 rounded-lg transition-all group/btn"
                >
                  <span className="text-sm font-semibold">Ver Todos</span>
                  <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
