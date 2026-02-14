"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR, { mutate } from "swr";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  CreditCard,
  Search,
  Plus,
  Calendar,
  DollarSign,
  User,
  Filter,
  Download,
  X,
  Check,
  AlertCircle,
  Loader2,
  Shield,
  ArrowLeft,
} from "lucide-react";

interface Payment {
  id: string;
  user_id: string;
  payment_method: "stripe" | "cash" | "transfer"; // Nuevo campo
  payment_type: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  card_last4: string | null;
  card_brand: string | null;
  description: string | null;
  notes: string | null; // Nuevo campo
  category: string | null; // Nuevo campo
  discount_amount: number; // Nuevo campo
  discount_reason: string | null; // Nuevo campo
  subscription_end_date?: string | null;
  users: {
    email: string;
    profile_data: { nombre?: string } | null;
  };
}

interface User {
  id: string;
  email: string;
  profile_data: { nombre?: string } | null;
  subscription?: {
    plan: string;
    amount: number;
    isActive: boolean;
    startDate: string;
    endDate: string | null;
    paymentMethod: string;
    source?: "manual" | "payments";
  } | null;
  subscription_source?: "manual" | "payments" | "none";
  subscription_override?: {
    plan_value: "basic" | "full" | "unlimited";
    plan_label: string;
    expires_at: string | null;
    updated_by?: string | null;
  } | null;
}

type SubscriptionPlanValue = "" | "none" | "basic" | "full" | "unlimited";

const PLAN_OPTIONS: { value: SubscriptionPlanValue; label: string }[] = [
  { value: "", label: "Selecciona una opción" },
  { value: "none", label: "Sin suscripción" },
  { value: "basic", label: "Basic ($1,450)" },
  { value: "full", label: "Full Jiu Jitsu ($1,650)" },
  { value: "unlimited", label: "Ilimitado ($1,990)" },
];

