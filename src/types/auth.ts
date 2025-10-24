// Tipos para el sistema de autenticación

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  role: "student" | "admin" | "coach";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  profile_data?: Record<string, unknown>;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

export interface EmailVerificationData {
  token: string;
  email: string;
}

// Estados de autenticación
export type AuthState = "loading" | "authenticated" | "unauthenticated";

// Roles de usuario
export const USER_ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
  COACH: "coach",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Configuración de autenticación
export const AUTH_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TOKEN_EXPIRY_HOURS: 24,
  MAX_LOGIN_ATTEMPTS: 5,
} as const;
