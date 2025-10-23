"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormType } from "@/lib/auth-validations";
import { createClient } from "@/lib/supabase-auth";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();

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
        throw new Error(authError.message);
      }

      if (authData.user) {
        console.log("✅ Usuario logueado exitosamente");

        // Redirigir al dashboard o página principal
        router.push("/dashboard");

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
          <input
            {...register("password")}
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 bg-gray-50 text-gray-900 placeholder-gray-500"
            placeholder="Tu contraseña"
          />
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
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">{submitError}</p>
          </div>
        )}

        {/* Botón de envío y enlace de recuperación */}
        <div className="flex justify-between items-center">
          <a
            href="/auth/forgot-password"
            className="text-red-600 hover:text-red-700 font-semibold text-sm"
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
