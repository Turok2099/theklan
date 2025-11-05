"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuscripcionReturnPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="container mx-auto max-w-2xl">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando…</p>
            </div>
          </div>
        </main>
      }
    >
      <ReturnContent />
    </Suspense>
  );
}

function ReturnContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch(
          `/api/stripe/verify-session?session_id=${sessionId}`
        );

        if (!response.ok) {
          setStatus("error");
          return;
        }

        const data = await response.json();

        if (data.status === "complete") {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        setStatus("error");
      }
    };

    verifySession();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando tu suscripción...</p>
          </div>
        </div>
      </main>
    );
  }

  if (status === "success") {
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Suscripción Exitosa!
              </h1>
              <p className="text-gray-600">
                Tu suscripción mensual ha sido activada correctamente.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
              >
                Ir al Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg
                className="h-8 w-8 text-red-600"
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Error en la Suscripción
            </h1>
            <p className="text-gray-600">
              Hubo un problema al procesar tu suscripción. Por favor, intenta de
              nuevo.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/suscripcion"
              className="inline-block px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              Intentar de Nuevo
            </Link>
            <Link
              href="/dashboard"
              className="block text-gray-600 hover:text-gray-900"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

