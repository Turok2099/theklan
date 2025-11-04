"use client";

import { ProtectedRoute } from "@/components/auth/AuthGuard";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Payment {
  id: string;
  payment_type: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  card_last4: string | null;
  card_brand: string | null;
  description: string | null;
  product_id: string | null;
  updated_at: string | null;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      console.log("📊 PaymentsPage: Cargando pagos...");
      const response = await fetch("/api/payments");
      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`📊 PaymentsPage: ${data.payments?.length || 0} pagos cargados`);
        setPayments(data.payments || []);
        setError(null); // Limpiar errores previos si hay éxito
      } else {
        console.error("📊 PaymentsPage: Error obteniendo pagos:", data.error);
        setError(data.error || "Error al cargar pagos");
      }
    } catch (err) {
      console.error("📊 PaymentsPage: Error obteniendo pagos:", err);
      setError("Error al cargar los pagos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    
    // Refrescar los pagos cuando la ventana vuelve a tener foco
    // Esto ayuda a actualizar cuando el usuario vuelve del flujo de pago
    const handleFocus = () => {
      console.log("📊 PaymentsPage: Ventana enfocada, refrescando pagos...");
      fetchPayments();
    };
    
    window.addEventListener("focus", handleFocus);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getPaymentDate = (payment: Payment) => {
    // Usar paid_at si existe y el pago fue exitoso, sino usar created_at
    if (payment.status === "succeeded" && payment.paid_at) {
      return payment.paid_at;
    }
    return payment.created_at;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      succeeded: { label: "Completado", className: "bg-green-100 text-green-800 border border-green-300" },
      pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800 border border-yellow-300" },
      failed: { label: "Fallido", className: "bg-red-100 text-red-800 border border-red-300" },
      refunded: { label: "Reembolsado", className: "bg-gray-100 text-gray-800 border border-gray-300" },
      canceled: { label: "Cancelado", className: "bg-gray-100 text-gray-800 border border-gray-300" },
      requires_action: { label: "Requiere acción", className: "bg-blue-100 text-blue-800 border border-blue-300" },
      requires_payment_method: { label: "Sin método de pago", className: "bg-orange-100 text-orange-800 border border-orange-300" },
      requires_confirmation: { label: "Requiere confirmación", className: "bg-amber-100 text-amber-800 border border-amber-300" },
      processing: { label: "Procesando", className: "bg-blue-100 text-blue-800 border border-blue-300" },
      requires_capture: { label: "Requiere captura", className: "bg-purple-100 text-purple-800 border border-purple-300" },
    };

    const config = statusConfig[status] || { 
      label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "), 
      className: "bg-gray-100 text-gray-800 border border-gray-300" 
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Historial de Pagos
                </h1>
                <p className="text-gray-600">
                  Consulta todos tus pagos y suscripciones
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Volver al Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Contenido */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <span className="ml-3 text-gray-600">Cargando pagos...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No tienes pagos registrados aún.</p>
                <Link
                  href="/suscripcion"
                  className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Realizar un Pago
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarjeta
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => {
                      const paymentDate = getPaymentDate(payment);
                      return (
                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(paymentDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatTime(paymentDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="capitalize">
                              {payment.payment_type === "subscription" ? "Suscripción" : "Pago Único"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatAmount(payment.amount, payment.currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.card_last4 ? (
                              <span className="flex items-center gap-1">
                                {payment.card_brand && (
                                  <span className="capitalize text-xs">{payment.card_brand}</span>
                                )}
                                <span>•••• {payment.card_last4}</span>
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">N/A</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Resumen de pagos */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>
                    <span className="font-semibold">Total de pagos:</span> {payments.length}
                  </span>
                  <span>
                    <span className="font-semibold">Completados:</span>{" "}
                    <span className="text-green-600 font-medium">
                      {payments.filter((p) => p.status === "succeeded").length}
                    </span>
                  </span>
                  <span>
                    <span className="font-semibold">Pendientes/Fallidos:</span>{" "}
                    <span className="text-red-600 font-medium">
                      {payments.filter(
                        (p) =>
                          p.status !== "succeeded" &&
                          p.status !== "refunded" &&
                          p.status !== "canceled"
                      ).length}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}

