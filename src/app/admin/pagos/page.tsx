"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";

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
  users: {
    email: string;
    profile_data: { nombre?: string } | null;
  };
}

interface User {
  id: string;
  email: string;
  profile_data: { nombre?: string } | null;
}

export default function PagosPage() {
  const { user, loading: authLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filterUserId, setFilterUserId] = useState<string>(""); // Filtro por usuario
  const [searchQuery, setSearchQuery] = useState<string>(""); // Búsqueda de texto
  const [formData, setFormData] = useState({
    userId: "",
    paymentMethod: "cash" as "cash" | "transfer",
    amount: "",
    description: "",
    notes: "",
    category: "membership",
    discountAmount: "",
    discountReason: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔍 Cargando pagos...");

      const response = await fetch("/api/admin/payments");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ Pagos obtenidos:", data.totalPayments);

      setPayments(data.payments || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Error al cargar usuarios");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  }, []);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId || !formData.amount) {
      toast.error("Por favor completa todos los campos requeridos");
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
          amount: amountInCents,
          description: formData.description || undefined,
          notes: formData.notes || undefined,
          category: formData.category,
          discountAmount: discountInCents || undefined,
          discountReason: formData.discountReason || undefined,
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
        amount: "",
        description: "",
        notes: "",
        category: "membership",
        discountAmount: "",
        discountReason: "",
      });
      fetchData(); // Recargar la lista de pagos
    } catch (err) {
      console.error("Error registrando pago:", err);
      toast.error(err instanceof Error ? err.message : "Error al registrar pago", { id: toastId });
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
      fetchUsers(); // Cargar usuarios para el modal
    }
  }, [user, fetchData, fetchUsers]);

  // Detectar si viene desde el dashboard con #registrar
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#registrar") {
      setShowModal(true);
      // Limpiar el hash de la URL sin recargar
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
          <p className="text-gray-600">Cargando pagos...</p>
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
          <div className="bg-gray-800 rounded-lg shadow-lg p-5 border border-gray-700">
            <div className="space-y-4">
              {/* Búsqueda por texto */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Buscar usuario:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className="w-full pl-10 pr-10 py-3 bg-gray-700 border-2 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium transition-colors"
                  />
                  <svg
                    className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition-colors"
                      title="Limpiar búsqueda"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Selector rápido de usuario */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  O selecciona un usuario:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={filterUserId}
                    onChange={(e) => setFilterUserId(e.target.value)}
                    className="flex-1 px-3 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-medium transition-colors"
                  >
                    <option value="">Todos los usuarios</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.profile_data?.nombre || u.email}
                      </option>
                    ))}
                  </select>
                  {(filterUserId || searchQuery) && (
                    <button
                      onClick={() => {
                        setFilterUserId("");
                        setSearchQuery("");
                      }}
                      className="px-4 py-3 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap shadow-sm w-full sm:w-auto"
                    >
                      Limpiar todo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas del mes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 font-medium mb-1">
              Pagos Este Mes
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {paymentsThisMonth.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 font-medium mb-1">
              Ingresos Este Mes
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatAmount(totalAmountThisMonth, "mxn")}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 font-medium mb-1">
              Pagos Exitosos
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredPayments.filter((p) => p.status === "succeeded").length}
            </p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Historial de Pagos
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="text-gray-500">
                        <svg
                          className="w-12 h-12 mx-auto mb-3 text-gray-400"
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
                        <p className="text-sm font-medium">
                          {filterUserId || searchQuery
                            ? "No se encontraron pagos con los filtros aplicados"
                            : "No hay pagos registrados"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.users.profile_data?.nombre ||
                            payment.users.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {payment.users.email}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatAmount(payment.amount, payment.currency)}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentTypeBadge(
                            payment.payment_type
                          )}`}
                        >
                          {payment.payment_type === "subscription"
                            ? "Suscripción"
                            : "Único"}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                            payment.status
                          )}`}
                        >
                          {payment.status === "succeeded"
                            ? "Exitoso"
                            : payment.status === "pending"
                            ? "Pendiente"
                            : "Fallido"}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodBadge(
                            payment.payment_method
                          )}`}
                        >
                          {getPaymentMethodLabel(payment.payment_method)}
                        </span>
                        {payment.card_brand && payment.card_last4 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {payment.card_brand} •••• {payment.card_last4}
                          </div>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.paid_at || payment.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Registro de Pago Manual */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                Registrar Pago Manual
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4">
              {/* Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario * <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Selecciona un usuario</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.profile_data?.nombre || u.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Método de Pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pago <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentMethod: e.target.value as "cash" | "transfer",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="cash">💵 Efectivo</option>
                  <option value="transfer">🏦 Transferencia</option>
                </select>
              </div>

              {/* Monto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto (MXN) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="500.00"
                  required
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="membership">Membresía</option>
                  <option value="class">Clase</option>
                  <option value="seminar">Seminario</option>
                  <option value="product">Producto</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Ej: Pago mensualidad enero 2025"
                />
              </div>

              {/* Descuento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descuento (MXN)
                  </label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Ej: Estudiante"
                  />
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Internas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Notas adicionales (solo visible para administradores)"
                  rows={3}
                />
              </div>

              {/* Botones */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#dc2626",
                    padding: "0.5rem 1rem",
                    border: "none",
                    outline: "none",
                    borderRadius: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  <span style={{ color: "#ffffff" }}>Registrar Pago</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

