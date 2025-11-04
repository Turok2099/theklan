import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { headers } from "next/headers";
import { upsertPayment, updatePaymentStatus } from "@/lib/payments";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET no está configurada en las variables de entorno" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No se encontró la firma de Stripe" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("❌ Error verificando webhook:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 400 }
    );
  }

  console.log(`✅ Webhook recibido: ${event.type}`);

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentCanceled(paymentIntent);
        break;
      }

      case "payment_intent.requires_action": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentRequiresAction(paymentIntent);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionEvent(event.type, subscription);
        break;
      }

      default:
        console.log(`⚠️ Tipo de evento no manejado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    return NextResponse.json(
      { error: "Error procesando webhook" },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`✅ PaymentIntent succeeded: ${paymentIntent.id}`);

  // FASE 4: Mejorar búsqueda de userId - intentar múltiples métodos
  let userId = await getUserIdFromStripeObject(paymentIntent);
  
  // Si no se encontró userId, intentar buscar directamente por stripe_customer_id
  if (!userId && paymentIntent.customer) {
    console.log("🔄 FASE 4: userId no encontrado en metadatos, buscando por stripe_customer_id...");
    const customerId = typeof paymentIntent.customer === "string"
      ? paymentIntent.customer
      : paymentIntent.customer?.id || null;
      
    if (customerId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();
          
        if (!userError && user) {
          userId = user.id;
          console.log(`✅ userId encontrado por stripe_customer_id: ${userId}`);
        } else {
          console.warn(`⚠️ No se encontró usuario con stripe_customer_id: ${customerId}`);
        }
      } catch (error) {
        console.error("❌ Error buscando usuario por stripe_customer_id:", error);
      }
    }
  }
  
  if (!userId) {
    console.warn(
      `⚠️ No se encontró userId para PaymentIntent ${paymentIntent.id}. Customer: ${paymentIntent.customer}`
    );
    console.warn("⚠️ El pago NO se guardará en la BD porque no se puede determinar el usuario");
    return;
  }

  // Determinar el tipo de pago basado en los metadatos o invoice
  let paymentType: "subscription" | "one-time" =
    (paymentIntent.metadata?.payment_type as "subscription" | "one-time") ||
    "one-time";

  // Si no hay metadata payment_type, verificar si el PaymentIntent tiene un invoice asociado
  // Si tiene invoice, es muy probable que sea una suscripción
  if (!paymentIntent.metadata?.payment_type && paymentIntent.invoice) {
    try {
      const invoiceId = typeof paymentIntent.invoice === "string"
        ? paymentIntent.invoice
        : paymentIntent.invoice.id;
      
      const invoice = await stripe.invoices.retrieve(invoiceId);
      
      // Si el invoice tiene una subscription, entonces es un pago de suscripción
      if (invoice.subscription) {
        paymentType = "subscription";
        console.log(`🔄 PaymentType determinado desde invoice: subscription (invoice: ${invoiceId})`);
      }
    } catch (error) {
      console.warn("⚠️ Error verificando invoice para determinar payment_type:", error);
    }
  }

  // Obtener información de la tarjeta del payment_method
  let paymentMethodId: string | undefined;
  let cardLast4: string | undefined;
  let cardBrand: string | undefined;
  let cardExpMonth: number | undefined;
  let cardExpYear: number | undefined;

  if (paymentIntent.payment_method) {
    if (typeof paymentIntent.payment_method === "string") {
      paymentMethodId = paymentIntent.payment_method;
      // Si payment_method es solo un ID, necesitamos expandirlo para obtener los detalles de la tarjeta
      try {
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
        if (paymentMethod.card) {
          cardLast4 = paymentMethod.card.last4;
          cardBrand = paymentMethod.card.brand;
          cardExpMonth = paymentMethod.card.exp_month;
          cardExpYear = paymentMethod.card.exp_year;
        }
      } catch (error) {
        console.error("⚠️ Error obteniendo detalles del payment_method:", error);
      }
    } else {
      // payment_method ya está expandido
      paymentMethodId = paymentIntent.payment_method.id;
      if (paymentIntent.payment_method.card) {
        cardLast4 = paymentIntent.payment_method.card.last4;
        cardBrand = paymentIntent.payment_method.card.brand;
        cardExpMonth = paymentIntent.payment_method.card.exp_month;
        cardExpYear = paymentIntent.payment_method.card.exp_year;
      }
    }
  }

  await upsertPayment({
    userId,
    stripePaymentIntentId: paymentIntent.id,
    stripeCustomerId:
      typeof paymentIntent.customer === "string"
        ? paymentIntent.customer
        : paymentIntent.customer?.id || "",
    paymentType,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: "succeeded",
    paymentMethodId,
    cardLast4,
    cardBrand,
    cardExpMonth,
    cardExpYear,
    paidAt: new Date(paymentIntent.created * 1000),
    metadata: paymentIntent.metadata,
  });
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`❌ PaymentIntent failed: ${paymentIntent.id}`);

  try {
    await updatePaymentStatus(paymentIntent.id, "failed", {
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error("Error actualizando pago fallido:", error);
  }
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  console.log(`🚫 PaymentIntent canceled: ${paymentIntent.id}`);

  try {
    await updatePaymentStatus(paymentIntent.id, "canceled", {
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error("Error actualizando pago cancelado:", error);
  }
}

async function handlePaymentIntentRequiresAction(
  paymentIntent: Stripe.PaymentIntent
) {
  console.log(`⚠️ PaymentIntent requires action: ${paymentIntent.id}`);

  try {
    await updatePaymentStatus(paymentIntent.id, "requires_action", {
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error("Error actualizando pago que requiere acción:", error);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log(`✅ Invoice paid: ${invoice.id}`);

  const invoiceWithPaymentIntent = invoice as Stripe.Invoice & {
    payment_intent?: Stripe.PaymentIntent | string;
    subscription?: Stripe.Subscription | string | null;
    customer?: Stripe.Customer | string | null;
  };

  if (!invoiceWithPaymentIntent.payment_intent) {
    return;
  }

  const paymentIntentId =
    typeof invoiceWithPaymentIntent.payment_intent === "string"
      ? invoiceWithPaymentIntent.payment_intent
      : invoiceWithPaymentIntent.payment_intent.id;

  // FASE 4: Mejorar búsqueda de userId - intentar múltiples métodos
  let userId = await getUserIdFromStripeObject(invoiceWithPaymentIntent);
  
  // Si no se encontró userId, intentar buscar directamente por stripe_customer_id
  if (!userId && invoiceWithPaymentIntent.customer) {
    console.log("🔄 FASE 4: userId no encontrado en metadatos, buscando por stripe_customer_id...");
    const customerId = typeof invoiceWithPaymentIntent.customer === "string"
      ? invoiceWithPaymentIntent.customer
      : invoiceWithPaymentIntent.customer?.id || null;
      
    if (customerId) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();
          
        if (!userError && user) {
          userId = user.id;
          console.log(`✅ userId encontrado por stripe_customer_id: ${userId}`);
        } else {
          console.warn(`⚠️ No se encontró usuario con stripe_customer_id: ${customerId}`);
        }
      } catch (error) {
        console.error("❌ Error buscando usuario por stripe_customer_id:", error);
      }
    }
  }
  
  if (!userId) {
    console.warn(
      `⚠️ No se encontró userId para Invoice ${invoice.id}. Customer: ${invoiceWithPaymentIntent.customer}`
    );
    console.warn("⚠️ El pago NO se guardará en la BD porque no se puede determinar el usuario");
    return;
  }

  // Obtener el PaymentIntent completo para más información si es necesario
  let paymentMethodId: string | undefined;
  let cardLast4: string | undefined;
  let cardBrand: string | undefined;
  let cardExpMonth: number | undefined;
  let cardExpYear: number | undefined;
  let paymentTypeFromMetadata: "subscription" | "one-time" | undefined;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // PRIORIDAD 1: Verificar metadatos del PaymentIntent para determinar payment_type
    if (paymentIntent.metadata?.payment_type) {
      paymentTypeFromMetadata = paymentIntent.metadata.payment_type as "subscription" | "one-time";
      console.log(`📋 PaymentType desde metadatos del PaymentIntent: ${paymentTypeFromMetadata}`);
    }
    
    if (paymentIntent.payment_method) {
      const pmId = typeof paymentIntent.payment_method === "string"
        ? paymentIntent.payment_method
        : paymentIntent.payment_method.id;
      
      const paymentMethod = await stripe.paymentMethods.retrieve(pmId);
      if (paymentMethod.type === "card" && paymentMethod.card) {
        paymentMethodId = paymentMethod.id;
        cardLast4 = paymentMethod.card.last4;
        cardBrand = paymentMethod.card.brand;
        cardExpMonth = paymentMethod.card.exp_month;
        cardExpYear = paymentMethod.card.exp_year;
      }
    }
  } catch (error) {
    console.warn("No se pudo obtener información del método de pago:", error);
  }

  // Determinar payment_type: priorizar metadatos, luego subscription en invoice, luego one-time por defecto
  const paymentType = paymentTypeFromMetadata || 
    (invoiceWithPaymentIntent.subscription ? "subscription" : "one-time");

  console.log(`📋 PaymentType determinado para invoice ${invoice.id}:`, {
    fromMetadata: paymentTypeFromMetadata,
    hasSubscription: !!invoiceWithPaymentIntent.subscription,
    final: paymentType,
  });

  await upsertPayment({
    userId,
    stripePaymentIntentId: paymentIntentId,
    stripeInvoiceId: invoice.id,
    stripeSubscriptionId:
      typeof invoiceWithPaymentIntent.subscription === "string"
        ? invoiceWithPaymentIntent.subscription
        : invoiceWithPaymentIntent.subscription?.id || undefined,
    stripeCustomerId:
      typeof invoiceWithPaymentIntent.customer === "string"
        ? invoiceWithPaymentIntent.customer
        : invoiceWithPaymentIntent.customer?.id || "",
    paymentType,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: "succeeded",
    paymentMethodId,
    cardLast4,
    cardBrand,
    cardExpMonth,
    cardExpYear,
    priceId: (() => {
      const lineItem = invoice.lines.data[0];
      if (!lineItem || !('price' in lineItem) || !lineItem.price) return undefined;
      const price = lineItem.price as Stripe.Price | string;
      return typeof price === 'string' ? price : price.id;
    })(),
    productId: (() => {
      const lineItem = invoice.lines.data[0];
      if (!lineItem || !('price' in lineItem) || !lineItem.price) return undefined;
      const price = lineItem.price as Stripe.Price;
      if (typeof price === 'string') return undefined;
      const product = price.product;
      return typeof product === 'string' ? product : product?.id || undefined;
    })(),
    paidAt: new Date(invoice.created * 1000),
    metadata: invoice.metadata || {},
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`❌ Invoice payment failed: ${invoice.id}`);

  const invoiceWithPaymentIntent = invoice as Stripe.Invoice & {
    payment_intent?: Stripe.PaymentIntent | string;
  };

  if (!invoiceWithPaymentIntent.payment_intent) {
    return;
  }

  const paymentIntentId =
    typeof invoiceWithPaymentIntent.payment_intent === "string"
      ? invoiceWithPaymentIntent.payment_intent
      : invoiceWithPaymentIntent.payment_intent.id;

  try {
    await updatePaymentStatus(paymentIntentId, "failed", {
      stripeInvoiceId: invoice.id,
      metadata: invoice.metadata || {},
    });
  } catch (error) {
    console.error("Error actualizando invoice fallido:", error);
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log(`↩️ Charge refunded: ${charge.id}`);

  if (!charge.payment_intent) {
    return;
  }

  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent.id;

  try {
    await updatePaymentStatus(paymentIntentId, "refunded", {
      metadata: charge.metadata || {},
    });
  } catch (error) {
    console.error("Error actualizando reembolso:", error);
  }
}

async function handleSubscriptionEvent(
  eventType: string,
  subscription: Stripe.Subscription
) {
  console.log(`📋 Subscription event: ${eventType} - ${subscription.id}`);

  // Los eventos de suscripción se manejan principalmente a través de los invoices
  // pero podemos actualizar metadatos si es necesario
  // Por ahora, solo logueamos
}

/**
 * Obtiene el userId desde múltiples fuentes:
 * 1. Metadatos del objeto Stripe (PaymentIntent, Invoice, etc.)
 * 2. Customer metadata en Stripe
 * 3. Búsqueda por stripe_customer_id en la tabla users
 */
async function getUserIdFromStripeObject(
  stripeObject: {
    metadata?: Record<string, string> | Stripe.Metadata | null;
    customer?: string | Stripe.Customer | Stripe.DeletedCustomer | null;
  }
): Promise<string | null> {
  // Prioridad 1: Buscar user_id en metadatos del objeto Stripe
  const metadata = stripeObject.metadata;
  const metadataUserId =
    (metadata && typeof metadata === 'object' && !Array.isArray(metadata))
      ? (metadata.user_id || metadata.supabase_user_id)
      : null;
  if (metadataUserId && typeof metadataUserId === 'string') {
    console.log(`✅ UserId encontrado en metadatos: ${metadataUserId}`);
    return metadataUserId;
  }

  // Prioridad 2: Si hay customer, obtener sus metadatos desde Stripe
  if (stripeObject.customer) {
    const customerId =
      typeof stripeObject.customer === "string"
        ? stripeObject.customer
        : stripeObject.customer.id || null;

    if (customerId) {
      try {
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted && customer.metadata) {
          const customerUserId =
            customer.metadata.supabase_user_id || customer.metadata.user_id;
          if (customerUserId) {
            console.log(
              `✅ UserId encontrado en metadata del Customer: ${customerUserId}`
            );
            return customerUserId;
          }
        }
      } catch (error) {
        console.warn(
          `⚠️ Error obteniendo Customer ${customerId}:`,
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }
  }

  // Prioridad 3: Fallback - buscar por stripe_customer_id en tabla users
  if (stripeObject.customer) {
    return await getUserIdFromCustomer(stripeObject.customer);
  }
  return null;
}

async function getUserIdFromCustomer(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null
): Promise<string | null> {
  if (!customer) return null;

  const customerId =
    typeof customer === "string" ? customer : customer.id || null;

  if (!customerId) return null;

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (error || !data) {
    console.warn(`No se encontró usuario con stripe_customer_id: ${customerId}`);
    return null;
  }

  return data.id;
}

