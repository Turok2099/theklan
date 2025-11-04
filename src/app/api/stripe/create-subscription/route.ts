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
        { error: "Debes iniciar sesión para suscribirte" },
        { status: 401 }
      );
    }

    const { customerId, paymentMethodId, priceId } = body;

    if (!customerId || !paymentMethodId || !priceId) {
      return NextResponse.json(
        { error: "customerId, paymentMethodId y priceId son requeridos" },
        { status: 400 }
      );
    }

    // Asegurar que el payment method esté adjunto al customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Crear la suscripción SIN default_payment_method para tener control total
    // Esto fuerza a Stripe a crear un PaymentIntent en estado "requires_payment_method"
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
      },
      expand: ["latest_invoice.payment_intent"],
      // Agregar metadatos a la suscripción para que se propaguen al PaymentIntent
      metadata: {
        user_id: authUser.id,
        supabase_user_id: authUser.id,
        payment_type: "subscription",
        price_id: priceId,
      },
    });

    // Obtener el clientSecret del payment intent si existe
    // Cuando expandemos 'latest_invoice.payment_intent', necesitamos type assertion
    let clientSecret: string | undefined = undefined;
    let paymentIntentStatus: string | undefined = undefined;
    let paymentIntentId: string | undefined = undefined;
    
    console.log("📋 Subscription status:", subscription.status);
    console.log("📋 Has latest_invoice:", !!subscription.latest_invoice);
    
    if (subscription.latest_invoice) {
      const invoice = subscription.latest_invoice as Stripe.Invoice & {
        payment_intent?: Stripe.PaymentIntent | string;
      };
      
      console.log("📋 Invoice status:", invoice.status);
      console.log("📋 Invoice ID:", invoice.id);
      console.log("💳 Payment intent exists:", !!invoice.payment_intent);
      console.log("💳 Payment intent type:", typeof invoice.payment_intent);
      
      if (
        invoice.payment_intent &&
        typeof invoice.payment_intent === "object"
      ) {
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
        paymentIntentId = paymentIntent.id;
        clientSecret = paymentIntent.client_secret || undefined;
        paymentIntentStatus = paymentIntent.status;
        
        console.log("🔑 PaymentIntent ID:", paymentIntent.id);
        console.log("🔑 PaymentIntent Status:", paymentIntent.status);
        console.log("🔑 ClientSecret exists:", !!clientSecret);
        
        // FASE 1: Actualizar el PaymentIntent con método de pago Y metadatos AL MISMO TIEMPO
        // Esto evita la condición de carrera donde el webhook se dispara antes de agregar metadatos
        try {
          console.log("🔄 FASE 1: Actualizando PaymentIntent con método de pago y metadatos...");
          
          const updatedPaymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
            payment_method: paymentMethodId,
            metadata: {
              user_id: authUser.id,
              supabase_user_id: authUser.id,
              payment_type: "subscription",
              price_id: priceId,
            },
          });
          
          console.log("✅ PaymentIntent actualizado con metadatos:", updatedPaymentIntent.status);
          console.log("✅ Metadatos confirmados:", updatedPaymentIntent.metadata);
          
          // Luego confirmar el PaymentIntent (los metadatos ya están presentes)
          if (updatedPaymentIntent.status === 'requires_confirmation' || updatedPaymentIntent.status === 'requires_payment_method') {
            console.log("🔄 Confirmando PaymentIntent (metadatos ya presentes)...");
            const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
            
            console.log("✅ PaymentIntent confirmado:", confirmedPaymentIntent.status);
            paymentIntentStatus = confirmedPaymentIntent.status;
            clientSecret = confirmedPaymentIntent.client_secret || updatedPaymentIntent.client_secret || clientSecret;
            
            // Si aún requiere acción, necesitamos el clientSecret para el frontend
            if (confirmedPaymentIntent.status === 'requires_action') {
              console.log("⚠️ PaymentIntent requiere acción adicional (3D Secure)");
            } else if (confirmedPaymentIntent.status === 'succeeded') {
              console.log("✅ PaymentIntent completado exitosamente desde el backend");
            }
          } else {
            // Si ya está en otro estado, usar el clientSecret actualizado
            clientSecret = updatedPaymentIntent.client_secret || clientSecret;
            paymentIntentStatus = updatedPaymentIntent.status;
          }
        } catch (confirmError) {
          console.error("❌ Error actualizando/confirmando PaymentIntent desde backend:", confirmError);
          // Si falla, mantener el clientSecret original para que el frontend lo maneje
        }
      } else if (typeof invoice.payment_intent === "string") {
        console.log("⚠️ PaymentIntent es un string ID:", invoice.payment_intent);
        paymentIntentId = invoice.payment_intent;
        
        // Intentar obtener el PaymentIntent completo
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent);
          clientSecret = paymentIntent.client_secret || undefined;
          paymentIntentStatus = paymentIntent.status;
          console.log("🔑 PaymentIntent retrieved:", {
            id: paymentIntent.id,
            status: paymentIntent.status,
            hasClientSecret: !!clientSecret,
          });
          
          // FASE 1: Actualizar PaymentIntent con método de pago Y metadatos AL MISMO TIEMPO
          try {
            console.log("🔄 FASE 1: Actualizando PaymentIntent recuperado con metadatos...");
            const updatedPI = await stripe.paymentIntents.update(paymentIntent.id, {
              payment_method: paymentMethodId,
              metadata: {
                user_id: authUser.id,
                supabase_user_id: authUser.id,
                payment_type: "subscription",
                price_id: priceId,
              },
            });
            console.log("✅ PaymentIntent actualizado con metadatos:", updatedPI.metadata);
            paymentIntentStatus = updatedPI.status;
            clientSecret = updatedPI.client_secret || clientSecret;
          } catch (metadataError) {
            console.error("⚠️ Error agregando metadatos:", metadataError);
          }
          
          // Intentar confirmar si es necesario
          if (paymentIntent.status === 'requires_confirmation' || paymentIntent.status === 'requires_payment_method') {
            try {
              console.log("🔄 Confirmando PaymentIntent recuperado (metadatos ya presentes)...");
              const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id);
              paymentIntentStatus = confirmedPaymentIntent.status;
              clientSecret = confirmedPaymentIntent.client_secret || clientSecret;
              console.log("✅ PaymentIntent confirmado:", confirmedPaymentIntent.status);
            } catch (confirmError) {
              console.error("❌ Error confirmando PaymentIntent recuperado:", confirmError);
            }
          }
        } catch (retrieveError) {
          console.error("❌ Error recuperando PaymentIntent:", retrieveError);
        }
      } else {
        // No hay PaymentIntent - esto puede pasar si el invoice no se ha generado correctamente
        console.log("⚠️ No hay PaymentIntent en el invoice. Intentando crear uno manualmente...");
        
        // Si no hay PaymentIntent, intentar obtener el invoice completo y verificar
        try {
          const fullInvoice = await stripe.invoices.retrieve(invoice.id, {
            expand: ['payment_intent'],
          }) as Stripe.Invoice & {
            payment_intent?: Stripe.PaymentIntent | string;
          };
          
          if (fullInvoice.payment_intent) {
            if (typeof fullInvoice.payment_intent === 'string') {
              const pi = await stripe.paymentIntents.retrieve(fullInvoice.payment_intent);
              paymentIntentId = pi.id;
              clientSecret = pi.client_secret || undefined;
              paymentIntentStatus = pi.status;
              console.log("🔑 PaymentIntent encontrado en invoice completo:", pi.status);
            } else {
              const pi = fullInvoice.payment_intent as Stripe.PaymentIntent;
              paymentIntentId = pi.id;
              clientSecret = pi.client_secret || undefined;
              paymentIntentStatus = pi.status;
              console.log("🔑 PaymentIntent encontrado (objeto):", pi.status);
            }
          } else {
            console.log("❌ El invoice no tiene PaymentIntent asociado. Intentando finalizar el invoice...");
            
            // Si no hay PaymentIntent, intentar finalizar el invoice manualmente
            // Esto puede crear un PaymentIntent si el invoice está en draft
            try {
              if (fullInvoice.status === 'draft') {
                console.log("🔄 Finalizando invoice draft...");
                const finalizedInvoice = await stripe.invoices.finalizeInvoice(fullInvoice.id, {
                  expand: ['payment_intent'],
                }) as Stripe.Invoice & {
                  payment_intent?: Stripe.PaymentIntent | string;
                };
                
                if (finalizedInvoice.payment_intent) {
                  if (typeof finalizedInvoice.payment_intent === 'string') {
                    const pi = await stripe.paymentIntents.retrieve(finalizedInvoice.payment_intent);
                    paymentIntentId = pi.id;
                    clientSecret = pi.client_secret || undefined;
                    paymentIntentStatus = pi.status;
                    console.log("🔑 PaymentIntent creado al finalizar invoice:", pi.status);
                    
                    // FASE 1: Actualizar PaymentIntent con método de pago Y metadatos AL MISMO TIEMPO
                    try {
                      console.log("🔄 FASE 1: Actualizando PaymentIntent finalizado con metadatos...");
                      const updatedPI = await stripe.paymentIntents.update(pi.id, {
                        payment_method: paymentMethodId,
                        metadata: {
                          user_id: authUser.id,
                          supabase_user_id: authUser.id,
                          payment_type: "subscription",
                          price_id: priceId,
                        },
                      });
                      console.log("✅ PaymentIntent actualizado con metadatos:", updatedPI.metadata);
                      paymentIntentStatus = updatedPI.status;
                      clientSecret = updatedPI.client_secret || clientSecret;
                    } catch (metadataError) {
                      console.error("⚠️ Error agregando metadatos:", metadataError);
                    }
                    
                    // Intentar confirmar si es necesario
                    if (pi.status === 'requires_confirmation' || pi.status === 'requires_payment_method') {
                      const confirmed = await stripe.paymentIntents.confirm(pi.id);
                      paymentIntentStatus = confirmed.status;
                      clientSecret = confirmed.client_secret || clientSecret;
                      console.log("✅ PaymentIntent confirmado después de finalizar:", confirmed.status);
                    }
                  } else {
                    const pi = finalizedInvoice.payment_intent as Stripe.PaymentIntent;
                    paymentIntentId = pi.id;
                    clientSecret = pi.client_secret || undefined;
                    paymentIntentStatus = pi.status;
                    console.log("🔑 PaymentIntent creado (objeto):", pi.status);
                  }
                }
              }
            } catch (finalizeError) {
              console.error("❌ Error finalizando invoice:", finalizeError);
            }
          }
        } catch (invoiceError) {
          console.error("❌ Error recuperando invoice completo:", invoiceError);
        }
      }
    } else {
      console.log("⚠️ La suscripción no tiene latest_invoice");
    }

    // Si después de todos los intentos no hay PaymentIntent, crearlo manualmente CON metadatos
    if (!clientSecret && subscription.latest_invoice) {
      try {
        console.log("🔄 No se encontró PaymentIntent. Creando PaymentIntent manualmente CON metadatos...");
        
        const invoice = subscription.latest_invoice as Stripe.Invoice;
        
        // PRIMERO: Verificar si el invoice ya está finalizado, si no, finalizarlo
        let finalizedInvoice: Stripe.Invoice & { payment_intent?: Stripe.PaymentIntent | string };
        
        if (invoice.status === 'draft') {
          try {
            console.log("🔄 Finalizando invoice draft para crear PaymentIntent...");
            finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id) as Stripe.Invoice & {
              payment_intent?: Stripe.PaymentIntent | string;
            };
            console.log("✅ Invoice finalizado");
          } catch (finalizeError) {
            console.error("❌ Error finalizando invoice:", finalizeError);
            throw finalizeError;
          }
        } else {
          // El invoice ya está finalizado, obtenerlo con el PaymentIntent expandido
          console.log("ℹ️ Invoice ya está finalizado, obteniendo PaymentIntent...");
          finalizedInvoice = await stripe.invoices.retrieve(invoice.id, {
            expand: ['payment_intent'],
          }) as Stripe.Invoice & {
            payment_intent?: Stripe.PaymentIntent | string;
          };
        }
        
        // SEGUNDO: Crear o obtener el PaymentIntent
        let piId: string;
        
        if (!finalizedInvoice.payment_intent) {
          // El invoice no tiene PaymentIntent, crearlo manualmente
          console.log("🔄 Creando PaymentIntent manualmente para el invoice...");
          const createdPI = await stripe.paymentIntents.create({
            amount: finalizedInvoice.amount_due,
            currency: finalizedInvoice.currency,
            customer: customerId,
            payment_method: paymentMethodId,
            metadata: {
              user_id: authUser.id,
              supabase_user_id: authUser.id,
              payment_type: "subscription",
              price_id: priceId,
              invoice_id: invoice.id,
              subscription_id: subscription.id,
            },
            // NO confirmar automáticamente, lo haremos después
            confirm: false,
          });
          piId = createdPI.id;
          console.log("✅ PaymentIntent creado:", piId);
          
          // Asociar el PaymentIntent al invoice
          try {
            await stripe.invoices.update(invoice.id, {
              default_payment_method: paymentMethodId,
            });
            console.log("✅ PaymentIntent asociado al invoice");
          } catch (updateError) {
            console.warn("⚠️ Error asociando PaymentIntent al invoice:", updateError);
          }
        } else {
          // El invoice ya tiene PaymentIntent, obtener su ID
          piId = typeof finalizedInvoice.payment_intent === 'string'
            ? finalizedInvoice.payment_intent
            : finalizedInvoice.payment_intent.id;
          
          console.log("🔄 Agregando metadatos al PaymentIntent existente...");
          await stripe.paymentIntents.update(piId, {
            payment_method: paymentMethodId,
            metadata: {
              user_id: authUser.id,
              supabase_user_id: authUser.id,
              payment_type: "subscription",
              price_id: priceId,
              invoice_id: invoice.id,
              subscription_id: subscription.id,
            },
          });
          console.log("✅ Metadatos agregados al PaymentIntent");
        }
        
        // TERCERO: Confirmar el PaymentIntent (esto dispara el webhook CON metadatos)
        console.log("🔄 Confirmando PaymentIntent...");
        const confirmedPI = await stripe.paymentIntents.confirm(piId);
        console.log("✅ PaymentIntent confirmado:", confirmedPI.status);
        
        paymentIntentId = confirmedPI.id;
        clientSecret = confirmedPI.client_secret || undefined;
        paymentIntentStatus = confirmedPI.status;
        
        // El invoice debería pagarse automáticamente
        const paidInvoice = await stripe.invoices.retrieve(invoice.id) as Stripe.Invoice & {
          payment_intent?: Stripe.PaymentIntent | string;
        };

        console.log("✅ Invoice status:", paidInvoice.status);
      } catch (payError: unknown) {
        console.error("❌ Error en el proceso de pago del invoice:", payError);
        
        // Si el error es porque requiere acción adicional, puede que haya un PaymentIntent
        if (payError && typeof payError === 'object' && 'payment_intent' in payError) {
          const pi = (payError as { payment_intent?: Stripe.PaymentIntent }).payment_intent;
          if (pi) {
            paymentIntentId = pi.id;
            clientSecret = pi.client_secret || undefined;
            paymentIntentStatus = pi.status;
            console.log("🔑 PaymentIntent encontrado en error:", pi.status);
          }
        }
        
        // Re-lanzar el error si no pudimos recuperar el PaymentIntent
        if (!paymentIntentId) {
          console.error("❌ No se pudo crear/obtener PaymentIntent para la suscripción");
          // No lanzar error, permitir que continúe y el webhook lo maneje
        }
      }
    }

    // FASE 2: Guardar el pago INMEDIATAMENTE después de crear la suscripción
    // Esto asegura que el pago se guarde incluso si el PaymentIntent ya está succeeded
    if (paymentIntentId) {
      console.log("💾 FASE 2: Guardando pago INMEDIATAMENTE después de crear suscripción...");
      console.log("💾 PaymentIntent ID:", paymentIntentId);
      
      try {
        // Obtener el PaymentIntent completo de Stripe con payment_method expandido
        console.log("🔄 Recuperando PaymentIntent de Stripe...");
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
          expand: ['payment_method'],
        });
        console.log("✅ PaymentIntent recuperado:", {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          customer: paymentIntent.customer,
        });
        
        // Asegurar metadatos si no los tiene (por si acaso)
        if (!paymentIntent.metadata?.user_id) {
          console.log("🔄 Agregando metadatos faltantes al PaymentIntent...");
          try {
            await stripe.paymentIntents.update(paymentIntentId, {
              metadata: {
                user_id: authUser.id,
                supabase_user_id: authUser.id,
                payment_type: "subscription",
                price_id: priceId,
              },
            });
            console.log("✅ Metadatos agregados");
            // Recuperar de nuevo para tener los metadatos actualizados
            const updatedPI = await stripe.paymentIntents.retrieve(paymentIntentId);
            paymentIntent.metadata = updatedPI.metadata;
          } catch (metadataError) {
            console.error("⚠️ Error agregando metadatos faltantes:", metadataError);
          }
        } else {
          console.log("✅ PaymentIntent ya tiene metadatos:", paymentIntent.metadata);
        }
        
        // Obtener información del precio
        console.log("🔄 Recuperando información del precio...");
        const price = await stripe.prices.retrieve(priceId);
        const productId = typeof price.product === 'string' ? price.product : price.product?.id;
        console.log("✅ Precio obtenido:", { priceId, productId });

        // Preparar datos del pago
        const paymentData = stripePaymentIntentToPaymentData(
          paymentIntent, 
          authUser.id, 
          "subscription", 
          {
            stripeInvoiceId: subscription.latest_invoice 
              ? (typeof subscription.latest_invoice === 'string' 
                  ? subscription.latest_invoice 
                  : subscription.latest_invoice.id)
              : undefined,
            stripeSubscriptionId: subscription.id,
            priceId: priceId,
            productId: productId,
          }
        );

        console.log("💾 Datos del pago preparados:", {
          userId: paymentData.userId,
          stripePaymentIntentId: paymentData.stripePaymentIntentId,
          paymentType: paymentData.paymentType,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          stripeSubscriptionId: paymentData.stripeSubscriptionId,
        });

        // Crear registro de pago
        console.log("🔄 Guardando en base de datos...");
        const savedPayment = await upsertPayment(paymentData);

        console.log("✅✅✅ PAGO GUARDADO EXITOSAMENTE EN BASE DE DATOS ✅✅✅");
        console.log("✅ ID del pago en BD:", savedPayment?.id);
        console.log("✅ PaymentIntent ID:", savedPayment?.stripe_payment_intent_id);
        console.log("✅ Tipo de pago:", savedPayment?.payment_type);
        console.log("✅ Monto:", savedPayment?.amount, savedPayment?.currency);
        
      } catch (paymentError) {
        console.error("❌❌❌ ERROR CRÍTICO GUARDANDO PAGO ❌❌❌");
        console.error("❌ Error:", paymentError);
        console.error("❌ Mensaje:", paymentError instanceof Error ? paymentError.message : String(paymentError));
        console.error("❌ Stack:", paymentError instanceof Error ? paymentError.stack : "No stack trace");
        
        // Intentar obtener más detalles del error
        if (paymentError && typeof paymentError === 'object') {
          console.error("❌ Detalles completos del error:", JSON.stringify(paymentError, null, 2));
        }
        
        // NO lanzar el error - dejar que el webhook lo maneje
        console.warn("⚠️ El pago NO se guardó inmediatamente, pero el webhook debería guardarlo");
      }
    } else {
      console.warn("⚠️ NO hay PaymentIntent ID - La suscripción puede haberse procesado sin PaymentIntent separado");
      console.warn("⚠️ Subscription ID:", subscription.id);
      console.warn("⚠️ Latest Invoice:", subscription.latest_invoice);
      console.warn("⚠️ El webhook debería guardar este pago cuando se procese");
      // NO lanzar error - la suscripción se creó correctamente
    }

    console.log("✅ Subscription created:", {
      subscriptionId: subscription.id,
      status: subscription.status,
      hasClientSecret: !!clientSecret,
      paymentIntentStatus: paymentIntentStatus,
      paymentIntentId: paymentIntentId,
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      clientSecret: clientSecret,
      paymentIntentStatus: paymentIntentStatus,
      paymentIntentId: paymentIntentId,
    });
  } catch (error) {
    console.error("Error creando suscripción:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al crear la suscripción",
      },
      { status: 500 }
    );
  }
}
