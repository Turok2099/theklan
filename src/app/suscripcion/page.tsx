"use client";

import { useEffect, useState, useRef } from "react";
import { getStripe } from "@/lib/stripe-client";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/AuthGuard";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { StripeElements, StripePaymentElement } from "@stripe/stripe-js";

// Productos de suscripción disponibles (ordenados por precio de menor a mayor)
const SUBSCRIPTION_PRODUCTS = [
  {
    id: "price_1SPsUCJ0XRrAhU7IhjuPHSic",
    name: "Basic",
    price: "1.450,00",
    currency: "MXN",
    productId: "prod_TMbhI2na2Ej5fK",
  },
  {
    id: "price_1SPsSyJ0XRrAhU7ILOkal1fd",
    name: "Full Jiu Jitsu",
    price: "1.650,00",
    currency: "MXN",
    productId: "prod_TMbg1ZHn470UN4",
  },
  {
    id: "price_1SPsTXJ0XRrAhU7IwcRYCpAu",
    name: "Ilimitado",
    price: "1.990,00",
    currency: "MXN",
    productId: "prod_TMbg4hEfsi5VKg",
  },
];

export default function SuscripcionPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Estados para tipo de pago y selección
  const [paymentType, setPaymentType] = useState<"subscription" | "one-time">("subscription");
  const [selectedProductId, setSelectedProductId] = useState<string>(SUBSCRIPTION_PRODUCTS[0].id);
  const [customAmount, setCustomAmount] = useState<string>("500.00");
  
  // Estados para Stripe
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingIntent, setIsLoadingIntent] = useState(true);
  const [checkoutKey, setCheckoutKey] = useState(0); // Key única para forzar recreación del contenedor
  const [checkout, setCheckout] = useState<{
    elements: StripeElements;
    paymentElement: StripePaymentElement;
    clientSecret: string;
    paymentType: "subscription" | "one-time";
  } | null>(null);
  const [priceIdFromServer, setPriceIdFromServer] = useState<string | null>(null);
  const [customerIdFromServer, setCustomerIdFromServer] = useState<string | null>(null);

  // Refs para evitar múltiples inicializaciones
  const isInitializingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const paymentElementRef = useRef<StripePaymentElement | null>(null);
  const elementsRef = useRef<StripeElements | null>(null);

  // Función para crear el Intent (SetupIntent o PaymentIntent)
  const createIntent = async (isUpdate = false) => {
    if (!user) return;

    // Evitar múltiples llamadas simultáneas
    if (isInitializingRef.current && !isUpdate) return;
    
    if (!isUpdate) {
      setIsLoadingIntent(true);
      isInitializingRef.current = true;
    }

    try {
      const body: {
        paymentType: "subscription" | "one-time";
        priceId?: string;
        customerEmail?: string;
        amount?: number;
      } = {
        paymentType: paymentType,
        customerEmail: user.email,
      };

      if (paymentType === "subscription") {
        body.priceId = selectedProductId;
      } else {
        // Convertir monto a centavos
        const amountInPesos = parseFloat(customAmount);
        if (isNaN(amountInPesos) || amountInPesos <= 0) {
          if (!isUpdate) {
            toast.error("Por favor, ingresa un monto válido");
            setIsLoadingIntent(false);
            isInitializingRef.current = false;
          }
          return;
        }
        body.amount = Math.round(amountInPesos * 100); // Convertir a centavos
      }

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la sesión de pago");
      }

      // Limpiar el checkout anterior de manera segura
      if (paymentElementRef.current) {
        try {
          paymentElementRef.current.unmount();
        } catch (error) {
          console.log("Error al desmontar Payment Element anterior:", error);
        } finally {
          paymentElementRef.current = null;
          elementsRef.current = null;
        }
      }

      // Limpiar estado antes de crear nuevo intent
      setCheckout(null);

      setClientSecret(data.clientSecret);
      setPriceIdFromServer(data.priceId || null);
      setCustomerIdFromServer(data.customerId || null);
      setIsLoadingIntent(false);
      isInitializingRef.current = false;
    } catch (error) {
      console.error("Error:", error);
      if (!isUpdate) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Error al crear la sesión de pago"
        );
      }
      setIsLoadingIntent(false);
      isInitializingRef.current = false;
    }
  };

  // Crear intent inicial cuando carga la página
  useEffect(() => {
    if (user && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      createIntent();
    }
  }, [user]);

  // Recrear intent cuando cambia el tipo de pago o producto (después de la inicialización)
  useEffect(() => {
    if (user && hasInitializedRef.current && checkout) {
      const timeoutId = setTimeout(() => {
        createIntent(true);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [paymentType, selectedProductId]);

  // Efecto separado para actualizar cuando cambia el monto personalizado
  useEffect(() => {
    if (user && hasInitializedRef.current && checkout && paymentType === "one-time" && customAmount) {
      const amountNum = parseFloat(customAmount);
      if (!isNaN(amountNum) && amountNum > 0) {
        const timeoutId = setTimeout(() => {
          createIntent(true);
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [customAmount]);

  // Efecto para inicializar checkout cuando clientSecret está disponible
  useEffect(() => {
    if (!clientSecret || checkout) return;

    let mounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    const initializeCheckout = async () => {
      let attempts = 0;
      const maxAttempts = 30;

      const tryInitialize = async () => {
        if (!mounted) return;
        
        attempts++;
        const checkoutContainer = document.getElementById("checkout");
        
        if (!checkoutContainer) {
          if (attempts < maxAttempts) {
            timeoutId = setTimeout(tryInitialize, 200);
            return;
          } else {
            console.error("No se encontró el contenedor de pago");
            if (mounted) {
              toast.error("Error: No se encontró el contenedor de pago");
            }
            return;
          }
        }

        try {
          if (!mounted || !document.getElementById("checkout")) return;

          const stripe = await getStripe();
          if (!stripe || !mounted) {
            throw new Error("Error al cargar Stripe");
          }

          console.log("Inicializando Stripe Elements...");

          const elementsInstance = stripe.elements({
            clientSecret: clientSecret,
            appearance: {
              theme: 'stripe',
            },
          });

          const paymentElementInstance = elementsInstance.create('payment', {
            layout: 'tabs',
          });

          if (!mounted || !document.getElementById("checkout")) {
            try {
              paymentElementInstance.unmount();
            } catch {
              // Ignorar errores
            }
            return;
          }

          paymentElementInstance.mount(checkoutContainer);
          paymentElementRef.current = paymentElementInstance;
          elementsRef.current = elementsInstance;

          console.log("Payment Element montado correctamente");

          if (mounted) {
            setCheckout({
              elements: elementsInstance,
              paymentElement: paymentElementInstance,
              clientSecret,
              paymentType: paymentType,
            });
          }
        } catch (error) {
          console.error("Error inicializando checkout:", error);
          if (mounted && error instanceof Error) {
            toast.error(error.message || "Error al inicializar el formulario de pago");
          }
        }
      };

      timeoutId = setTimeout(tryInitialize, 300);
    };

    initializeCheckout();

    return () => {
      mounted = false;
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Desmontar de manera segura
      if (paymentElementRef.current) {
        try {
          paymentElementRef.current.unmount();
        } catch (error) {
          console.log("Error en cleanup:", error);
        } finally {
          paymentElementRef.current = null;
        }
      }
    };
  }, [clientSecret, paymentType]);

  const handlePayment = async () => {
    if (!checkout?.elements || !checkout?.paymentElement) {
      toast.error("El formulario de pago no está listo");
      return;
    }

    const errorsDiv = document.getElementById("confirm-errors");
    if (errorsDiv) {
      errorsDiv.textContent = "";
    }

    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Error al cargar Stripe");
      }

      const { error: submitError } = await checkout.elements.submit();

      if (submitError) {
        const errorMessage = submitError.message || "Error al procesar el formulario";
        if (errorsDiv) {
          errorsDiv.textContent = errorMessage;
        }
        toast.error(errorMessage);
        return;
      }

      if (checkout.paymentType === "subscription") {
        const { error: setupError, setupIntent } = await stripe.confirmSetup({
          elements: checkout.elements,
          clientSecret: checkout.clientSecret,
          redirect: 'if_required',
        });

        if (setupError) {
          const errorMessage = setupError.message || "Error al configurar el método de pago";
          if (errorsDiv) {
            errorsDiv.textContent = errorMessage;
          }
          toast.error(errorMessage);
          return;
        }

        if (
          setupIntent &&
          setupIntent.status === 'succeeded' &&
          setupIntent.payment_method
        ) {
          try {
            if (!customerIdFromServer) {
              throw new Error("No se recibió el ID de cliente desde el servidor");
            }

            const subscriptionResponse = await fetch("/api/stripe/create-subscription", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customerId: customerIdFromServer,
                paymentMethodId: typeof setupIntent.payment_method === 'string' 
                  ? setupIntent.payment_method 
                  : setupIntent.payment_method.id,
                priceId: priceIdFromServer || selectedProductId,
              }),
            });

            const subscriptionData = await subscriptionResponse.json();

            console.log("📦 Subscription response:", {
              ok: subscriptionResponse.ok,
              subscriptionId: subscriptionData.subscriptionId,
              status: subscriptionData.status,
              hasClientSecret: !!subscriptionData.clientSecret,
              paymentIntentStatus: subscriptionData.paymentIntentStatus,
            });

            if (!subscriptionResponse.ok) {
              throw new Error(subscriptionData.error || "Error al crear suscripción");
            }

            // Si hay un clientSecret, significa que hay un PaymentIntent pendiente
            // Necesitamos confirmarlo para completar el primer pago de la suscripción
            // FASE 3: SIEMPRE intentar guardar el pago si hay paymentIntentId
            // Esto asegura que el pago se guarde incluso si no hay clientSecret o si el pago se procesa automáticamente
            if (subscriptionData.paymentIntentId) {
              console.log("💾 FASE 3: Guardando pago desde frontend (siempre, si hay paymentIntentId):", {
                paymentIntentId: subscriptionData.paymentIntentId,
                paymentType: "subscription",
                priceId: priceIdFromServer || selectedProductId,
                hasClientSecret: !!subscriptionData.clientSecret,
              });
              
              try {
                const saveResponse = await fetch("/api/stripe/save-payment", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    paymentIntentId: subscriptionData.paymentIntentId,
                    paymentType: "subscription",
                    priceId: priceIdFromServer || selectedProductId,
                  }),
                });
                
                if (saveResponse.ok) {
                  console.log("✅ Pago guardado desde frontend (FASE 3)");
                } else {
                  const saveError = await saveResponse.json();
                  console.error("⚠️ Error guardando pago desde frontend (FASE 3):", saveError);
                  // No bloquear el flujo si falla
                }
              } catch (saveError) {
                console.error("⚠️ Error en llamada save-payment (FASE 3):", saveError);
                // No bloquear el flujo si falla
              }
            }

            if (subscriptionData.clientSecret) {
              console.log("🔑 ClientSecret recibido, confirmando PaymentIntent...");
              
              const stripe = await getStripe();
              if (!stripe) {
                throw new Error("Error al cargar Stripe");
              }

              try {
                const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
                  clientSecret: subscriptionData.clientSecret,
                  redirect: 'if_required',
                });

                console.log("💳 PaymentIntent confirmation result:", {
                  error: paymentError?.message,
                  status: paymentIntent?.status,
                  requiresAction: paymentIntent?.status === 'requires_action',
                });

                if (paymentError) {
                  console.error("❌ Error confirmando PaymentIntent:", paymentError);
                  throw new Error(paymentError.message || "Error al procesar el pago inicial");
                }

                if (paymentIntent) {
                  if (paymentIntent.status === 'requires_action') {
                    // Si requiere acción adicional (como 3D Secure), el usuario será redirigido automáticamente
                    console.log("⚠️ PaymentIntent requiere acción adicional");
                    throw new Error("Tu tarjeta requiere autenticación adicional. Por favor, completa el proceso.");
                  }
                  
                  if (paymentIntent.status !== 'succeeded') {
                    console.error("❌ PaymentIntent no completado:", paymentIntent.status);
                    throw new Error(`El pago está en estado: ${paymentIntent.status}`);
                  }
                  
                  console.log("✅ PaymentIntent confirmado exitosamente");
                  
                  // Guardar el pago después de confirmar (respaldo adicional)
                  // Nota: Ya se guardó en FASE 3, pero esto es un respaldo adicional
                  if (paymentIntent.id) {
                    console.log("💾 Guardando pago después de confirmación (respaldo adicional):", {
                      paymentIntentId: paymentIntent.id,
                    });
                    try {
                      const saveResponse = await fetch("/api/stripe/save-payment", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          paymentIntentId: paymentIntent.id,
                          paymentType: "subscription",
                          priceId: priceIdFromServer || selectedProductId,
                        }),
                      });
                      
                      if (saveResponse.ok) {
                        console.log("✅ Pago guardado después de confirmación (respaldo)");
                      } else {
                        const saveError = await saveResponse.json();
                        console.error("⚠️ Error guardando pago después de confirmación:", saveError);
                      }
                    } catch (saveError) {
                      console.error("⚠️ Error guardando pago después de confirmación:", saveError);
                      // No bloquear el flujo si falla
                    }
                  }
                }
              } catch (confirmError) {
                console.error("❌ Error en confirmPayment:", confirmError);
                throw confirmError;
              }
            } else {
              console.log("ℹ️ No hay clientSecret, el pago puede haber sido procesado automáticamente");
              // Nota: El pago ya se intentó guardar en FASE 3, pero esto es un respaldo adicional
              if (subscriptionData.paymentIntentId) {
                console.log("💾 Guardando pago sin clientSecret (respaldo adicional):", {
                  paymentIntentId: subscriptionData.paymentIntentId,
                });
                try {
                  const saveResponse = await fetch("/api/stripe/save-payment", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      paymentIntentId: subscriptionData.paymentIntentId,
                      paymentType: "subscription",
                      priceId: priceIdFromServer || selectedProductId,
                    }),
                  });
                  
                  if (saveResponse.ok) {
                    console.log("✅ Pago guardado sin clientSecret (respaldo)");
                  } else {
                    const saveError = await saveResponse.json();
                    console.error("⚠️ Error guardando pago sin clientSecret:", saveError);
                  }
                } catch (saveError) {
                  console.error("⚠️ Error guardando pago sin clientSecret:", saveError);
                  // No bloquear el flujo si falla
                }
              }
            }

            toast.success("¡Suscripción completada exitosamente!");
            
            setTimeout(() => {
              router.push("/dashboard");
            }, 1500);
          } catch (subscriptionError) {
            console.error("Error creando suscripción:", subscriptionError);
            toast.error(
              subscriptionError instanceof Error
                ? subscriptionError.message
                : "Error al crear la suscripción"
            );
          }
        }
      } else {
        const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
          elements: checkout.elements,
          clientSecret: checkout.clientSecret,
          redirect: 'if_required',
        });

        if (paymentError) {
          const errorMessage = paymentError.message || "Error al procesar el pago";
          if (errorsDiv) {
            errorsDiv.textContent = errorMessage;
          }
          toast.error(errorMessage);
          return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
          // El webhook de Stripe se encargará de guardar el pago en la base de datos
          // pero podemos hacer una llamada aquí también para asegurarnos
          try {
            await fetch("/api/stripe/save-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentIntentId: paymentIntent.id,
                paymentType: "one-time",
              }),
            });
          } catch (error) {
            console.error("Error guardando pago:", error);
            // No bloquear el flujo si falla
          }

          toast.success("¡Pago completado exitosamente!");
          
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Error procesando pago:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al procesar el pago"
      );
    }
  };

  const selectedProduct = SUBSCRIPTION_PRODUCTS.find(p => p.id === selectedProductId);

  return (
    <ProtectedRoute>
      <main
        className="min-h-screen py-8 px-4"
        style={{
          backgroundColor: "#f9fafb",
          color: "#111827",
          fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
          position: "relative",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <div
          className="mx-auto max-w-2xl"
          style={{
            maxWidth: "42rem",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "1rem",
            paddingRight: "1rem",
          }}
        >
          <div
            className="rounded-lg shadow-lg p-8"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              padding: "2rem",
            }}
          >
            <h1
              className="mb-2"
              style={{
                fontSize: "1.875rem",
                fontWeight: "700",
                color: "#111827",
                marginBottom: "0.5rem",
                lineHeight: "1.2",
                fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
              }}
            >
              Pagos The Klan BJJ
            </h1>
            <p
              className="mb-8"
              style={{
                color: "#4b5563",
                marginBottom: "2rem",
                fontSize: "1rem",
                lineHeight: "1.5",
                fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
              }}
            >
              Selecciona el tipo de pago y completa la información
            </p>

            {/* Formulario de selección - Siempre visible */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {/* Selector de tipo de pago */}
              <div>
                <label
                  htmlFor="payment-type"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Tipo de Pago
                </label>
                <select
                  id="payment-type"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as "subscription" | "one-time")}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    color: "#111827",
                    backgroundColor: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <option value="subscription">Suscripción</option>
                  <option value="one-time">Pago Único</option>
                </select>
              </div>

              {/* Selector de productos (solo para suscripciones) */}
              {paymentType === "subscription" && (
                <div>
                  <label
                    htmlFor="product-select"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Selecciona un Plan
                  </label>
                  <select
                    id="product-select"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      color: "#111827",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    {SUBSCRIPTION_PRODUCTS.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.price} {product.currency} / mes
                      </option>
                    ))}
                  </select>
                  {selectedProduct && (
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.75rem",
                        backgroundColor: "#f9fafb",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        color: "#6b7280",
                      }}
                    >
                      <strong>{selectedProduct.name}:</strong> {selectedProduct.price} {selectedProduct.currency} por mes
                    </div>
                  )}
                </div>
              )}

              {/* Input para monto personalizado (solo para pagos únicos) */}
              {paymentType === "one-time" && (
                <div>
                  <label
                    htmlFor="custom-amount"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Monto (MXN)
                  </label>
                  <input
                    id="custom-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Ej: 500.00"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      color: "#111827",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Loading spinner mientras se carga el intent inicial */}
            {isLoadingIntent && !clientSecret && (
              <div
                className="flex items-center justify-center py-12"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "3rem",
                  paddingBottom: "3rem",
                  marginTop: "1.5rem",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "3rem 1.5rem",
                }}
              >
                <div
                  className="animate-spin rounded-full border-b-2 border-red-600"
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "50%",
                    borderTopWidth: "2px",
                    borderBottomWidth: "2px",
                    borderBottomColor: "#dc2626",
                    borderTopColor: "transparent",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                <span style={{ marginLeft: "1rem", color: "#6b7280" }}>
                  Inicializando formulario...
                </span>
              </div>
            )}

            {/* Contenedor wrapper para el formulario */}
            <div
              style={{
                minHeight: "400px",
                width: "100%",
                position: "relative",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                padding: "1.5rem",
                marginTop: "1.5rem",
              }}
            >
              {/* Spinner de carga - Solo se muestra cuando NO hay checkout y hay clientSecret */}
              {!checkout && clientSecret && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "400px",
                    color: "#6b7280",
                  }}
                >
                  <div
                    className="animate-spin rounded-full border-b-2 border-red-600"
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      borderTopWidth: "2px",
                      borderBottomWidth: "2px",
                      borderBottomColor: "#dc2626",
                      borderTopColor: "transparent",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  <span style={{ marginLeft: "1rem" }}>
                    Cargando formulario de pago...
                  </span>
                </div>
              )}

              {/* Contenedor de checkout - Estable, sin manipulación manual del DOM */}
              <div
                id="checkout"
                style={{
                  display: checkout ? "block" : "none",
                  minHeight: checkout ? "400px" : "0",
                  width: "100%",
                }}
              >
                {/* Este contenedor DEBE estar siempre vacío para Stripe */}
              </div>
            </div>

            {/* Mensaje de errores */}
            <div
              id="confirm-errors"
              style={{
                color: "#dc2626",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                marginTop: "1rem",
                minHeight: "1.25rem",
              }}
            ></div>

            {/* Botón de confirmación - Siempre visible cuando hay checkout */}
            {checkout && (
              <button
                id="pay-button"
                type="button"
                onClick={handlePayment}
                style={{
                  width: "100%",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  fontWeight: "700",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  transition: "background-color 0.2s ease-in-out",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  marginTop: "1.5rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#b91c1c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#dc2626";
                }}
              >
                {paymentType === "subscription"
                  ? "Confirmar Suscripción"
                  : "Confirmar Pago"}
              </button>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}