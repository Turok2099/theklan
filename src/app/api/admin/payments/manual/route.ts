import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { upsertPayment } from "@/lib/payments";
import type { PaymentData } from "@/lib/payments";

/**
 * POST /api/admin/payments/manual
 * Registra un pago manual (efectivo o transferencia)
 * Solo accesible por administradores
 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verificar autenticación
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.error("❌ API /api/admin/payments/manual: Error de autenticación:", authError);
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Verificar si el usuario es admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", authUser.id)
      .single();

    if (userError || userData?.role !== "admin") {
      console.error("❌ API /api/admin/payments/manual: Acceso denegado. Rol:", userData?.role);
      return NextResponse.json(
        { error: "Acceso denegado. Se requiere rol de administrador." },
        { status: 403 }
      );
    }

    // Obtener datos del body
    const body = await request.json();
    const {
      userId,
      paymentMethod, // 'cash' o 'transfer'
      paymentType, // 'subscription' o 'one-time'
      amount,
      description,
      notes,
      category,
      discountAmount,
      discountReason,
      paidAt,
      subscriptionEndDate, // Solo para suscripciones
    } = body;

    // Validaciones
    if (!userId || !paymentMethod || !amount) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: userId, paymentMethod, amount" },
        { status: 400 }
      );
    }

    if (!["cash", "transfer"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "paymentMethod debe ser 'cash' o 'transfer'" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount < 0) {
      return NextResponse.json(
        { error: "amount debe ser un número mayor o igual a 0 (en centavos)" },
        { status: 400 }
      );
    }

    // Validar paymentType
    const validPaymentType = paymentType || "one-time";
    if (!["subscription", "one-time"].includes(validPaymentType)) {
      return NextResponse.json(
        { error: "paymentType debe ser 'subscription' o 'one-time'" },
        { status: 400 }
      );
    }

    // Si es pago único, el monto debe ser mayor a 0
    if (validPaymentType === "one-time" && amount === 0) {
      return NextResponse.json(
        { error: "El monto debe ser mayor a 0 para pagos únicos" },
        { status: 400 }
      );
    }

    // Si es suscripción y el monto es 0, se interpretará como cancelación
    const isSubscriptionCancellation =
      validPaymentType === "subscription" && amount === 0;

    // Validar que subscriptionEndDate sea una fecha futura, salvo cancelaciones
    if (subscriptionEndDate && !isSubscriptionCancellation) {
      const endDate = new Date(subscriptionEndDate);
      const now = new Date();
      if (endDate <= now) {
        return NextResponse.json(
          { error: "subscriptionEndDate debe ser una fecha futura" },
          { status: 400 }
        );
      }
    }

    // Verificar que el usuario existe
    const { data: targetUser, error: targetUserError } = await supabase
      .from("users")
      .select("id, email")
      .eq("id", userId)
      .single();

    if (targetUserError || !targetUser) {
      console.error("❌ Usuario no encontrado:", userId);
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Preparar datos del pago manual
    const paymentData: PaymentData = {
      userId: targetUser.id,
      paymentMethod: paymentMethod as "cash" | "transfer",
      paymentType: validPaymentType as "subscription" | "one-time",
      amount: Math.round(amount), // Asegurar que sea un entero
      currency: "mxn",
      status: "succeeded", // Los pagos manuales son siempre exitosos
      description: description || `Pago ${paymentMethod === "cash" ? "en efectivo" : "por transferencia"}`,
      registeredBy: authUser.id, // ID del admin que registra
      notes: notes || null,
      category: category || "membership",
      discountAmount: discountAmount ? Math.round(discountAmount) : 0,
      discountReason: discountReason || null,
      subscriptionEndDate: subscriptionEndDate || null,
      paidAt: paidAt || new Date().toISOString(),
    };

    if (isSubscriptionCancellation) {
      paymentData.description = description || "Cancelación de suscripción manual";
    }

    console.log("💰 Registrando pago manual:", {
      userId: paymentData.userId,
      userEmail: targetUser.email,
      paymentMethod: paymentData.paymentMethod,
      paymentType: paymentData.paymentType,
      amount: paymentData.amount,
      subscriptionEndDate: paymentData.subscriptionEndDate,
      registeredBy: authUser.id,
    });

    // Insertar el pago usando la función upsertPayment
    const result = await upsertPayment(paymentData);

    console.log("✅ Pago manual registrado exitosamente:", result.id);

    return NextResponse.json({
      success: true,
      message: "Pago manual registrado exitosamente",
      payment: result,
    });
  } catch (error) {
    console.error("❌ API /api/admin/payments/manual: Error inesperado:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