const PLAN_LABEL_TO_VALUE: Record<string, SubscriptionPlanValue> = {
  Basic: "basic",
  "Full Jiu Jitsu": "full",
  Ilimitado: "unlimited",
  "Sin suscripción": "none",
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PagosPage() {
  const { user, loading: authLoading } = useAuth();

  const {
    data: paymentsData,
    error: paymentsError,
    isLoading: paymentsLoading
  } = useSWR(user?.role === "admin" ? "/api/admin/payments" : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const {
    data: usersData,
    error: usersError
  } = useSWR(user?.role === "admin" ? "/api/admin/users" : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const payments: Payment[] = paymentsData?.payments || [];
  const users: User[] = usersData?.users || [];

  const loading = paymentsLoading;
  const error = paymentsError ? (paymentsError instanceof Error ? paymentsError.message : "Error cargando pagos") : null;

  const [showModal, setShowModal] = useState(false);
  const [filterUserId, setFilterUserId] = useState<string>(""); // Filtro por usuario
  const [searchQuery, setSearchQuery] = useState<string>(""); // Búsqueda de texto
  const [formData, setFormData] = useState({
    userId: "",
    paymentMethod: "cash" as "cash" | "transfer",
    paymentType: "one-time" as "subscription" | "one-time",
    plan: "" as "" | "basic" | "full" | "unlimited",
    amount: "",
    description: "",
    notes: "",
    category: "membership",
    discountAmount: "",
    discountReason: "",
    subscriptionEndDate: "",
  });
  const [subscriptionEditor, setSubscriptionEditor] = useState<{
    userId: string;
    plan: SubscriptionPlanValue;
  } | null>(null);

  // Función helper para obtener el monto según el plan
  const getPlanAmount = (plan: string): string => {
    const amounts: Record<string, string> = {
      basic: "1450.00",
      full: "1650.00",
      unlimited: "1990.00",
    };
    return amounts[plan] || "";
  };

  // Función helper para calcular fecha de expiración sugerida (30 días)
  const getSuggestedEndDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  };

  const getUserSubscription = useCallback(
    (userId: string) => {
      const user = users.find((u) => u.id === userId);
      return user?.subscription || null;
    },
    [users]
  );

  const getUserLastPayment = useCallback(
    (userId: string) => {
      const userPayments = payments
        .filter((p) => p.user_id === userId)
        .sort((a, b) => {
          const dateA = new Date(a.paid_at || a.created_at).getTime();
          const dateB = new Date(b.paid_at || b.created_at).getTime();
          return dateB - dateA;
        });

      return userPayments[0] || null;
    },
    [payments]
  );

  const startEditingSubscription = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    const override = user?.subscription_override;
    const currentSubscription = getUserSubscription(userId);

    let planValue: SubscriptionPlanValue = "none";

    if (override?.plan_value) {
      planValue = override.plan_value;
    } else if (currentSubscription?.plan) {
      planValue = PLAN_LABEL_TO_VALUE[currentSubscription.plan] || "none";
    }

    setSubscriptionEditor({
      userId,
      plan: planValue,
    });
  };

  const cancelEditingSubscription = () => {
    setSubscriptionEditor(null);
  };

  const saveSubscription = async () => {
    if (!subscriptionEditor) return;

    const { userId, plan } = subscriptionEditor;

    if (!plan) {
      toast.error("Selecciona una opción de suscripción");
      return;
    }

    const toastId = toast.loading("Actualizando suscripción...");

    try {
      if (plan === "none") {
        const response = await fetch("/api/admin/subscriptions", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Error al cancelar la suscripción"
          );
        }

        toast.success("Suscripción cancelada", { id: toastId });
      } else {
        const response = await fetch("/api/admin/subscriptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, plan }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Error al actualizar la suscripción"
          );
        }

        toast.success("Suscripción actualizada", { id: toastId });
      }

      mutate("/api/admin/payments");
      mutate("/api/admin/users");
      setSubscriptionEditor(null);
    } catch (error) {
      console.error("Error actualizando suscripción:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al actualizar",
        { id: toastId }
      );
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId || !formData.amount) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Validación adicional para suscripciones
    if (formData.paymentType === "subscription" && !formData.subscriptionEndDate) {
      toast.error("Por favor especifica la fecha de expiración para suscripciones");
      return;
    }

    const toastId = toast.loading("Registrando pago...");

    try {
      const amountInCents = Math.round(parseFloat(formData.amount) * 100);
      const discountInCents = formData.discountAmount
        ? Math.round(parseFloat(formData.discountAmount) * 100)
        : 0;

      const response = await fetch("/api/admin/payments/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formData.userId,
          paymentMethod: formData.paymentMethod,
          paymentType: formData.paymentType,
          amount: amountInCents,
          description: formData.description || undefined,
          notes: formData.notes || undefined,
          category: formData.category,
          discountAmount: discountInCents || undefined,
          discountReason: formData.discountReason || undefined,
          subscriptionEndDate: formData.subscriptionEndDate || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar pago");
      }

      toast.success("✅ Pago registrado exitosamente", { id: toastId });
      setShowModal(false);
      setFormData({
        userId: "",
        paymentMethod: "cash",
        paymentType: "one-time",
        plan: "",
        amount: "",
        description: "",
        notes: "",
        category: "membership",
        discountAmount: "",
        discountReason: "",
        subscriptionEndDate: "",
      });
      mutate("/api/admin/payments"); // Recargar la lista de pagos
    } catch (err) {
      console.error("Error registrando pago:", err);
      toast.error(err instanceof Error ? err.message : "Error al registrar pago", { id: toastId });
    }
  };



  // Detectar si viene desde el dashboard con #registrar
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#registrar") {
      setShowModal(true);
      // Limpiar el hash de la URL sin recargar
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Sin fecha";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Sin fecha";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentTypeBadge = (type: string) => {
    switch (type) {
      case "subscription":
        return "bg-blue-100 text-blue-800";
      case "one-time":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "stripe":
        return "bg-indigo-100 text-indigo-800";
      case "cash":
        return "bg-green-100 text-green-800";
      case "transfer":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "stripe":
        return "💳 Stripe";
      case "cash":
        return "💵 Efectivo";
      case "transfer":
        return "🏦 Transferencia";
      default:
        return method;
    }
  };

  // Mostrar loading mientras el auth se está cargando
  if (authLoading) {
    return (
      <div className="min-h-screen bg-pure-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
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
          <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
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
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando pagos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pure-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => mutate("/api/admin/payments")}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Filtrar pagos por usuario o búsqueda de texto
  const filteredPayments = payments.filter((p) => {
    // Filtro por dropdown de usuario específico
    if (filterUserId && p.user_id !== filterUserId) {
      return false;
    }

    // Filtro por búsqueda de texto (nombre o email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const userName = p.users.profile_data?.nombre?.toLowerCase() || "";
      const userEmail = p.users.email.toLowerCase();

      if (!userName.includes(query) && !userEmail.includes(query)) {
        return false;
      }
    }

    return true;
  });

  // Calcular estadísticas del mes actual basándose en pagos filtrados
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const paymentsThisMonth = filteredPayments.filter((p) => {
    const paymentDate = new Date(p.paid_at || p.created_at);
    return (
      paymentDate.getMonth() === currentMonth &&
      paymentDate.getFullYear() === currentYear &&
      p.status === "succeeded"
    );
  });

  const totalAmountThisMonth = paymentsThisMonth.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const filteredUsers = users.filter((user) => {
    if (!filterUserId) return true;
    return user.id === filterUserId;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Header con botón de regreso */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Gestión de Pagos
            </h1>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap"
              style={{
                color: "#ffffff",
                backgroundColor: "#dc2626",
                border: "none",
                outline: "none",
              }}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ stroke: "#ffffff" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span style={{ color: "#ffffff" }}>Volver al Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Filtro por Usuario */}
        <div className="mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* Búsqueda por texto */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-gray-400 mb-2">
                  Buscar usuario
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nombre o email..."
                    className="w-full pl-10 pr-10 py-3 bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium transition-all"
                  />
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
                      title="Limpiar búsqueda"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Selector rápido de usuario */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-gray-400 mb-2">
                  Seleccionar usuario
                </label>
                <div className="flex gap-2">
                  <select
                    value={filterUserId}
                    onChange={(e) => setFilterUserId(e.target.value)}
                    className="w-full px-3 py-3 bg-black/40 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium transition-all appearance-none"
                  >
                    <option value="">Todos los usuarios</option>
                    {filteredUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.profile_data?.nombre || u.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(filterUserId || searchQuery) && (
                <button
                  onClick={() => {
                    setFilterUserId("");
                    setSearchQuery("");
                  }}
                  className="px-4 py-3 text-sm font-bold text-white bg-white/10 border border-white/10 rounded-lg hover:bg-white/20 transition-all whitespace-nowrap shadow-sm h-[46px]"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas del mes + botón de acción */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold mb-1">
                  Pagos Este Mes
                </p>
                <p className="text-2xl font-black text-white">
                  {paymentsThisMonth.length}
                </p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold mb-1">
                  Ingresos Este Mes
                </p>
                <p className="text-2xl font-black text-white">
                  {formatAmount(totalAmountThisMonth, "mxn")}
                </p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold mb-1">
                  Pagos Exitosos
                </p>
                <p className="text-2xl font-black text-white">
                  {filteredPayments.filter((p) => p.status === "succeeded").length}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            Registrar Pago Manual
          </button>
        </div>

        {/* Payments Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md mb-8">
          <div className="px-6 py-4 border-b border-white/10 bg-black/20">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Historial de Pagos
              <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full border border-primary/30">
                {filteredPayments.length}
              </span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-black/40">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Search className="w-12 h-12 mb-3 opacity-50" />
                        <p className="text-base font-medium">
                          {filterUserId || searchQuery
                            ? "No se encontraron pagos con los filtros aplicados"
                            : "No hay pagos registrados"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-white/5 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">
                          {payment.users.profile_data?.nombre ||
                            payment.users.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {payment.users.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">
                          {formatAmount(payment.amount, payment.currency)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-bold rounded-lg border ${payment.payment_type === "subscription"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            }`}
                        >
                          {payment.payment_type === "subscription"
                            ? "Suscripción"
                            : "Único"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-bold rounded-lg border ${payment.status === "succeeded"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : payment.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              : "bg-red-500/20 text-red-300 border-red-500/30"
                            }`}
                        >
                          {payment.status === "succeeded"
                            ? "Exitoso"
                            : payment.status === "pending"
                              ? "Pendiente"
                              : "Fallido"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-bold rounded-lg border ${payment.payment_method === "stripe"
                            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                            : payment.payment_method === "cash"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                            }`}
                        >
                          {getPaymentMethodLabel(payment.payment_method)}
                        </span>
                        {payment.card_brand && payment.card_last4 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {payment.card_brand} •••• {payment.card_last4}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(payment.paid_at || payment.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gestión de suscripciones */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="px-6 py-4 border-b border-white/10 bg-black/20 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Gestión de Suscripciones
              </h2>
              <p className="text-sm text-gray-400">
                Consulta el último pago registrado de cada usuario y ajusta su suscripción manualmente.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed divide-y divide-white/10">
              <thead className="bg-black/40">
                <tr>
                  <th className="w-1/3 px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="w-1/3 px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Último pago
                  </th>
                  <th className="w-1/3 px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Suscripción actual
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No hay usuarios cargados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const subscription = u.subscription;
                    const lastPayment = getUserLastPayment(u.id);
                    const isEditing = subscriptionEditor?.userId === u.id;

                    let currentPlanValue: SubscriptionPlanValue = "none";
                    if (u.subscription_override?.plan_value) {
                      currentPlanValue = u.subscription_override.plan_value;
                    } else if (subscription?.plan) {
                      currentPlanValue = PLAN_LABEL_TO_VALUE[subscription.plan] || "none";
                    }

                    const handleSelectChange = (value: string) => {
                      setSubscriptionEditor({
                        userId: u.id,
                        plan: value as SubscriptionPlanValue,
                      });
                    };

                    return (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-white">
                            {u.profile_data?.nombre || u.email}
                          </div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lastPayment ? (
                            <div className="text-sm font-bold text-white">
                              {formatAmount(lastPayment.amount, lastPayment.currency)}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Sin pagos</span>
                          )}
                          <div className="text-xs text-gray-500">
                            {lastPayment
                              ? `${formatDate(lastPayment.paid_at || lastPayment.created_at)} • ${lastPayment.payment_type === "subscription"
                                ? "Suscripción"
                                : "Único"
                              }`
                              : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-start gap-3 text-sm">
                            <div className="flex flex-col gap-1 w-full max-w-[200px]">
                              <select
                                value={
                                  isEditing ? subscriptionEditor.plan : currentPlanValue
                                }
                                onChange={(e) => handleSelectChange(e.target.value)}
                                disabled={!isEditing}
                                className={`px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none transition-all appearance-none ${isEditing
                                  ? "bg-black/40 border-primary text-white focus:ring-1 focus:ring-primary"
                                  : "bg-white/5 border-white/10 text-gray-300 opacity-80"
                                  }`}
                              >
                                {PLAN_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value} className="bg-gray-900 text-white">
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <span className="text-[11px] text-gray-500">
                                {subscription?.endDate
                                  ? `Expira: ${formatDate(subscription.endDate)}`
                                  : "Sin fecha de expiración"}
                              </span>
                              {u.subscription_source === "manual" && (
                                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 rounded-full w-fit">
                                  Manual
                                </span>
                              )}
                            </div>

                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={saveSubscription}
                                  className="inline-flex items-center justify-center p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                                  title="Guardar"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditingSubscription}
                                  className="inline-flex items-center justify-center p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                  title="Cancelar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditingSubscription(u.id)}
                                className="text-gray-500 hover:text-primary transition-colors p-1"
                                title="Editar suscripción"
                              >
                                <div className="p-1.5 rounded-lg hover:bg-white/5">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                  </svg>
                                </div>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal de Registro de Pago Manual */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ring-1 ring-white/10">
            <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/10 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Registrar Pago Manual
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4">
              {/* Usuario */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">
                  Usuario <span className="text-primary">*</span>
                </label>
                <select
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none"
                  required
                >
                  <option value="" className="bg-gray-900">Selecciona un usuario</option>
                  {filteredUsers.map((u) => (
                    <option key={u.id} value={u.id} className="bg-gray-900">
                      {u.profile_data?.nombre || u.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Método de Pago */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">
                  Método de Pago <span className="text-primary">*</span>
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentMethod: e.target.value as "cash" | "transfer",
                    })
                  }
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none"
                  required
                >
                  <option value="cash" className="bg-gray-900">💵 Efectivo</option>
                  <option value="transfer" className="bg-gray-900">🏦 Transferencia</option>
                </select>
              </div>

              {/* Tipo de Pago */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">
                  Tipo de Pago <span className="text-primary">*</span>
                </label>
                <select
                  value={formData.paymentType}
                  onChange={(e) => {
                    const paymentType = e.target.value as "subscription" | "one-time";
                    setFormData({
                      ...formData,
                      paymentType,
                      plan: "",
                      amount: "",
                      subscriptionEndDate: paymentType === "subscription" ? getSuggestedEndDate() : "",
                    });
                  }}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none"
                  required
                >
                  <option value="one-time" className="bg-gray-900">💵 Pago Único</option>
                  <option value="subscription" className="bg-gray-900">🔄 Suscripción</option>
                </select>
              </div>

              {/* Si es suscripción, mostrar selector de plan */}
              {formData.paymentType === "subscription" && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1">
                      Plan de Suscripción <span className="text-primary">*</span>
                    </label>
                    <select
                      value={formData.plan}
                      onChange={(e) => {
                        const plan = e.target.value as "" | "basic" | "full" | "unlimited";
                        setFormData({
                          ...formData,
                          plan,
                          amount: plan ? getPlanAmount(plan) : "",
                        });
                      }}
                      className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none"
                      required
                    >
                      <option value="" className="bg-gray-900">Selecciona un plan</option>
                      <option value="basic" className="bg-gray-900">Basic - $1,450 MXN</option>
                      <option value="full" className="bg-gray-900">Full Jiu Jitsu - $1,650 MXN</option>
                      <option value="unlimited" className="bg-gray-900">Ilimitado - $1,990 MXN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1">
                      Fecha de Expiración <span className="text-primary">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.subscriptionEndDate}
                      onChange={(e) =>
                        setFormData({ ...formData, subscriptionEndDate: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fecha hasta la cual la suscripción estará activa
                    </p>
                  </div>
                </>
              )}

              {/* Monto */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">
                  Monto (MXN) <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full pl-7 pr-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-gray-600"
                    placeholder="500.00"
                    required
                    readOnly={formData.paymentType === "subscription" && formData.plan !== ""}
                  />
                </div>
                {formData.paymentType === "subscription" && formData.plan && (
                  <p className="text-xs text-gray-500 mt-1">
                    Monto auto-completado según el plan seleccionado
                  </p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none"
                >
                  <option value="membership" className="bg-gray-900">Membresía</option>
                  <option value="class" className="bg-gray-900">Clase</option>
                  <option value="seminar" className="bg-gray-900">Seminario</option>
                  <option value="product" className="bg-gray-900">Producto</option>
                  <option value="other" className="bg-gray-900">Otro</option>
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-gray-600"
                  placeholder="Ej: Pago mensualidad enero 2025"
                />
              </div>

              {/* Descuento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1">
                    Descuento (MXN)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.discountAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountAmount: e.target.value,
                        })
                      }
                      className="w-full pl-7 pr-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-gray-600"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1">
                    Razón del Descuento
                  </label>
                  <input
                    type="text"
                    value={formData.discountReason}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountReason: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-gray-600"
                    placeholder="Ej: Estudiante"
                  />
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">
                  Notas Internas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder-gray-600"
                  placeholder="Notas adicionales (solo visible para administradores)"
                  rows={3}
                />
              </div>

              {/* Botones */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-6 py-2.5 text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors font-bold shadow-lg shadow-primary/20"
                >
                  Registrar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

