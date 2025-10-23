"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { createClient } from "@/lib/supabase-auth";
import { User as CustomUser } from "@/types/auth";

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const supabase = createClient();
  const lastRefreshRef = useRef<number>(0);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const refreshUser = useCallback(
    async (force = false) => {
      const now = Date.now();

      // Evitar llamadas simultáneas
      if (isRefreshing && !force) {
        console.log("⏳ AuthContext: Refresh ya en progreso, omitiendo...");
        return;
      }

      // Debounce: evitar refreshes muy frecuentes (menos de 2 segundos)
      if (!force && now - lastRefreshRef.current < 2000) {
        console.log("⏳ AuthContext: Refresh muy reciente, omitiendo...");
        return;
      }

      setIsRefreshing(true);
      lastRefreshRef.current = now;

      try {
        console.log("🔄 AuthContext: Iniciando refresh de usuario...");

        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error(
            "❌ AuthContext: Error obteniendo usuario auth:",
            authError
          );
          setUser(null);
          return;
        }

        if (authUser) {
          console.log(
            "👤 AuthContext: Usuario auth encontrado:",
            authUser.email
          );

          // Consultar solo el estado de verificación de la tabla personalizada
          try {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("email_verified")
              .eq("id", authUser.id)
              .single();

            if (userError) {
              console.error("❌ AuthContext: Error obteniendo estado de verificación:", userError);
              throw userError;
            }

            const emailVerified = userData?.email_verified ?? false;

            console.log("✅ AuthContext: Estado de verificación obtenido:", emailVerified);

            setUser({
              id: authUser.id,
              email: authUser.email || "",
              email_verified: emailVerified, // Usar el estado de tu tabla personalizada
              role: "student",
              is_active: true,
              created_at: authUser.created_at || new Date().toISOString(),
              updated_at: authUser.updated_at || new Date().toISOString(),
              last_login: undefined,
              profile_data: undefined,
            });
          } catch (error) {
            console.error("❌ AuthContext: Error obteniendo estado de verificación:", error);
            // Fallback usando auth.users
            setUser({
              id: authUser.id,
              email: authUser.email || "",
              email_verified: !!authUser.email_confirmed_at,
              role: "student",
              is_active: true,
              created_at: authUser.created_at || new Date().toISOString(),
              updated_at: authUser.updated_at || new Date().toISOString(),
              last_login: undefined,
              profile_data: undefined,
            });
          }
        } else {
          console.log("👤 AuthContext: No hay usuario autenticado");
          setUser(null);
        }
      } catch (error) {
        console.error("❌ AuthContext: Error refrescando usuario:", error);
        setUser(null);
      } finally {
        setIsRefreshing(false);
        setLoading(false);
      }
    },
    [isRefreshing, supabase]
  );

  const signOut = useCallback(async () => {
    try {
      console.log("🔐 AuthContext: Ejecutando signOut de Supabase...");

      // Limpiar timeouts pendientes
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("❌ AuthContext: Error en signOut de Supabase:", error);
        throw error;
      }

      console.log("✅ AuthContext: SignOut de Supabase exitoso");
      setUser(null);
      setIsRefreshing(false);
      setLoading(false);
      console.log("✅ AuthContext: Usuario limpiado del estado");
    } catch (error) {
      console.error("❌ AuthContext: Error cerrando sesión:", error);
      throw error;
    }
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      console.log("🚀 AuthContext: Inicializando autenticación...");

      // Obtener sesión inicial
      await refreshUser(true);

      if (!mounted) return;

      // Escuchar cambios en la autenticación
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(
          "🔔 AuthContext: Auth state changed:",
          event,
          session?.user?.email
        );

        if (!mounted) return;

        switch (event) {
          case "SIGNED_IN":
            if (session?.user) {
              console.log("✅ AuthContext: Usuario firmó sesión");
              // Usar timeout para evitar race conditions
              refreshTimeoutRef.current = setTimeout(() => {
                refreshUser(true);
              }, 100);
            }
            break;

          case "SIGNED_OUT":
            console.log("🚪 AuthContext: Usuario cerró sesión");
            setUser(null);
            setIsRefreshing(false);
            setLoading(false);
            break;

          case "TOKEN_REFRESHED":
            if (session?.user) {
              console.log("🔄 AuthContext: Token refrescado");
              // Solo refrescar si realmente cambió algo importante
              refreshTimeoutRef.current = setTimeout(() => {
                refreshUser(true);
              }, 200);
            }
            break;

          case "INITIAL_SESSION":
            console.log("🎯 AuthContext: Sesión inicial procesada");
            // No hacer nada adicional, ya se manejó en initializeAuth
            break;

          default:
            console.log("ℹ️ AuthContext: Evento no manejado:", event);
        }
      });

      return () => {
        console.log("🧹 AuthContext: Limpiando subscription");
        subscription.unsubscribe();
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
      };
    };

    const cleanup = initializeAuth();

    return () => {
      mounted = false;
      cleanup.then((cleanupFn) => cleanupFn?.());
    };
  }, [refreshUser, supabase]);

  const value = {
    user,
    loading,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
