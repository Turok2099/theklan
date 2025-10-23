import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();

    // Obtener el usuario actual
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    // Verificar si el email ya está verificado
    if (user.email_confirmed_at) {
      return NextResponse.json(
        { error: "El email ya está verificado" },
        { status: 400 }
      );
    }

    console.log("📧 Reenviando correo de verificación para:", user.email);

    // Reenviar correo de verificación
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: user.email!,
    });

    if (resendError) {
      console.error("❌ Error reenviando correo:", resendError);
      return NextResponse.json(
        {
          error: "Error reenviando correo de verificación",
          details: resendError.message,
        },
        { status: 500 }
      );
    }

    console.log("✅ Correo de verificación reenviado exitosamente");

    return NextResponse.json({
      success: true,
      message: "Correo de verificación reenviado exitosamente",
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
