import { NextResponse } from "next/server";
import { getUserPayments } from "@/lib/payments";
import { createServerSupabaseClient } from "@/lib/supabase-server";

/**
 * Obtiene todos los pagos del usuario autenticado
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
      console.error("❌ API /api/payments: Error de autenticación:", authError);
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    console.log("📊 API /api/payments: Usuario autenticado:", {
      id: authUser.id,
      email: authUser.email,
    });

    // Verificar directamente en la BD cuántos pagos hay antes de llamar a getUserPayments
    const { data: directPayments, error: directError } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", authUser.id);

    if (directError) {
      console.error("❌ API /api/payments: Error obteniendo pagos directamente:", directError);
    } else {
      console.log(`📊 API /api/payments: Pagos encontrados directamente (sin getUserPayments): ${directPayments?.length || 0}`);
    }

    const payments = await getUserPayments(authUser.id);

    console.log("📊 API /api/payments: Retornando pagos:", {
      count: payments.length,
      userId: authUser.id,
      payments: payments.map(p => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        payment_type: p.payment_type,
        created_at: p.created_at,
      })),
    });

    return NextResponse.json({
      success: true,
      payments: payments,
      count: payments.length,
    });
  } catch (error) {
    console.error("❌ API /api/payments: Error obteniendo pagos:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al obtener los pagos",
      },
      { status: 500 }
    );
  }
}

