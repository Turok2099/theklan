import { createServerSupabaseClient } from "@/lib/supabase-server";
import type Stripe from "stripe";

export interface PaymentData {
  userId: string;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId: string;
  paymentType: "subscription" | "one-time";
  amount: number; // En centavos
  currency: string;
  status: string;
  paymentMethodId?: string;
  cardLast4?: string;
  cardBrand?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  priceId?: string;
  productId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  paidAt?: Date | string;
}

/**
 * Crea o actualiza un registro de pago en la base de datos
 */
export async function upsertPayment(paymentData: PaymentData) {
  const supabase = await createServerSupabaseClient();

  console.log("💾 upsertPayment llamado con:", {
    userId: paymentData.userId,
    stripePaymentIntentId: paymentData.stripePaymentIntentId,
    paymentType: paymentData.paymentType,
    amount: paymentData.amount,
    status: paymentData.status,
    stripeCustomerId: paymentData.stripeCustomerId,
    stripeInvoiceId: paymentData.stripeInvoiceId,
    stripeSubscriptionId: paymentData.stripeSubscriptionId,
  });

  const paymentRecord = {
    user_id: paymentData.userId,
    stripe_payment_intent_id: paymentData.stripePaymentIntentId || null,
    stripe_invoice_id: paymentData.stripeInvoiceId || null,
    stripe_subscription_id: paymentData.stripeSubscriptionId || null,
    stripe_customer_id: paymentData.stripeCustomerId,
    payment_type: paymentData.paymentType,
    amount: paymentData.amount,
    currency: paymentData.currency,
    status: paymentData.status,
    payment_method_id: paymentData.paymentMethodId || null,
    card_last4: paymentData.cardLast4 || null,
    card_brand: paymentData.cardBrand || null,
    card_exp_month: paymentData.cardExpMonth || null,
    card_exp_year: paymentData.cardExpYear || null,
    price_id: paymentData.priceId || null,
    product_id: paymentData.productId || null,
    description: paymentData.description || null,
    metadata: paymentData.metadata || {},
    paid_at: paymentData.paidAt
      ? typeof paymentData.paidAt === "string"
        ? paymentData.paidAt
        : paymentData.paidAt.toISOString()
      : null,
  };

  console.log("💾 paymentRecord preparado:", {
    user_id: paymentRecord.user_id,
    stripe_payment_intent_id: paymentRecord.stripe_payment_intent_id,
    payment_type: paymentRecord.payment_type,
    amount: paymentRecord.amount,
    status: paymentRecord.status,
  });

  // Si hay stripe_payment_intent_id, usar upsert para evitar duplicados
  if (paymentData.stripePaymentIntentId) {
    console.log("💾 Usando upsert con stripe_payment_intent_id:", paymentData.stripePaymentIntentId);
    const { data, error } = await supabase
      .from("payments")
      .upsert(paymentRecord, {
        onConflict: "stripe_payment_intent_id",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Error upserting payment:", error);
      console.error("❌ PaymentRecord que causó el error:", paymentRecord);
      throw error;
    }

    console.log("✅ Pago upserted exitosamente:", {
      id: data?.id,
      user_id: data?.user_id,
      stripe_payment_intent_id: data?.stripe_payment_intent_id,
      payment_type: data?.payment_type,
    });

    return data;
  } else {
    // Si no hay payment_intent_id, insertar directamente
    console.log("💾 Insertando pago sin payment_intent_id");
    const { data, error } = await supabase
      .from("payments")
      .insert(paymentRecord)
      .select()
      .single();

    if (error) {
      console.error("❌ Error inserting payment:", error);
      console.error("❌ PaymentRecord que causó el error:", paymentRecord);
      throw error;
    }

    console.log("✅ Pago insertado exitosamente:", {
      id: data?.id,
      user_id: data?.user_id,
      payment_type: data?.payment_type,
    });

    return data;
  }
}

/**
 * Actualiza el estado de un pago existente
 */
export async function updatePaymentStatus(
  stripePaymentIntentId: string,
  status: string,
  additionalData?: Partial<PaymentData>
) {
  const supabase = await createServerSupabaseClient();

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "succeeded" && !updateData.paid_at) {
    updateData.paid_at = new Date().toISOString();
  }

  if (additionalData) {
    if (additionalData.paidAt) {
      updateData.paid_at =
        typeof additionalData.paidAt === "string"
          ? additionalData.paidAt
          : additionalData.paidAt.toISOString();
    }
    if (additionalData.stripeInvoiceId) {
      updateData.stripe_invoice_id = additionalData.stripeInvoiceId;
    }
    if (additionalData.stripeSubscriptionId) {
      updateData.stripe_subscription_id = additionalData.stripeSubscriptionId;
    }
    if (additionalData.metadata) {
      updateData.metadata = additionalData.metadata;
    }
  }

  const { data, error } = await supabase
    .from("payments")
    .update(updateData)
    .eq("stripe_payment_intent_id", stripePaymentIntentId)
    .select()
    .single();

  if (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }

  return data;
}

