import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await request.json();

    // Verificar autenticación
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para realizar un pago" },
        { status: 401 }
      );
    }

    const { paymentType, priceId, customerEmail, amount } = body;

    // Validar paymentType
    if (paymentType !== "subscription" && paymentType !== "one-time") {
      return NextResponse.json(
        { error: "paymentType debe ser 'subscription' o 'one-time'" },
        { status: 400 }
      );
    }

    // Para suscripciones, se requiere priceId
    if (paymentType === "subscription" && !priceId) {
      return NextResponse.json(
        { error: "Price ID es requerido para suscripciones" },
        { status: 400 }
      );
    }

    // Para pagos únicos, se requiere amount (en centavos)
    if (paymentType === "one-time") {
      if (!amount || typeof amount !== "number" || amount <= 0) {
        return NextResponse.json(
          { error: "Monto válido es requerido para pagos únicos (en centavos)" },
          { status: 400 }
        );
      }
    }

    // Crear o obtener Customer en Stripe
    // Primero verificar si ya existe un customer_id en la base de datos
    const { data: userData } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", authUser.id)
      .single();

    let customerId = userData?.stripe_customer_id;

    // Si no existe, crear uno nuevo en Stripe
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: customerEmail || authUser.email || undefined,
        metadata: {
          supabase_user_id: authUser.id,
        },
      });

      customerId = customer.id;

      // Guardar el customer_id en la base de datos
      await supabase
        .from("users")
        .update({
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", authUser.id);
    }

    // Crear SetupIntent para suscripción o PaymentIntent para pago único
    if (paymentType === "subscription") {
      // Crear SetupIntent para suscripción usando Stripe Elements
      // El SetupIntent permite configurar el método de pago que luego se usará para la suscripción
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ["card"],
        metadata: {
          user_id: authUser.id,
          price_id: priceId,
          payment_type: "subscription",
        },
      });

      return NextResponse.json({
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id,
        priceId: priceId,
        customerId: customerId,
        paymentType: "subscription",
      });
    } else {
      // Crear PaymentIntent para pago único
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Monto en centavos
        currency: "mxn", // Cambiar según la moneda de tu país
        customer: customerId,
        payment_method_types: ["card"],
        metadata: {
          user_id: authUser.id,
          payment_type: "one-time",
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        customerId: customerId,
        paymentType: "one-time",
        amount: amount,
      });
    }
  } catch (error) {
    console.error("Error creando Checkout Session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al crear la sesión de pago",
      },
      { status: 500 }
    );
  }
}
