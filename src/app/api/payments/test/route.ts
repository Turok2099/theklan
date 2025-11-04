import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

/**
 * Endpoint de prueba para verificar que la tabla payments funciona correctamente
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Verificar autenticación
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Verificar que la tabla existe y podemos acceder a ella
    const { error: tableError } = await supabase
      .from("payments")
      .select("count", { count: "exact", head: true });

    if (tableError) {
      return NextResponse.json(
        {
          success: false,
          error: "Error accediendo a la tabla payments",
          details: tableError.message,
        },
        { status: 500 }
      );
    }

    // Obtener los pagos del usuario actual
    const { data: userPayments, error: paymentsError } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", authUser.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (paymentsError) {
      return NextResponse.json(
        {
          success: false,
          error: "Error obteniendo pagos del usuario",
          details: paymentsError.message,
        },
        { status: 500 }
      );
    }

    // Verificar estructura de la tabla
    const { data: samplePayment } = await supabase
      .from("payments")
      .select("*")
      .limit(1)
      .single();

    return NextResponse.json({
      success: true,
      message: "Tabla payments funciona correctamente",
      tableExists: true,
      userPaymentsCount: userPayments?.length || 0,
      userPayments: userPayments || [],
      tableStructure: samplePayment ? Object.keys(samplePayment) : null,
      userId: authUser.id,
    });
  } catch (error) {
    console.error("Error en test de payments:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

