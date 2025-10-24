"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-auth";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // PRIMERO: Verificar si ya hay una sesión activa
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData.session) {
          console.log(
            "✅ Sesión ya activa detectada:",
            sessionData.session.user.email
          );
          setStatus("success");
          setMessage("¡Email ya verificado! Redirigiendo al dashboard...");

          // Redirigir directamente al dashboard
          setTimeout(() => {
            console.log("🔄 Redirigiendo al dashboard...");
            router.push("/dashboard");
          }, 1500);
          return;
        }

        const token = searchParams.get("token");
        const type = searchParams.get("type");

        console.log("🔍 DEBUG - Verificación de email iniciada");
        console.log("🔍 DEBUG - Token:", token ? "Presente" : "Ausente");
        console.log("🔍 DEBUG - Type:", type);
        console.log("🔍 DEBUG - URL completa:", window.location.href);

        if (type === "signup" && token) {
          console.log("🔍 DEBUG - Iniciando verificación OTP...");

          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email",
          });

          console.log("🔍 DEBUG - Resultado de verifyOtp:");
          console.log("🔍 DEBUG - Data:", data);
          console.log("🔍 DEBUG - Error:", error);

          // SOLUCIÓN MEJORADA: Verificar si el usuario quedó verificado, incluso si hay error
          let isActuallyVerified = false;
          let userEmail = "";

          // Verificar si hay sesión activa (usuario logueado automáticamente)
          if (data.session) {
            console.log("✅ Sesión activa creada automáticamente");
            isActuallyVerified = true;
            userEmail = data.session.user.email || "";
          }

          // Si no hay sesión, verificar el estado del usuario directamente
          if (!isActuallyVerified) {
            console.log("🔍 Verificando estado del usuario directamente...");
            const { data: userData } = await supabase.auth.getUser();

            if (userData.user?.email_confirmed_at) {
              console.log("✅ Usuario verificado directamente");
              isActuallyVerified = true;
              userEmail = userData.user.email || "";
            }
          }

          // Determinar el resultado basado en la verificación real
          if (isActuallyVerified) {
            console.log("✅ Email verificado exitosamente (a pesar del error)");
            console.log("✅ Usuario verificado:", {
              email: userEmail,
              verified: true,
            });

            setStatus("success");
            setMessage(
              "¡Email verificado exitosamente! Redirigiendo al dashboard..."
            );

            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
              console.log("🔄 Redirigiendo al dashboard...");
              router.push("/dashboard");
            }, 2000);
          } else if (error) {
            console.error("❌ Error real verificando email:", error);
            console.error("❌ Detalles del error:", {
              message: error.message,
              status: error.status,
              code: error.code,
            });
            setStatus("error");
            setMessage(
              "Error al verificar el email. El enlace puede haber expirado."
            );
          } else {
            console.log("⚠️ No se recibió usuario en la respuesta");
            setStatus("error");
            setMessage(
              "Error inesperado: No se recibió información del usuario."
            );
          }
        } else {
          console.log("❌ Parámetros inválidos:");
          console.log("❌ Type:", type);
          console.log("❌ Token:", token ? "Presente" : "Ausente");
          setStatus("error");
          setMessage("Enlace de verificación inválido.");
        }
      } catch (error) {
        console.error("❌ Error en verificación:", error);
        console.error(
          "❌ Stack trace:",
          error instanceof Error ? error.stack : "No stack trace available"
        );
        setStatus("error");
        setMessage("Error inesperado al verificar el email.");
      }
    };

    verifyEmail();
  }, [searchParams, router, supabase]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg
                className="animate-spin h-6 w-6 text-blue-600"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verificando Email...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras verificamos tu email.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Email Verificado Exitosamente!
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                Serás redirigido automáticamente al dashboard en unos
                segundos...
              </p>
            </div>
            <div className="mt-6">
              <a
                href="/dashboard"
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Ir al Dashboard
              </a>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error de Verificación
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-4">
              <a
                href="/auth/register"
                className="block w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Intentar Registro Nuevamente
              </a>
              <a
                href="/auth/login"
                className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ir al Login
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg
                className="animate-spin h-6 w-6 text-blue-600"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cargando...
            </h2>
            <p className="text-gray-600">
              Preparando la verificación de email.
            </p>
          </div>
        </main>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
