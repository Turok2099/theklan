"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/AuthGuard";
import { useState, useEffect } from "react";
import { PencilIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import toast from "react-hot-toast";

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
  const [isEditing, setIsEditing] = useState(false);
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
    if (isEditing && user) {
      setEditForm({
        nombre: getUserName() || "",
        email: user.email || "",
      });
      setSubmitError("");
    }
  }, [isEditing, user]);

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
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const body: {
        email?: string;
        nombre?: string;
      } = {};

      if (editForm.email !== user?.email) {
        body.email = editForm.email;
      }

      if (editForm.nombre !== getUserName()) {
        body.nombre = editForm.nombre;
      }

      // Si no hay cambios, no hacer nada
      if (Object.keys(body).length === 0) {
        setIsEditing(false);
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

      setIsEditing(false);

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

          {/* Información del usuario */}
          <div className="bg-black rounded-lg shadow-lg p-6 mb-6">
            <div className="mb-6">
              <h2
                className="mb-0"
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "700",
                  color: "#dc2626",
                  lineHeight: "1.2",
                  fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
                }}
              >
                Información de tu cuenta
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lado Izquierdo */}
              <div className="space-y-6">
                <div className="min-h-[72px]">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre
                  </label>
                  {!isEditing ? (
                    <p className="text-base text-white min-h-[40px] flex items-center">
                      {getUserName() || (
                        <span className="text-gray-400 italic">
                          No configurado
                        </span>
                      )}
                    </p>
                  ) : (
                    <input
                      type="text"
                      id="nombre"
                      value={editForm.nombre}
                      onChange={(e) =>
                        setEditForm({ ...editForm, nombre: e.target.value })
                      }
                      className="w-full px-4 py-2 text-base border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="Ingresa tu nombre"
                    />
                  )}
                </div>

                <div className="min-h-[72px]">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-mail
                  </label>
                  {!isEditing ? (
                    <p className="text-base text-white min-h-[40px] flex items-center">
                      {user?.email}
                    </p>
                  ) : (
                    <input
                      type="email"
                      id="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full px-4 py-2 text-base border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      required
                    />
                  )}
                </div>

                <div className="min-h-[72px]">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rol
                  </label>
                  <p className="text-base text-white capitalize min-h-[40px] flex items-center">
                    {user?.role}
                  </p>
                </div>
              </div>

              {/* Lado Derecho */}
              <div className="space-y-6">
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
                  <div className="min-h-[72px]">
                    <div className="flex items-center gap-2">
                      <p className="text-base text-green-400 font-medium">
                        Responsiva completada
                      </p>
                      <button
                        onClick={() =>
                          downloadResponsiva(responsivaStatus.responsiva?.id)
                        }
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-800 hover:border-gray-500 transition-colors"
                        title="Descargar responsiva"
                        aria-label="Descargar responsiva"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="min-h-[72px]">
                  <Link
                    href="/dashboard/change-password"
                    className="inline-block px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cambiar Contraseña
                  </Link>
                </div>
              </div>
            </div>

            {submitError && isEditing && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4 mt-4">
                <p className="text-red-200 text-sm font-medium">
                  {submitError}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <PencilIcon className="w-4 h-4" />
                  Editar
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setSubmitError("");
                      setEditForm({
                        nombre: getUserName() || "",
                        email: user?.email || "",
                      });
                    }}
                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <form onSubmit={handleEditSubmit} className="inline-block">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Guardando...
                        </>
                      ) : (
                        "Guardar Cambios"
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
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
    </ProtectedRoute>
  );
}