/**
 * Obtiene todos los pagos de un usuario
 */
export async function getUserPayments(userId: string) {
  const supabase = await createServerSupabaseClient();

  console.log("📊 getUserPayments llamado para userId:", userId);

  // Obtener todos los pagos sin límite explícito
  // Supabase por defecto tiene un límite, pero para 22 pagos no debería ser problema
  // Sin embargo, usaremos una consulta sin ordenamiento inicial para evitar problemas
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId);
    // NO usar .order() aquí para evitar problemas con nulls o límites implícitos
  
  if (error) {
    console.error("❌ Error fetching user payments:", error);
    throw error;
  }

  const allPayments = data || [];

  console.log(`📊 getUserPayments: Total de ${allPayments.length} pagos encontrados para userId ${userId}`);
  
  if (allPayments.length === 0) {
    console.warn("⚠️ getUserPayments: No se encontraron pagos para este usuario");
    return [];
  }

  // Reordenar en el servidor para priorizar paid_at cuando exista
  // Esto asegura que el pago más reciente (por fecha real de pago) esté primero
  const sortedData = allPayments.sort((a, b) => {
    const dateA = a.paid_at || a.created_at;
    const dateB = b.paid_at || b.created_at;
    
    // Manejar casos donde las fechas podrían ser null o inválidas
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    const timeA = new Date(dateA).getTime();
    const timeB = new Date(dateB).getTime();
    
    // Si las fechas son iguales, usar created_at como desempate
    if (timeA === timeB) {
      const createdA = new Date(a.created_at).getTime();
      const createdB = new Date(b.created_at).getTime();
      return createdB - createdA;
    }
    
    return timeB - timeA;
  });

  console.log("📊 getUserPayments: Pagos ordenados, retornando", sortedData.length, "pagos");

  return sortedData;
}

/**
 * Obtiene un pago por su PaymentIntent ID
 */
export async function getPaymentByPaymentIntentId(
  stripePaymentIntentId: string
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("stripe_payment_intent_id", stripePaymentIntentId)
    .single();

  if (error) {
    console.error("Error fetching payment:", error);
    throw error;
  }

  return data;
}

/**
 * Convierte un PaymentIntent de Stripe a PaymentData
 */
export function stripePaymentIntentToPaymentData(
  paymentIntent: Stripe.PaymentIntent,
  userId: string,
  paymentType: "subscription" | "one-time",
  additionalData?: {
    stripeInvoiceId?: string;
    stripeSubscriptionId?: string;
    priceId?: string;
    productId?: string;
  }
): PaymentData {
  const paymentMethod =
    typeof paymentIntent.payment_method === "string"
      ? null
      : paymentIntent.payment_method;

  return {
    userId,
    stripePaymentIntentId: paymentIntent.id,
    stripeInvoiceId: additionalData?.stripeInvoiceId,
    stripeSubscriptionId: additionalData?.stripeSubscriptionId,
    stripeCustomerId:
      typeof paymentIntent.customer === "string"
        ? paymentIntent.customer
        : paymentIntent.customer?.id || "",
    paymentType,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    paymentMethodId: paymentMethod?.id,
    cardLast4:
      paymentMethod && "card" in paymentMethod
        ? paymentMethod.card?.last4
        : undefined,
    cardBrand:
      paymentMethod && "card" in paymentMethod
        ? paymentMethod.card?.brand
        : undefined,
    cardExpMonth:
      paymentMethod && "card" in paymentMethod
        ? paymentMethod.card?.exp_month
        : undefined,
    cardExpYear:
      paymentMethod && "card" in paymentMethod
        ? paymentMethod.card?.exp_year
        : undefined,
    priceId: additionalData?.priceId,
    productId: additionalData?.productId,
    description: paymentIntent.description || undefined,
    metadata: paymentIntent.metadata,
    paidAt:
      paymentIntent.status === "succeeded"
        ? new Date(paymentIntent.created * 1000)
        : undefined,
  };
}

