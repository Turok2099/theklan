"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/AuthGuard";
import { createClient } from "@/lib/supabase-auth";
import Link from "next/link";

export default function CambiarContraseñaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<"verify" | "change">("verify");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validar contraseña actual
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setError("");

    if (!currentPassword) {
      setError("Por favor ingresa tu contraseña actual");
      setIsValidating(false);
      return;
    }

    try {
      // Verificar la contraseña intentando hacer signIn
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });

      if (signInError || !data.user) {
        setError("La contraseña actual es incorrecta");
        setIsValidating(false);
        return;
      }

      // Si la contraseña es correcta, pasar al siguiente paso
      setStep("change");
      setError("");
    } catch (error) {
      console.error("Error validando contraseña:", error);
      setError("Error al validar la contraseña. Intenta nuevamente.");
    } finally {
      setIsValidating(false);
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChanging(true);
    setError("");

    // Validaciones
    if (!newPassword) {
      setError("Por favor ingresa una nueva contraseña");
      setIsChanging(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setIsChanging(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsChanging(false);
      return;
    }

    if (newPassword === currentPassword) {
      setError("La nueva contraseña debe ser diferente a la actual");
      setIsChanging(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess(true);
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error al cambiar la contraseña. Intenta nuevamente."
      );
    } finally {
      setIsChanging(false);
    }
  };

  // Manejar "Olvidé mi contraseña"
  const handleForgotPassword = async () => {
    if (!user?.email) {
      setError("No se pudo obtener tu email");
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        user.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (resetError) {
        throw new Error(resetError.message);
      }

      setSuccess(true);
      setError("");
      alert(
        "Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada."
      );
    } catch (error) {
      console.error("Error enviando email de reset:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error al enviar el correo. Intenta nuevamente."
      );
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-red-600 hover:text-red-700 text-sm font-medium mb-4 inline-block"
            >
              ← Volver al Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cambiar Contraseña
            </h1>
          </div>

          {/* Mensaje de éxito */}
          {success && step === "change" && (
            <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-6">
              <p className="text-green-200 text-sm font-medium">
                ✅ Contraseña actualizada exitosamente. Redirigiendo...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-200 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-gray-800 p-8 hover:shadow-2xl transition-all duration-300">
            {step === "verify" ? (
              <form onSubmit={handleVerifyPassword} className="space-y-6">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2"
                  >
                    Contraseña Actual *
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-400"
                    placeholder="Ingresa tu contraseña actual"
                    required
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-red-600 hover:text-red-500 font-medium transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={isValidating}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
                  >
                    {isValidating ? (
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
                        Validando...
                      </>
                    ) : (
                      "Continuar"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-6">
                {/* Información */}
                <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-6">
                  <p className="text-blue-200 text-sm">
                    ✅ Contraseña actual verificada. Ingresa tu nueva contraseña.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2"
                  >
                    Nueva Contraseña *
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-400"
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                    autoFocus
                  />
                  <div className="mt-2 text-xs">
                    <p className="text-white mb-2">Requisitos de contraseña:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li
                        className={
                          newPassword.length >= 8 ? "text-green-400" : "text-white"
                        }
                      >
                        Mínimo 8 caracteres
                      </li>
                      <li
                        className={
                          /[a-z]/.test(newPassword) ? "text-green-400" : "text-white"
                        }
                      >
                        Una letra minúscula
                      </li>
                      <li
                        className={
                          /[A-Z]/.test(newPassword) ? "text-green-400" : "text-white"
                        }
                      >
                        Una letra mayúscula
                      </li>
                      <li
                        className={
                          /\d/.test(newPassword) ? "text-green-400" : "text-white"
                        }
                      >
                        Un número
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-2"
                  >
                    Confirmar Nueva Contraseña *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-400"
                    placeholder="Repite tu nueva contraseña"
                    required
                    minLength={8}
                  />
                  {confirmPassword &&
                    newPassword !== confirmPassword &&
                    confirmPassword.length > 0 && (
                      <p className="mt-2 text-sm text-red-600">
                        Las contraseñas no coinciden
                      </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("verify");
                      setNewPassword("");
                      setConfirmPassword("");
                      setError("");
                    }}
                    className="px-5 py-2.5 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold"
                    disabled={isChanging}
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={isChanging}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
                  >
                    {isChanging ? (
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
                        Cambiando...
                      </>
                    ) : (
                      "Cambiar Contraseña"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

