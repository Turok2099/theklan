import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

/**
 * GET - Obtiene todos los pagos del sistema (solo admin)
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
      console.error("❌ API /api/admin/payments: Error de autenticación:", authError);
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", authUser.id)
      .single();

    if (userError || userData?.role !== "admin") {
      console.error("❌ API /api/admin/payments: Usuario no es admin");
      return NextResponse.json(
        { error: "Acceso denegado" },
        { status: 403 }
      );
    }

    console.log("📊 API /api/admin/payments: Admin autenticado:", authUser.email);

    // Obtener todos los pagos con información del usuario
    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select(`
        *,
        users!inner (
          email,
          profile_data
        )
      `)
      .order("created_at", { ascending: false });

    if (paymentsError) {
      console.error("❌ Error obteniendo pagos:", paymentsError);
      return NextResponse.json(
        { error: "Error al obtener los pagos" },
        { status: 500 }
      );
    }

    console.log(`✅ API /api/admin/payments: ${payments?.length || 0} pagos obtenidos`);

    return NextResponse.json({
      success: true,
      payments: payments || [],
      totalPayments: payments?.length || 0,
    });
  } catch (error) {
    console.error("❌ Error en /api/admin/payments:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

