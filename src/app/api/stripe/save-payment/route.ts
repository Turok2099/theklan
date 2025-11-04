import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { upsertPayment, stripePaymentIntentToPaymentData } from "@/lib/payments";
import type Stripe from "stripe";

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
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { paymentIntentId, paymentType, priceId } = body;

    console.log("💾 save-payment llamado:", {
      paymentIntentId,
      paymentType,
      userId: authUser.id,
    });

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "paymentIntentId es requerido" },
        { status: 400 }
      );
    }

    // Obtener el PaymentIntent de Stripe (expandir invoice y payment_method)
    console.log("🔄 Obteniendo PaymentIntent de Stripe...");
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['invoice', 'payment_method'],
    }) as Stripe.PaymentIntent & { invoice?: Stripe.Invoice | string };
    console.log("📋 PaymentIntent obtenido:", {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      hasCustomer: !!paymentIntent.customer,
      hasMetadata: !!paymentIntent.metadata,
      metadataPaymentType: paymentIntent.metadata?.payment_type,
    });

    // Determinar payment_type: priorizar el parámetro del request, luego metadatos del PaymentIntent, luego one-time por defecto
    let finalPaymentType: "subscription" | "one-time" = "one-time";
    
    if (paymentType) {
      // Si se proporciona paymentType en el request, usarlo
      finalPaymentType = paymentType as "subscription" | "one-time";
      console.log(`📋 PaymentType desde parámetro del request: ${finalPaymentType}`);
    } else if (paymentIntent.metadata?.payment_type) {
      // Si no se proporciona, verificar metadatos del PaymentIntent
      finalPaymentType = paymentIntent.metadata.payment_type as "subscription" | "one-time";
      console.log(`📋 PaymentType desde metadatos del PaymentIntent: ${finalPaymentType}`);
    } else {
      // Si no hay nada, verificar si hay una suscripción asociada
      // Buscar en invoices o subscriptions relacionadas
      if (paymentIntent.invoice) {
        try {
          const invoiceId = typeof paymentIntent.invoice === 'string' 
            ? paymentIntent.invoice 
            : paymentIntent.invoice.id;
          const invoice = await stripe.invoices.retrieve(invoiceId, {
            expand: ['subscription'],
          }) as Stripe.Invoice & { subscription?: Stripe.Subscription | string };
          if (invoice.subscription) {
            finalPaymentType = "subscription";
            console.log(`📋 PaymentType determinado desde invoice subscription: ${finalPaymentType}`);
          }
        } catch (error) {
          console.warn("No se pudo obtener invoice para verificar subscription:", error);
        }
      }
    }

    console.log(`📋 PaymentType final para guardar: ${finalPaymentType}`);

    // Obtener información adicional si es necesario
    let productId: string | undefined;
    if (priceId) {
      try {
        const price = await stripe.prices.retrieve(priceId);
        productId = typeof price.product === 'string' ? price.product : price.product?.id;
        console.log("💰 Precio obtenido:", { priceId, productId });
      } catch (error) {
        console.error("Error obteniendo precio:", error);
      }
    }

    // Guardar el pago
    console.log("🔄 Guardando pago en BD...");
    await upsertPayment(
      stripePaymentIntentToPaymentData(
        paymentIntent,
        authUser.id,
        finalPaymentType,
        {
          priceId: priceId,
          productId: productId,
        }
      )
    );

    console.log("✅ Pago guardado exitosamente en BD");

    return NextResponse.json({
      success: true,
      message: "Pago guardado exitosamente",
    });
  } catch (error) {
    console.error("Error guardando pago:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al guardar el pago",
      },
      { status: 500 }
    );
  }
}


