import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

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

    // Reenviar correo de verificación
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: email,
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
