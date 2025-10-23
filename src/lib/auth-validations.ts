import { z } from "zod";
import { AUTH_CONFIG } from "@/types/auth";

// Esquema de validación para registro
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("Formato de email inválido")
      .max(255, "El email no puede exceder 255 caracteres")
      .regex(AUTH_CONFIG.EMAIL_REGEX, "Formato de email inválido"),

    password: z
      .string()
      .min(
        AUTH_CONFIG.PASSWORD_MIN_LENGTH,
        `La contraseña debe tener al menos ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} caracteres`
      )
      .max(100, "La contraseña no puede exceder 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número"
      ),

    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Esquema de validación para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido"),

  password: z.string().min(1, "La contraseña es requerida"),
});

// Esquema de validación para verificación de email
export const emailVerificationSchema = z.object({
  token: z
    .string()
    .min(1, "El token de verificación es requerido")
    .length(64, "Token de verificación inválido"),
});

// Esquema de validación para reset de contraseña
export const passwordResetSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Formato de email inválido"),
});

// Esquema de validación para nueva contraseña
export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        AUTH_CONFIG.PASSWORD_MIN_LENGTH,
        `La contraseña debe tener al menos ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} caracteres`
      )
      .max(100, "La contraseña no puede exceder 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número"
      ),

    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Tipos inferidos de los esquemas
export type RegisterFormType = z.infer<typeof registerSchema>;
export type LoginFormType = z.infer<typeof loginSchema>;
export type EmailVerificationType = z.infer<typeof emailVerificationSchema>;
export type PasswordResetType = z.infer<typeof passwordResetSchema>;
export type NewPasswordType = z.infer<typeof newPasswordSchema>;

// Funciones de validación adicionales
export const validatePasswordStrength = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(`Mínimo ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} caracteres`);
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Al menos una letra minúscula");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Al menos una letra mayúscula");
  }

  if (!/\d/.test(password)) {
    errors.push("Al menos un número");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Al menos un carácter especial");
  }

  return errors;
};

export const validateEmail = (email: string): boolean => {
  return AUTH_CONFIG.EMAIL_REGEX.test(email);
};
