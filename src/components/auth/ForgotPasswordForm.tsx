"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordResetSchema, PasswordResetType } from "@/lib/auth-validations";
import { createClient } from "@/lib/supabase-auth";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const ForgotPasswordForm = ({
  onSuccess,
  onError,
}: ForgotPasswordFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordResetType>({
    resolver: zodResolver(passwordResetSchema),
  });

  const onSubmit = async (data: PasswordResetType) => {
    console.log("🚀 Iniciando recuperación de contraseña...");
    console.log("📋 Email:", data.email);

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const supabase = createClient();

      // Enviar email de recuperación
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error("❌ Error enviando email de recuperación:", error);
        throw new Error(error.message);
      }

      console.log("✅ Email de recuperación enviado exitosamente");
      setSubmitSuccess(true);
      reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("❌ Error en recuperación:", error);
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

  if (submitSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
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
            ¡Email Enviado!
          </h2>
          <p className="text-gray-600 mb-6">
            Te hemos enviado un enlace para restablecer tu contraseña a tu
            correo electrónico. Por favor revisa tu bandeja de entrada y sigue
            las instrucciones.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Nota:</strong> Si no ves el email, revisa tu carpeta de
              spam. El enlace expira en 1 hora.
            </p>
          </div>
          <div className="space-y-3">
            <a
              href="/auth/login"
              className="inline-block w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Volver al Login
            </a>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="inline-block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Enviar Otro Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Recuperar Contraseña
        </h2>
        <p className="text-gray-600">
          Ingresa tu email y te enviaremos un enlace para restablecer tu
          contraseña
        </p>
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

        {/* Error general */}
        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{submitError}</p>
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
                Enviando...
              </div>
            ) : (
              "ENVIAR ENLACE"
            )}
          </button>
        </div>
      </form>

      {/* Enlaces adicionales */}
      <div className="mt-6 text-center space-y-2">
        <p className="text-gray-600">
          ¿Recordaste tu contraseña?{" "}
          <a
            href="/auth/login"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Inicia sesión aquí
          </a>
        </p>
        <p className="text-gray-600">
          ¿No tienes cuenta?{" "}
          <a
            href="/auth/register"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};
