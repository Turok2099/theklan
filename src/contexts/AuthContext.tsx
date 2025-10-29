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
  const isRefreshingRef = useRef(false);

  // Unificar cliente Supabase para evitar re-creación
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  const lastRefreshRef = useRef<number>(0);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const refreshUser = useCallback(
    async (force = false) => {
      const now = Date.now();

      // Evitar llamadas simultáneas
      if (isRefreshingRef.current && !force) {
        console.log("⏳ AuthContext: Refresh ya en progreso, omitiendo...");
        return;
      }

      // Debounce: evitar refreshes muy frecuentes (menos de 2 segundos)
      if (!force && now - lastRefreshRef.current < 2000) {
        console.log("⏳ AuthContext: Refresh muy reciente, omitiendo...");
        return;
      }

      isRefreshingRef.current = true;
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

          // Obtener información adicional de la tabla users
          try {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("*")
              .eq("id", authUser.id)
              .single();

            if (userError) {
              console.warn(
                "⚠️ AuthContext: Error obteniendo datos de usuario:",
                userError.message
              );
              // Si no hay datos en la tabla users, usar valores por defecto
              setUser({
                id: authUser.id,
                email: authUser.email || "",
                email_verified: !!authUser.email_confirmed_at,
                role: "student", // Valor por defecto
                is_active: true,
                created_at: authUser.created_at || new Date().toISOString(),
                updated_at: authUser.updated_at || new Date().toISOString(),
                last_login: undefined,
                profile_data: undefined,
              });
            } else {
              console.log(
                "✅ AuthContext: Datos de usuario obtenidos:",
                userData.role
              );
              setUser({
                id: userData.id,
                email: userData.email,
                email_verified: !!authUser.email_confirmed_at,
                role: userData.role as "student" | "admin" | "coach",
                is_active: userData.is_active,
                created_at: userData.created_at,
                updated_at: userData.updated_at,
                last_login: userData.last_login,
                profile_data: userData.profile_data,
              });
            }
          } catch (error) {
            console.error(
              "❌ AuthContext: Error consultando tabla users:",
              error
            );
            // Fallback a valores por defecto
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
        isRefreshingRef.current = false;
        setLoading(false);
        console.log("🏁 AuthContext: Refresh completado, loading: false");
      }
    },
    [supabase] // Remover isRefreshing de las dependencias para evitar loop infinito
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
      isRefreshingRef.current = false;
      setLoading(false);
      console.log("✅ AuthContext: Usuario limpiado del estado");
    } catch (error) {
      console.error("❌ AuthContext: Error cerrando sesión:", error);
      throw error;
    }
  }, [supabase]);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🚀 AuthContext: Inicializando autenticación...");

      // Obtener sesión inicial
      await refreshUser(true);

      if (!mountedRef.current) return;

      // Escuchar cambios en la autenticación con mejor manejo de race conditions
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(
          "🔔 AuthContext: Auth state changed:",
          event,
          session?.user?.email
        );

        // Verificar que el componente sigue montado
        if (!mountedRef.current) return;

        // Limpiar timeout anterior para evitar acumulación
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
          refreshTimeoutRef.current = null;
        }

        switch (event) {
          case "SIGNED_IN":
            if (session?.user) {
              console.log("✅ AuthContext: Usuario firmó sesión");
              // Usar timeout más corto para respuesta más rápida
              refreshTimeoutRef.current = setTimeout(() => {
                if (mountedRef.current) {
                  refreshUser(true);
                }
              }, 50);
            }
            break;

          case "SIGNED_OUT":
            console.log("🚪 AuthContext: Usuario cerró sesión");
            if (mountedRef.current) {
              setUser(null);
              isRefreshingRef.current = false;
              setLoading(false);
            }
            break;

          case "TOKEN_REFRESHED":
            if (session?.user) {
              console.log("🔄 AuthContext: Token refrescado");
              // Solo refrescar si realmente cambió algo importante
              refreshTimeoutRef.current = setTimeout(() => {
                if (mountedRef.current) {
                  refreshUser(true);
                }
              }, 100);
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

    initializeAuth();

    // Cleanup al desmontar
    return () => {
      mountedRef.current = false;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [refreshUser, supabase]);

  const value = {
    user,
    loading,
    signOut,
    refreshUser,
  };

  // Debug log del estado del AuthContext
  console.log("🔍 AuthContext State:", {
    user: user ? { id: user.id, email: user.email } : null,
    loading,
    isRefreshing: isRefreshingRef.current,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
