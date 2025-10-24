import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// Cache simple en memoria para tracking de rate limiting
const resendAttempts = new Map<
  string,
  { count: number; lastAttempt: number }
>();

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Obtener el email del cuerpo de la petición
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

    console.log("📧 Reenviando correo de verificación para:", email);

    // Rate limiting: máximo 3 intentos por hora
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos
    const emailKey = email.toLowerCase();

    // Obtener intentos previos para este email
    const attempts = resendAttempts.get(emailKey) || {
      count: 0,
      lastAttempt: 0,
    };

    // Si han pasado más de 1 hora, resetear contador
    if (now - attempts.lastAttempt > oneHour) {
      attempts.count = 0;
    }

    // Verificar si ya se alcanzó el límite
    if (attempts.count >= 3) {
      const timeRemaining = Math.ceil(
        (oneHour - (now - attempts.lastAttempt)) / (60 * 1000)
      );
      console.log(
        `❌ Límite de reenvíos alcanzado para ${email}. Tiempo restante: ${timeRemaining} minutos`
      );

      return NextResponse.json(
        {
          error: "Límite de reenvíos alcanzado",
          message: `Has alcanzado el límite de 3 correos de verificación por hora. Intenta de nuevo en ${timeRemaining} minutos.`,
          retryAfter: timeRemaining * 60, // en segundos
          limitReached: true,
        },
        { status: 429 }
      );
    }

    // Incrementar contador de intentos
    attempts.count += 1;
    attempts.lastAttempt = now;
    resendAttempts.set(emailKey, attempts);

    // Reenviar correo de verificación
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (resendError) {
      console.error("❌ Error reenviando correo:", resendError);

      // Manejar diferentes tipos de errores
      if (
        resendError.message.includes("rate limit") ||
        resendError.message.includes("too many")
      ) {
        return NextResponse.json(
          {
            error: "Demasiados intentos",
            message:
              "Has realizado demasiados intentos. Espera unos minutos antes de intentar nuevamente.",
            retryAfter: 300, // 5 minutos
            limitReached: true,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: "Error reenviando correo de verificación",
          details: resendError.message,
        },
        { status: 500 }
      );
    }

    console.log("✅ Correo de verificación reenviado exitosamente");
    console.log(`📊 Intentos restantes para ${email}: ${3 - attempts.count}`);

    return NextResponse.json({
      success: true,
      message: "Correo de verificación reenviado exitosamente",
      attemptsRemaining: 3 - attempts.count,
      attemptsUsed: attempts.count,
    });
  } catch (error) {
    console.error("❌ Error en API de reenvío:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: "Error interno del servidor", details: errorMessage },
      { status: 500 }
    );
  }
}
