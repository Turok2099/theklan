import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { responsivaSchema } from "@/lib/validations";
import { sendResponsivaEmail } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos con Zod
    const validatedData = responsivaSchema.parse(body);

    // Crear cliente de Supabase con service role
    const supabase = createServerClient();

    // Preparar datos para insertar en la base de datos
    const responsivaData = {
      nombre: validatedData.nombre,
      fecha_nacimiento: validatedData.fechaNacimiento,
      celular: validatedData.celular,
      email: validatedData.email,
      instagram: validatedData.instagram || null,
      escuela_empresa: validatedData.escuelaEmpresa || null,
      como_se_entero: validatedData.comoSeEntero,
      contacto_emergencia: validatedData.contactoEmergencia,
      telefono_emergencia: validatedData.telefonoEmergencia,
      tiene_seguro_medico: validatedData.tieneSeguroMedico,
      lugar_atencion_medica: validatedData.lugarAtencionMedica || null,
      lesiones_restricciones_medicamentos:
        validatedData.lesionesRestriccionesMedicamentos || null,
      frecuencia_ejercicio: validatedData.frecuenciaEjercicio,
      acepta_terminos: validatedData.aceptaTerminos,
      acepta_aviso_privacidad: validatedData.aceptaAvisoPrivacidad,

      // Firma digital (opcional) - enviar como null explícitamente si está vacío
      firma_digital:
        validatedData.firmaDigital && validatedData.firmaDigital.trim() !== ""
          ? validatedData.firmaDigital
          : null,
      fecha_firma:
        validatedData.fechaFirma && validatedData.fechaFirma.trim() !== ""
          ? validatedData.fechaFirma
          : null,

      // Metadatos generales
      ip_address:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1",
      user_agent: request.headers.get("user-agent") || "Unknown",
      estado: "pendiente",
    };

    // Insertar en Supabase
    const { data, error } = await supabase
      .from("responsivas")
      .insert([responsivaData])
      .select()
      .single();

    if (error) {
      console.error("Error insertando responsiva:", error);
      return NextResponse.json(
        {
          error: "Error al guardar la responsiva",
          details: error.message,
        },
        { status: 500 }
      );
    }

    console.log("✅ Responsiva guardada exitosamente:", data.id);

    // Enviar email con PDF automáticamente
    try {
      console.log("📧 Enviando email con PDF...");
      await sendResponsivaEmail(validatedData);
      console.log("✅ Email con PDF enviado exitosamente");
    } catch (emailError) {
      console.error("⚠️ Error enviando email (no crítico):", emailError);
      // No lanzamos el error para no interrumpir el flujo principal
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: data.id,
          message: "Responsiva enviada exitosamente",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en API responsivas:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Datos del formulario inválidos",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

// Método GET para obtener responsivas (para el panel admin)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const estado = searchParams.get("estado");
    const search = searchParams.get("search");

    let query = supabase
      .from("responsivas")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Filtros
    if (estado) {
      query = query.eq("estado", estado);
    }

    if (search) {
      query = query.or(`nombre.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error obteniendo responsivas:", error);
      return NextResponse.json(
        { error: "Error al obtener responsivas" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error en GET responsivas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
