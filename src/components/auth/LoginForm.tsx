"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormType } from "@/lib/auth-validations";
import { createClient } from "@/lib/supabase-auth";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormType) => {
    console.log("🚀 Iniciando login...");
    console.log("📋 Datos recibidos:", { email: data.email });

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const supabase = createClient();

      // Iniciar sesión con Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        console.error("❌ Error en login:", authError);

        // Detectar si el error es por email no confirmado
        if (
          authError.message.includes("email not confirmed") ||
          authError.message.includes("Email not confirmed")
        ) {
          setUserEmail(data.email);
          setShowResendButton(true);
          setSubmitError(
            "Tu email no ha sido confirmado. Haz clic en 'Reenviar confirmación' para recibir un nuevo correo."
          );
        } else {
          throw new Error(authError.message);
        }
        return;
      }

      if (authData.user) {
        console.log("✅ Usuario logueado exitosamente");
        console.log("✅ Datos del usuario:", {
          id: authData.user.id,
          email: authData.user.email,
          email_confirmed_at: authData.user.email_confirmed_at,
          confirmed_at: authData.user.confirmed_at,
          last_sign_in_at: authData.user.last_sign_in_at,
        });

        // Redirigir al dashboard usando window.location para evitar conflictos con middleware
        console.log("🔄 Redirigiendo al dashboard...");

        // Usar window.location.href para forzar una navegación completa
        // Esto evita conflictos con el middleware y AuthContext
        window.location.href = "/dashboard";

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setSubmitError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!userEmail) return;

    setIsResending(true);
    try {
      console.log("📧 Reenviando correo de confirmación...");

      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Correo reenviado exitosamente");
        const attemptsRemaining = data.attemptsRemaining || 0;
        setSubmitError(
          `Correo de confirmación reenviado. Revisa tu bandeja de entrada y spam. Intentos restantes: ${attemptsRemaining}`
        );
        setShowResendButton(false);
      } else if (response.status === 429) {
        // Límite alcanzado
        console.error("❌ Límite de reenvíos alcanzado:", data.message);
        setSubmitError(`⚠️ ${data.message}`);
        setShowResendButton(false);
      } else {
        console.error("❌ Error reenviando correo:", data.error);
        setSubmitError(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("❌ Error en reenvío:", error);
      setSubmitError("Error al reenviar el correo. Intenta de nuevo.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <p className="text-gray-600">Accede a tu cuenta de The Klan BJJ</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-red-600 mb-2"
          >
            Correo Electrónico *
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
            placeholder="tu@email.com"
          />
          {errors.email && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
              <p className="text-red-800 text-sm font-medium">
                {errors.email.message}
              </p>
            </div>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-red-600 mb-2"
          >
            Contraseña *
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="current-password"
              className="w-full px-4 py-3 pr-12 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
              placeholder="Tu contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
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
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
              <p className="text-red-800 text-sm font-medium">
                {errors.password.message}
              </p>
            </div>
          )}
        </div>

        {/* Error general */}
        {submitError && (
          <div className="p-4 border rounded-lg bg-red-50 border-red-200">
            <p className="text-sm font-medium text-red-800">
              {submitError}
            </p>
            {showResendButton && (
              <button
                type="button"
                onClick={handleResendConfirmation}
                disabled={isResending}
                className="mt-3 px-4 py-2 bg-red-600 text-black font-bold rounded-lg hover:bg-red-700 transition-colors disabled:cursor-not-allowed disabled:bg-gray-400 text-sm"
                style={{
                  backgroundColor: "#dc2626", // red-600
                  color: "#000000", // black
                  fontWeight: "700",
                  fontSize: "0.875rem",
                  padding: "0.5rem 1rem",
                }}
                onMouseEnter={(e) => {
                  if (!isResending) {
                    e.currentTarget.style.backgroundColor = "#b91c1c"; // red-700
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isResending) {
                    e.currentTarget.style.backgroundColor = "#dc2626"; // red-600
                  }
                }}
              >
                {isResending ? "Enviando..." : "Reenviar confirmación"}
              </button>
            )}
          </div>
        )}

        {/* Botón de envío y enlace de recuperación */}
        <div className="flex justify-between items-center">
          <a
            href="/auth/forgot-password"
            className="text-red-800 hover:text-red-900 font-semibold text-sm"
            style={{
              color: "#991b1b", // red-800
              fontWeight: "600",
              fontSize: "0.875rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#7f1d1d"; // red-900
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#991b1b"; // red-800
            }}
          >
            ¿Olvidaste tu contraseña?
          </a>
          <button
            type="submit"
            disabled={isSubmitting}
            className="font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed text-sm shadow-lg"
            style={{
              color: "#ffffff",
              backgroundColor: isSubmitting ? "#9ca3af" : "#000000",
              padding: "0.75rem 1.5rem",
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
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                Iniciando...
              </div>
            ) : (
              "INICIAR SESIÓN"
            )}
          </button>
        </div>
      </form>

      {/* Enlaces adicionales */}
      <div className="mt-6 text-center">
        <button
          onClick={() => (window.location.href = "/auth/register")}
          className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg"
          style={{
            backgroundColor: "#dc2626", // red-600
            color: "#ffffff", // white
            fontWeight: "700",
            fontSize: "1rem",
            padding: "0.75rem 1.5rem",
            width: "100%",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#b91c1c"; // red-700
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#dc2626"; // red-600
          }}
        >
          ¿NO TIENES CUENTA? REGÍSTRATE AQUÍ
        </button>
      </div>
    </div>
  );
};
