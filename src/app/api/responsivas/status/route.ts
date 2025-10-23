import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    console.log("🔍 API Status: Iniciando verificación de responsiva");
    const supabase = await createServerSupabaseClient();

    // Obtener el usuario actual
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log("👤 Usuario obtenido:", user?.email || "No usuario");

    if (authError || !user) {
      console.log("❌ Error de autenticación:", authError?.message);
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    // Buscar responsiva del usuario por email
    console.log("🔍 Buscando responsiva para email:", user.email);
    const { data: responsiva, error: responsivaError } = await supabase
      .from("responsivas")
      .select(
        "id, nombre, email, firma_digital, fecha_firma, created_at, acepta_terminos, acepta_aviso_privacidad"
      )
      .eq("email", user.email)
      .single();

    console.log("📋 Resultado de búsqueda:", {
      responsiva,
      error: responsivaError,
    });

    if (responsivaError && responsivaError.code !== "PGRST116") {
      console.error("Error buscando responsiva:", responsivaError);
      return NextResponse.json(
        { error: "Error consultando responsiva" },
        { status: 500 }
      );
    }

    // Si no existe responsiva
    if (!responsiva) {
      console.log("📝 No se encontró responsiva para el usuario");
      return NextResponse.json({
        hasResponsiva: false,
        isSigned: false,
        responsiva: null,
      });
    }

    // Verificar si está completada (acepta términos Y aviso de privacidad)
    // La firma digital es opcional
    const isCompleted =
      responsiva.acepta_terminos && responsiva.acepta_aviso_privacidad;
    const isSigned = !!(responsiva.firma_digital && responsiva.fecha_firma);

    console.log("✍️ Estado de responsiva:", {
      acepta_terminos: responsiva.acepta_terminos,
      acepta_aviso_privacidad: responsiva.acepta_aviso_privacidad,
      firma_digital: !!responsiva.firma_digital,
      fecha_firma: !!responsiva.fecha_firma,
      isCompleted,
      isSigned,
    });

    const result = {
      hasResponsiva: true,
      isCompleted,
      isSigned,
      responsiva: {
        id: responsiva.id,
        nombre: responsiva.nombre,
        email: responsiva.email,
        fechaCreacion: responsiva.created_at,
        fechaFirma: responsiva.fecha_firma,
        aceptaTerminos: responsiva.acepta_terminos,
        aceptaAvisoPrivacidad: responsiva.acepta_aviso_privacidad,
      },
    };

    console.log("✅ Respuesta final:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error en API de estado de responsiva:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
