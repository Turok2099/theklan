"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPasswordSchema, NewPasswordType } from "@/lib/auth-validations";
import { createClient } from "@/lib/supabase-auth";

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<NewPasswordType>({
    resolver: zodResolver(newPasswordSchema),
  });

  const password = watch("password");

  useEffect(() => {
    const verifySession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error verificando sesión:", error);
          setSubmitError(
            "Enlace inválido o expirado. Solicita un nuevo enlace de recuperación."
          );
          setIsValidSession(false);
        } else if (session) {
          console.log("Sesión válida para reset de contraseña");
          setIsValidSession(true);
        } else {
          console.log("No hay sesión válida");
          setSubmitError(
            "Enlace inválido o expirado. Solicita un nuevo enlace de recuperación."
          );
          setIsValidSession(false);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        setSubmitError("Error verificando el enlace. Intenta nuevamente.");
        setIsValidSession(false);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [supabase]);

  const onSubmit = async (data: NewPasswordType) => {
    console.log("🚀 Actualizando contraseña...");

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        console.error("❌ Error actualizando contraseña:", error);
        throw new Error(error.message);
      }

      console.log("✅ Contraseña actualizada exitosamente");
      setSubmitSuccess(true);
      reset();

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      console.error("❌ Error en actualización:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando enlace...</p>
        </div>
      </main>
    );
  }

  if (!isValidSession) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
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
            Enlace Inválido
          </h2>
          <p className="text-gray-600 mb-6">{submitError}</p>
          <div className="space-y-3">
            <a
              href="/auth/forgot-password"
              className="inline-block w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Solicitar Nuevo Enlace
            </a>
            <a
              href="/auth/login"
              className="inline-block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver al Login
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (submitSuccess) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
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
            ¡Contraseña Actualizada!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu contraseña ha sido actualizada exitosamente. Serás redirigido al
            login en unos segundos.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
          </div>
          <div className="mt-6">
            <a
              href="/auth/login"
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Ir al Login
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Nueva Contraseña
            </h2>
            <p className="text-gray-600">
              Ingresa tu nueva contraseña para completar el proceso
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nueva Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-red-600 mb-2"
              >
                Nueva Contraseña *
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
                placeholder="Mínimo 8 caracteres"
              />
              {errors.password && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                  <p className="text-red-800 text-sm font-medium">
                    {errors.password.message}
                  </p>
                </div>
              )}

              {/* Indicador de fortaleza de contraseña */}
              {password && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600 mb-1">Requisitos:</div>
                  <div className="space-y-1">
                    <div
                      className={`text-xs ${
                        password.length >= 8
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      ✓ Mínimo 8 caracteres
                    </div>
                    <div
                      className={`text-xs ${
                        /[a-z]/.test(password)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      ✓ Una letra minúscula
                    </div>
                    <div
                      className={`text-xs ${
                        /[A-Z]/.test(password)
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      ✓ Una letra mayúscula
                    </div>
                    <div
                      className={`text-xs ${
                        /\d/.test(password) ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      ✓ Un número
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-red-600 mb-2"
              >
                Confirmar Nueva Contraseña *
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
                placeholder="Repite tu nueva contraseña"
              />
              {errors.confirmPassword && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                  <p className="text-red-800 text-sm font-medium">
                    {errors.confirmPassword.message}
                  </p>
                </div>
              )}
            </div>

            {/* Error general */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">
                  {submitError}
                </p>
              </div>
            )}

            {/* Botón de envío */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="font-semibold py-4 px-8 rounded-lg transition-colors disabled:cursor-not-allowed text-base shadow-lg"
                style={{
                  color: "#ffffff",
                  backgroundColor: isSubmitting ? "#9ca3af" : "#000000",
                  padding: "1rem 2rem",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = "#dc2626";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = "#000000";
                  }
                }}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      style={{ color: "#ffffff" }}
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
                    Actualizando...
                  </div>
                ) : (
                  "ACTUALIZAR CONTRASEÑA"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
