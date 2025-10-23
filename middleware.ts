import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    // Obtener la sesión actual
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log(
      "🔐 Middleware: Verificando sesión para",
      request.nextUrl.pathname
    );

    if (sessionError) {
      console.error("❌ Middleware: Error obteniendo sesión:", sessionError);
      return response;
    }

    // Si hay sesión, verificar si el token está próximo a expirar
    if (session?.expires_at) {
      const now = Date.now() / 1000;
      const expiresAt = session.expires_at;
      const timeUntilExpiry = expiresAt - now;

      console.log(
        `⏰ Middleware: Token expira en ${Math.round(timeUntilExpiry)} segundos`
      );

      // Si el token expira en menos de 5 minutos, refrescarlo
      if (timeUntilExpiry < 300) {
        console.log("🔄 Middleware: Refrescando token próximo a expirar");

        const {
          data: { session: refreshedSession },
          error: refreshError,
        } = await supabase.auth.refreshSession();

        if (refreshError) {
          console.error(
            "❌ Middleware: Error refrescando sesión:",
            refreshError
          );
        } else if (refreshedSession) {
          console.log("✅ Middleware: Token refrescado exitosamente");
        }
      }
    }

    // Proteger rutas que requieren autenticación
    const protectedRoutes = ["/dashboard", "/responsiva"];
    const authRoutes = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
    ];

    const isProtectedRoute = protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );

    // Si es una ruta protegida y no hay sesión, redirigir al login
    if (isProtectedRoute && !session) {
      console.log("🔒 Middleware: Redirigiendo a login desde ruta protegida");
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Si es una ruta de auth y hay sesión, redirigir al dashboard
    if (isAuthRoute && session) {
      console.log(
        "✅ Middleware: Redirigiendo al dashboard desde ruta de auth"
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    console.log("✅ Middleware: Acceso permitido a", request.nextUrl.pathname);
  } catch (error) {
    console.error("❌ Middleware: Error general:", error);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
