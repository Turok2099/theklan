"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/AuthGuard";
import { useState, useEffect } from "react";

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
  const { user, signOut } = useAuth();
  const [responsivaStatus, setResponsivaStatus] =
    useState<ResponsivaStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

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

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  ¡Bienvenido, {user?.email}!
                </h1>
                <p className="text-gray-600">
                  Panel de control de The Klan BJJ
                </p>
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información de tu cuenta
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <p className="text-gray-900 capitalize">{user?.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado de verificación
                </label>
                <div className="flex items-center space-x-3">
                  <p
                    className={`${
                      user?.email_verified ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {user?.email_verified ? "Verificado" : "No verificado"}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Último acceso
                </label>
                <p className="text-gray-900">
                  {user?.last_login
                    ? new Date(user.last_login).toLocaleString("es-MX")
                    : "Primera vez"}
                </p>
              </div>
            </div>
          </div>

          {/* Acciones disponibles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Responsiva */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📋 Responsiva
              </h3>

              {loadingStatus ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Verificando estado...</p>
                </div>
              ) : responsivaStatus?.isCompleted ? (
                <div>
                  <p className="text-green-600 mb-4 font-medium">
                    ✅ Responsiva completada
                  </p>
                  <p className="text-gray-600 mb-4 text-sm">
                    {responsivaStatus.isSigned ? (
                      <>
                        Fecha de firma:{" "}
                        {responsivaStatus.responsiva?.fechaFirma
                          ? new Date(
                              responsivaStatus.responsiva.fechaFirma
                            ).toLocaleDateString("es-MX")
                          : "No disponible"}
                      </>
                    ) : (
                      "Términos y condiciones aceptados (firma digital opcional)"
                    )}
                  </p>
                  <button
                    onClick={() =>
                      downloadResponsiva(responsivaStatus.responsiva?.id)
                    }
                    className="inline-block w-full text-center px-4 py-2 rounded-lg transition-colors font-semibold"
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#2563eb",
                      padding: "0.75rem 1.5rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1d4ed8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#2563eb";
                    }}
                  >
                    📄 Descargar PDF
                  </button>
                </div>
              ) : responsivaStatus?.hasResponsiva ? (
                <div>
                  <p className="text-yellow-600 mb-4 font-medium">
                    ⚠️ Responsiva pendiente de completar
                  </p>
                  <p className="text-gray-600 mb-4 text-sm">
                    Creada el:{" "}
                    {responsivaStatus.responsiva?.fechaCreacion
                      ? new Date(
                          responsivaStatus.responsiva.fechaCreacion
                        ).toLocaleDateString("es-MX")
                      : "No disponible"}
                  </p>
                  <a
                    href={user?.email_verified ? "/responsiva" : "#"}
                    className={`inline-block w-full text-center px-4 py-2 rounded-lg transition-colors ${
                      user?.email_verified
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-400 text-gray-600 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (!user?.email_verified) {
                        e.preventDefault();
                        alert(
                          "Debes verificar tu email antes de completar la responsiva. Revisa tu correo o haz clic en 'Reenviar'."
                        );
                      }
                    }}
                  >
                    Completar Responsiva
                  </a>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Completa tu responsiva de inscripción para comenzar tus
                    clases
                  </p>
                  <a
                    href={user?.email_verified ? "/responsiva" : "#"}
                    className={`inline-block w-full text-center px-4 py-2 rounded-lg transition-colors ${
                      user?.email_verified
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-400 text-gray-600 cursor-not-allowed"
                    }`}
                    onClick={(e) => {
                      if (!user?.email_verified) {
                        e.preventDefault();
                        alert(
                          "Debes verificar tu email antes de llenar la responsiva. Revisa tu correo o haz clic en 'Reenviar'."
                        );
                      }
                    }}
                  >
                    Llenar Responsiva
                  </a>
                </div>
              )}
            </div>

            {/* Perfil */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                👤 Perfil
              </h3>
              <p className="text-gray-600 mb-4">
                Actualiza tu información personal y preferencias
              </p>
              <button
                disabled
                className="inline-block w-full text-center px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
              >
                Próximamente
              </button>
            </div>

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
