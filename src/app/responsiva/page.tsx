"use client";

import { ResponsivaForm } from "@/components/forms/ResponsivaForm";
import { ResponsivaFormType } from "@/lib/validations";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ResponsivaPage() {
  const { user } = useAuth();
  const [userEmail, setUserEmail] = useState<string>("");
  const [responsivaStatus, setResponsivaStatus] = useState<{
    hasResponsiva: boolean;
    isCompleted: boolean;
    isSigned: boolean;
    responsiva: {
      id: string;
      nombre: string;
      email: string;
      fechaCreacion: string;
      fechaFirma?: string;
      aceptaTerminos?: boolean;
      aceptaAvisoPrivacidad?: boolean;
    } | null;
  } | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const router = useRouter();
  const hasCheckedStatus = useRef(false);

  const checkResponsivaStatus = useCallback(async () => {
    if (!user || hasCheckedStatus.current) return; // Evitar ejecuciones múltiples

    hasCheckedStatus.current = true; // Marcar como ejecutado

    try {
      console.log("🔍 Verificando estado de responsiva...");
      const response = await fetch("/api/responsivas/status");
      const data = await response.json();

      if (response.ok) {
        console.log("📋 Estado de responsiva:", data);
        setResponsivaStatus(data);

        // Si ya tiene responsiva completada, redirigir al dashboard
        if (data.isCompleted) {
          console.log(
            "⚠️ Ya tienes responsiva completada, redirigiendo al dashboard"
          );
          router.push("/dashboard");
          return;
        }
      } else {
        console.error("❌ Error obteniendo estado de responsiva:", data.error);
      }
    } catch (error) {
      console.error("❌ Error verificando responsiva:", error);
    } finally {
      setLoadingStatus(false);
    }
  }, [user, router]);

  // Obtener email del usuario logueado y verificar estado de responsiva
  useEffect(() => {
    console.log("👤 Usuario en responsiva:", user);
    if (user?.email) {
      console.log("📧 Email del usuario:", user.email);
      setUserEmail(user.email);

      // Verificar si ya tiene responsiva
      checkResponsivaStatus();
    }
  }, [user, checkResponsivaStatus]); // Incluir user y checkResponsivaStatus

  const handleSubmit = async (data: ResponsivaFormType) => {
    console.log("🌐 HANDLE SUBMIT INICIADO");
    console.log("📋 Datos recibidos:", data);
    console.log("👤 Usuario actual:", user);
    console.log("📧 Email del usuario:", user?.email);
    console.log("🌐 handleSubmit llamado con datos:", data);

    try {
      console.log("📤 PREPARANDO REQUEST A /api/responsivas...");
      console.log("🌐 URL:", "/api/responsivas");
      console.log("📊 Método:", "POST");
      console.log("📋 Headers:", { "Content-Type": "application/json" });
      console.log("📦 Body:", JSON.stringify(data));
      console.log("📤 Enviando request a /api/responsivas...");

      const response = await fetch("/api/responsivas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("📊 RESPONSE RECIBIDA:");
      console.log("📊 - Status:", response.status);
      console.log("📊 - OK:", response.ok);
      console.log("📊 - Status Text:", response.statusText);
      console.log(
        "📊 - Headers:",
        Object.fromEntries(response.headers.entries())
      );
      console.log("📊 Response status:", response.status);
      console.log("📊 Response ok:", response.ok);

      const result = await response.json();
      console.log("📋 RESPONSE DATA:", result);
      console.log("📋 Response data:", result);

      if (!response.ok) {
        console.error("❌ Error response:", result);
        throw new Error(result.error || "Error al enviar la responsiva");
      }

      console.log("✅ Responsiva enviada exitosamente:", result);

      // Generar y enviar PDF automáticamente
      try {
        console.log("📄 Generando PDF...");

        const pdfResponse = await fetch("/api/pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (pdfResponse.ok) {
          console.log("✅ PDF generado exitosamente");

          // Crear blob y descargar automáticamente
          const pdfBlob = await pdfResponse.blob();
          const url = window.URL.createObjectURL(pdfBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `responsiva-${data.nombre.replace(/\s+/g, "-")}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          console.log("📥 PDF descargado automáticamente");

          // Redirigir al dashboard después de descargar el PDF
          console.log("🔄 Redirigiendo al dashboard...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000); // Esperar 2 segundos para que el usuario vea que se descargó el PDF
        } else {
          console.warn("⚠️ Error generando PDF:", await pdfResponse.text());
          // Redirigir al dashboard incluso si hay error en el PDF
          console.log("🔄 Redirigiendo al dashboard (con error en PDF)...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }
      } catch (pdfError) {
        console.error("❌ Error en generación de PDF:", pdfError);
        // Redirigir al dashboard incluso si hay error en el PDF
        console.log("🔄 Redirigiendo al dashboard (con error en PDF)...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
        // No lanzamos el error para no interrumpir el flujo principal
      }

      return result;
    } catch (error) {
      console.error("❌ Error enviando responsiva:", error);
      throw error;
    }
  };

  console.log("📧 Email que se pasa al formulario:", userEmail);

  // Mostrar loading mientras se verifica el estado
  if (loadingStatus) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando estado de responsiva...</p>
        </div>
      </main>
    );
  }

  // Si ya tiene responsiva completada, mostrar mensaje
  if (responsivaStatus?.isCompleted) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Responsiva Ya Completada
          </h2>
          <p className="text-gray-600 mb-6">
            Ya tienes una responsiva completada. Los términos y condiciones han
            sido aceptados.
            {responsivaStatus.isSigned
              ? " También incluye firma digital."
              : " La firma digital es opcional."}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <ResponsivaForm onSubmit={handleSubmit} defaultEmail={userEmail} />
      </div>
    </main>
  );
}
