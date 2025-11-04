"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/AuthGuard";
import { useState, useEffect, useMemo } from "react";
import {
  PencilIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CreditCardIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import toast from "react-hot-toast";

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

interface ResponsivaStatus {
  hasResponsiva: boolean;
  isCompleted: boolean;
  isSigned: boolean;
  responsiva: {
    id: string;
    nombre: string;
    email: string;
    fechaCreacion: string;
    fechaFirma?: string;
    aceptaTerminos?: boolean;
    aceptaAvisoPrivacidad?: boolean;
  } | null;
}

export default function DashboardPage() {
  const { user, signOut, refreshUser } = useAuth();
  const [responsivaStatus, setResponsivaStatus] =
    useState<ResponsivaStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Estados para edición
  const [editingField, setEditingField] = useState<"nombre" | "email" | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Formulario de edición
  const [editForm, setEditForm] = useState({
    nombre: "",
    email: "",
  });

  const handleSignOut = async () => {
    await signOut();
  };

  const downloadResponsiva = async (responsivaId?: string) => {
    if (!responsivaId) {
      console.error("❌ No se proporcionó ID de responsiva");
      return;
    }

    try {
      console.log("📄 Descargando responsiva:", responsivaId);

      const response = await fetch(`/api/pdf?id=${responsivaId}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `responsiva-${
        responsivaStatus?.responsiva?.nombre?.replace(/\s+/g, "-") ||
        "documento"
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("✅ PDF descargado exitosamente");
    } catch (error) {
      console.error("❌ Error descargando PDF:", error);
      alert("Error al descargar el PDF. Por favor, intenta de nuevo.");
    }
  };

  // Obtener nombre del usuario (desde profile_data)
  const getUserName = () => {
    if (!user) return "";
    const nombre = (user.profile_data as { nombre?: string })?.nombre;
    return nombre || "";
  };

  // Obtener nombre para mostrar en saludo
  const getDisplayName = () => {
    const nombre = getUserName();
    return nombre || user?.email || "";
  };

  // Inicializar formulario cuando se abre edición
  useEffect(() => {
    if (editingField && user) {
      setEditForm({
        nombre: getUserName() || "",
        email: user.email || "",
      });
      setSubmitError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingField, user]);

  // Verificar estado de responsiva
  useEffect(() => {
    const checkResponsivaStatus = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/responsivas/status");
        const data = await response.json();

        if (response.ok) {
          setResponsivaStatus(data);
        } else {
          console.error("Error obteniendo estado de responsiva:", data.error);
        }
      } catch (error) {
        console.error("Error verificando responsiva:", error);
      } finally {
        setLoadingStatus(false);
      }
    };

    checkResponsivaStatus();
  }, [user]);

  // Manejar envío del formulario de edición
  const handleEditSubmit = async (
    e: React.FormEvent,
    field: "nombre" | "email"
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const body: {
        email?: string;
        nombre?: string;
      } = {};

      if (field === "email" && editForm.email !== user?.email) {
        body.email = editForm.email;
      }

      if (field === "nombre" && editForm.nombre !== getUserName()) {
        body.nombre = editForm.nombre;
      }

      // Si no hay cambios, no hacer nada
      if (Object.keys(body).length === 0) {
        setEditingField(null);
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el perfil");
      }

      setEditingField(null);

      // Refrescar datos del usuario
      await refreshUser();

      // Mostrar toast de éxito
      toast.success("Perfil actualizado exitosamente", {
        style: {
          background: "#000000",
          color: "#ffffff",
          border: "1px solid #dc2626",
          borderRadius: "0.5rem",
        },
        iconTheme: {
          primary: "#dc2626",
          secondary: "#ffffff",
        },
      });

      // Limpiar formulario
      setEditForm({
        nombre: "",
        email: "",
      });
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardContent
        user={user}
        getUserName={getUserName}
        getDisplayName={getDisplayName}
        handleSignOut={handleSignOut}
        responsivaStatus={responsivaStatus}
        loadingStatus={loadingStatus}
        downloadResponsiva={downloadResponsiva}
        editingField={editingField}
        setEditingField={setEditingField}
        editForm={editForm}
        setEditForm={setEditForm}
        handleEditSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    </ProtectedRoute>
  );
}

function SubscriptionStatus() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        console.log("📊 SubscriptionStatus: Cargando pagos...");
        const response = await fetch("/api/payments");
        const data = await response.json();

        if (response.ok && data.success) {
          console.log(
            `📊 SubscriptionStatus: ${
              data.payments?.length || 0
            } pagos cargados`
          );
          setPayments(data.payments || []);
        } else {
          console.error(
            "📊 SubscriptionStatus: Error obteniendo pagos:",
            data.error
          );
        }
      } catch (err) {
        console.error("📊 SubscriptionStatus: Error obteniendo pagos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();

    // Refrescar los pagos cuando la ventana vuelve a tener foco
    // Esto ayuda a actualizar cuando el usuario vuelve del flujo de pago
    const handleFocus = () => {
      console.log(
        "📊 SubscriptionStatus: Ventana enfocada, refrescando pagos..."
      );
      fetchPayments();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Funciones auxiliares (definidas antes del useMemo para que estén disponibles)
  const getPaymentDate = (payment: Payment) => {
    // Priorizar paid_at si existe, ya que es la fecha real del pago
    // Si no existe, usar created_at como fallback
    // Esto asegura que siempre tengamos una fecha válida
    const date = payment.paid_at || payment.created_at;
    if (!date) {
      console.warn("⚠️ Payment sin fecha válida:", payment.id);
      return new Date().toISOString(); // Fallback a fecha actual
    }
    return date;
  };

  // Función para obtener el nombre del plan basado en el monto
  const getPlanName = (amount: number): string => {
    // Mapeo de montos a nombres de planes
    const planMap: Record<number, string> = {
      145000: "Basic",
      165000: "Full Jiu Jitsu",
      199000: "Ilimitado",
    };

    return planMap[amount] || "Plan Personalizado";
  };

  // Calcular fecha de expiración (30 días naturales desde el pago)
  const getExpirationDate = (paymentDate: Date): Date => {
    const expiration = new Date(paymentDate);

    // Agregar 30 días naturales
    expiration.setDate(expiration.getDate() + 30);

    // Si el día es 31 o mayor y el mes siguiente no tiene 31 días
    // ajustar al último día del mes
    if (expiration.getDate() > 28) {
      const testDate = new Date(
        expiration.getFullYear(),
        expiration.getMonth() + 1,
        0
      );
      const daysInMonth = testDate.getDate();

      if (expiration.getDate() > daysInMonth) {
        expiration.setDate(daysInMonth);
      }
    }

    return expiration;
  };

  // Funciones de formato (definidas antes del useMemo)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  // Obtener el último pago de suscripción activo usando useMemo para recalcular cuando cambien los pagos
  const subscription = useMemo(() => {
    const now = new Date();

    console.log(
      "📊 SubscriptionStatus: Total de pagos recibidos:",
      payments.length
    );
    console.log(
      "📊 SubscriptionStatus: Todos los pagos:",
      payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        payment_type: p.payment_type,
        status: p.status,
        paid_at: p.paid_at,
        created_at: p.created_at,
      }))
    );

    // Filtrar solo pagos exitosos (suscripciones Y pagos únicos)
    const successfulPayments = payments.filter((p) => {
      const isSucceeded = p.status === "succeeded";
      
      if (!isSucceeded) {
        console.log(`📊 SubscriptionStatus: Pago ${p.id} filtrado por status:`, {
          payment_type: p.payment_type,
          status: p.status,
        });
      }

      return isSucceeded;
    });

    if (successfulPayments.length === 0) {
      console.log(
        "📊 SubscriptionStatus: No hay pagos exitosos"
      );
      return null;
    }

    // Separar suscripciones de pagos únicos
    const subscriptionPayments = successfulPayments.filter(p => p.payment_type === "subscription");
    const oneTimePayments = successfulPayments.filter(p => p.payment_type === "one-time");

    console.log(
      `📊 SubscriptionStatus: ${subscriptionPayments.length} suscripciones, ${oneTimePayments.length} pagos únicos`
    );

    // Ordenar por fecha de pago (más reciente primero)
    const sortPayments = (paymentsToSort: Payment[]) => {
      return [...paymentsToSort].sort((a, b) => {
        const dateA = a.paid_at || a.created_at;
        const dateB = b.paid_at || b.created_at;

        const dateAObj = new Date(dateA);
        const dateBObj = new Date(dateB);

        if (isNaN(dateAObj.getTime()) || isNaN(dateBObj.getTime())) {
          console.error("📊 SubscriptionStatus: Fecha inválida encontrada:", {
            a: { date: dateA, paid_at: a.paid_at, created_at: a.created_at },
            b: { date: dateB, paid_at: b.paid_at, created_at: b.created_at },
          });
        }

        const timestampA = dateAObj.getTime();
        const timestampB = dateBObj.getTime();

        if (timestampA === timestampB) {
          const createdA = new Date(a.created_at).getTime();
          const createdB = new Date(b.created_at).getTime();
          return createdB - createdA;
        }

        return timestampB - timestampA;
      });
    };

    const sortedSubscriptions = sortPayments(subscriptionPayments);
    const sortedOneTime = sortPayments(oneTimePayments);

    // Priorizar suscripciones activas
    // Si hay una suscripción activa, mostrarla
    // Si no, mostrar la suscripción más reciente (aunque esté expirada)
    // Si no hay suscripciones, mostrar el pago único más reciente
    
    let lastPayment: Payment | null = null;
    let paymentType: "subscription" | "one-time" = "subscription";

    if (sortedSubscriptions.length > 0) {
      // Buscar una suscripción activa
      const activeSubscription = sortedSubscriptions.find(p => {
        const paymentDate = new Date(getPaymentDate(p));
        const expirationDate = getExpirationDate(paymentDate);
        return now <= expirationDate;
      });

      if (activeSubscription) {
        lastPayment = activeSubscription;
        console.log("📊 SubscriptionStatus: Suscripción activa encontrada");
      } else {
        // Si no hay activa, tomar la más reciente
        lastPayment = sortedSubscriptions[0];
        console.log("📊 SubscriptionStatus: Usando suscripción más reciente (expirada)");
      }
      paymentType = "subscription";
    } else if (sortedOneTime.length > 0) {
      // Si no hay suscripciones, mostrar el pago único más reciente
      lastPayment = sortedOneTime[0];
      paymentType = "one-time";
      console.log("📊 SubscriptionStatus: No hay suscripciones, usando pago único más reciente");
    }

    if (!lastPayment) {
      console.error("📊 SubscriptionStatus: No se encontró ningún pago");
      return null;
    }

    const paymentDate = new Date(getPaymentDate(lastPayment));
    const expirationDate = getExpirationDate(paymentDate);

    console.log("📊 SubscriptionStatus: Pago seleccionado:", {
      id: lastPayment.id,
      amount: lastPayment.amount,
      payment_type: lastPayment.payment_type,
      plan: getPlanName(lastPayment.amount),
      paymentDate: paymentDate.toISOString(),
      expirationDate: expirationDate.toISOString(),
      paid_at: lastPayment.paid_at,
      created_at: lastPayment.created_at,
    });

    // Verificar si está activa (no ha expirado)
    // Para pagos únicos, considerarlos como "no activos" (no son suscripciones recurrentes)
    const isActive = paymentType === "subscription" && now <= expirationDate;

    console.log("📊 SubscriptionStatus: Estado calculado:", {
      now: now.toISOString(),
      expirationDate: expirationDate.toISOString(),
      isActive,
      paymentType,
      daysRemaining: isActive
        ? Math.ceil(
            (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )
        : 0,
    });

    return {
      payment: lastPayment,
      paymentDate,
      expirationDate,
      isActive,
      paymentType,
      daysRemaining: isActive
        ? Math.ceil(
            (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )
        : 0,
    };
  }, [payments]); // Recalcular cuando cambien los pagos

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 mb-6">
        <div className="text-white">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <p className="text-green-50">Cargando estado de suscripción...</p>
          </div>
        </div>
      </div>
    );
  }

  const isActive = subscription && subscription.isActive;

  // Log final para debugging
  console.log("📊 SubscriptionStatus: Renderizando con:", {
    hasSubscription: !!subscription,
    isActive,
    subscriptionDetails: subscription
      ? {
          paymentId: subscription.payment.id,
          amount: subscription.payment.amount,
          plan: getPlanName(subscription.payment.amount),
          paymentDate: formatDate(subscription.paymentDate),
          expirationDate: formatDate(subscription.expirationDate),
          daysRemaining: subscription.daysRemaining,
        }
      : null,
  });

  // Determinar colores según el estado
  const backgroundColorClass = isActive
    ? "bg-gradient-to-r from-green-500 to-green-600"
    : subscription
    ? "bg-gradient-to-r from-red-600 to-red-700"
    : "bg-gradient-to-r from-gray-600 to-gray-700";

  const textLightClass = isActive ? "text-green-50" : "text-gray-100";

  return (
    <div className={`${backgroundColorClass} rounded-lg shadow-lg p-6 mb-6`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-white">
          {subscription && subscription.isActive ? (
            <div className={textLightClass}>
              <p className="text-2xl font-bold mb-2">
                {getPlanName(subscription.payment.amount)}
              </p>
              <p className="text-sm">
                Activada: {formatDate(subscription.paymentDate)} | Monto:{" "}
                {formatAmount(
                  subscription.payment.amount,
                  subscription.payment.currency
                )}
              </p>
              <p className="text-sm">
                Expira: {formatDate(subscription.expirationDate)} (
                {subscription.daysRemaining}{" "}
                {subscription.daysRemaining === 1 ? "día" : "días"} restantes)
              </p>
            </div>
          ) : subscription && !subscription.isActive ? (
            <div className={textLightClass}>
              <p className="text-2xl font-bold">Suscripción Expirada</p>
              <p className="text-sm">
                Última suscripción: {formatDate(subscription.paymentDate)} |
                Expiró: {formatDate(subscription.expirationDate)}
              </p>
            </div>
          ) : (
            <div className={textLightClass}>
              <p className="text-2xl font-bold">
                No tienes una suscripción activa
              </p>
            </div>
          )}
        </div>
        {subscription && subscription.isActive ? (
          <button
            disabled
            className="px-6 py-3 bg-white bg-opacity-50 text-white font-bold rounded-lg cursor-not-allowed opacity-50 shadow-md whitespace-nowrap"
          >
            Renovar Suscripción
          </button>
        ) : (
          <Link
            href="/suscripcion"
            className="px-6 py-3 bg-white text-gray-800 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
          >
            Activar Suscripción
          </Link>
        )}
      </div>
    </div>
  );
}

function DashboardContent({
  user,
  getUserName,
  getDisplayName,
  handleSignOut,
  responsivaStatus,
  loadingStatus,
  downloadResponsiva,
  editingField,
  setEditingField,
  editForm,
  setEditForm,
  handleEditSubmit,
  isSubmitting,
  submitError,
}: {
  user: {
    id: string;
    email?: string;
    role?: string;
    email_verified?: boolean;
  } | null;
  getUserName: () => string;
  getDisplayName: () => string;
  handleSignOut: () => Promise<void>;
  responsivaStatus: ResponsivaStatus | null;
  loadingStatus: boolean;
  downloadResponsiva: (responsivaId?: string) => Promise<void>;
  editingField: "nombre" | "email" | null;
  setEditingField: (field: "nombre" | "email" | null) => void;
  editForm: { nombre: string; email: string };
  setEditForm: (form: { nombre: string; email: string }) => void;
  handleEditSubmit: (
    e: React.FormEvent,
    field: "nombre" | "email"
  ) => Promise<void>;
  isSubmitting: boolean;
  submitError: string;
}) {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Bienvenido,{" "}
                <span className="text-red-600">{getDisplayName()}</span>!
              </h1>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Bloque de Suscripción */}
        <SubscriptionStatus />

        {/* Información del usuario */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-gray-800 p-8 mb-6 hover:shadow-2xl transition-all duration-300">
          <div className="mb-8">
            <h2 
              className="font-bold text-red-600 mb-1" 
              style={{ 
                fontSize: '2.25rem',
                fontWeight: '700',
                lineHeight: '1.2'
              }}
            >
              Mi Cuenta
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lado Izquierdo */}
            <div className="space-y-6">
              <div className="min-h-[72px]">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Nombre
                </label>
                {editingField !== "nombre" ? (
                  <div className="flex items-center gap-2">
                    <p className="text-lg text-white font-medium min-h-[40px] flex items-center flex-1">
                      {getUserName() || (
                        <span className="text-gray-400 italic">
                          No configurado
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() => setEditingField("nombre")}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Editar nombre"
                      type="button"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => handleEditSubmit(e, "nombre")}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      id="nombre"
                      value={editForm.nombre}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nombre: e.target.value })
                      }
                      className="flex-1 px-4 py-2 text-base border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="Ingresa tu nombre"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-gray-400 hover:text-green-500 transition-colors disabled:opacity-50"
                      title="Guardar nombre"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingField(null)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Cancelar"
                      disabled={isSubmitting}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </form>
                )}
              </div>

              <div className="min-h-[72px]">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  E-mail
                </label>
                {editingField !== "email" ? (
                  <div className="flex items-center gap-2">
                    <p className="text-lg text-white font-medium min-h-[40px] flex items-center flex-1">
                      {user?.email}
                    </p>
                    <button
                      onClick={() => setEditingField("email")}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Editar email"
                      type="button"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => handleEditSubmit(e, "email")}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="email"
                      id="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="flex-1 px-4 py-2 text-base border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="text-gray-400 hover:text-green-500 transition-colors disabled:opacity-50"
                      title="Guardar email"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingField(null)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Cancelar"
                      disabled={isSubmitting}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </form>
                )}
              </div>

              <div className="min-h-[72px]">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Rol
                </label>
                <p className="text-lg text-white font-medium capitalize min-h-[40px] flex items-center">
                  {user?.role}
                </p>
              </div>
            </div>

            {/* Lado Derecho */}
            <div className="space-y-3">
              {/* Sección de Responsiva */}
              {loadingStatus ? (
                <div className="min-h-[72px]">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    <p className="text-base text-gray-400">
                      Verificando estado...
                    </p>
                  </div>
                </div>
              ) : responsivaStatus?.isCompleted ? (
                <button
                  onClick={() =>
                    downloadResponsiva(responsivaStatus.responsiva?.id)
                  }
                  className="btn-slide-right inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gray-100 text-gray-900 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border border-gray-300 relative"
                  style={{ 
                    backgroundColor: '#f3f4f6',
                    minHeight: '44px'
                  }}
                  title="Descargar responsiva"
                  aria-label="Descargar responsiva"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 text-gray-900 relative z-10" />
                  <span className="text-gray-900 relative z-10">Responsiva completada</span>
                </button>
              ) : null}

              <Link
                href="/dashboard/change-password"
                className="btn-slide-right inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gray-100 text-gray-900 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border border-gray-300 relative"
              >
                <LockClosedIcon className="w-5 h-5 text-gray-900 relative z-10" />
                <span className="text-gray-900 relative z-10">Cambiar Contraseña</span>
              </Link>

              <Link
                href="/dashboard/payments"
                className="btn-slide-right inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gray-100 text-gray-900 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border border-gray-300 relative"
              >
                <ClockIcon className="w-5 h-5 text-gray-900 relative z-10" />
                <span className="text-gray-900 relative z-10">Historial de Pagos</span>
              </Link>

              <Link
                href="/suscripcion"
                className="btn-slide-right inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gray-100 text-gray-900 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg border border-gray-300 relative"
              >
                <CreditCardIcon className="w-5 h-5 text-gray-900 relative z-10" />
                <span className="text-gray-900 relative z-10">Hacer un Nuevo Pago</span>
              </Link>
            </div>
          </div>

          {submitError && editingField && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mt-4">
              <p className="text-red-200 text-sm font-medium">{submitError}</p>
            </div>
          )}
        </div>

        {/* Acciones disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Clases */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🥋 Mis Clases
            </h3>
            <p className="text-gray-600 mb-4">
              Consulta tu horario y progreso en las clases
            </p>
            <button
              disabled
              className="inline-block w-full text-center px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
            >
              Próximamente
            </button>
          </div>
        </div>

        {/* Mensaje de bienvenida */}
        {!user?.email_verified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Verifica tu email
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Por favor verifica tu dirección de email para acceder a
                    todas las funcionalidades. Revisa tu bandeja de entrada y
                    spam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
