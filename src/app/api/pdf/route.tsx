import { NextRequest, NextResponse } from "next/server";
import { pdf } from "@react-pdf/renderer";
import { ResponsivaPDF } from "@/components/pdf/ResponsivaPDF";
import { ResponsivaFormData } from "@/types/responsiva";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const responsivaData: ResponsivaFormData = body;

    console.log("📄 Generando PDF para responsiva:", responsivaData.nombre);

    // Generar el PDF
    const pdfStream = await pdf(
      <ResponsivaPDF data={responsivaData} />
    ).toBlob();

    console.log("✅ PDF generado exitosamente");

    // Convertir Blob a ArrayBuffer para obtener el tamaño
    const pdfArrayBuffer = await pdfStream.arrayBuffer();
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // Retornar el PDF como respuesta
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="responsiva-${responsivaData.nombre.replace(
          /\s+/g,
          "-"
        )}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("❌ Error generando PDF:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: "Error generando PDF", details: errorMessage },
      { status: 500 }
    );
  }
}

// Endpoint para generar PDF desde ID de responsiva
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const responsivaId = searchParams.get("id");

    if (!responsivaId) {
      return NextResponse.json(
        { error: "ID de responsiva requerido" },
        { status: 400 }
      );
    }

    console.log("📄 Generando PDF para responsiva ID:", responsivaId);

    // Importar el cliente de Supabase
    const { createServiceClient } = await import("@/lib/supabase-server");
    const supabase = createServiceClient();

    // Obtener los datos de la responsiva desde la base de datos
    const { data: responsivaData, error: responsivaError } = await supabase
      .from("responsivas")
      .select("*")
      .eq("id", responsivaId)
      .single();

    if (responsivaError || !responsivaData) {
      console.error("❌ Error obteniendo responsiva:", responsivaError);
      return NextResponse.json(
        { error: "Responsiva no encontrada" },
        { status: 404 }
      );
    }

    console.log("✅ Responsiva encontrada:", responsivaData.nombre);

    // Convertir los datos de la base de datos al formato esperado por ResponsivaPDF
    const formattedData = {
      nombre: responsivaData.nombre,
      fechaNacimiento: responsivaData.fecha_nacimiento,
      celular: responsivaData.celular,
      email: responsivaData.email,
      instagram: responsivaData.instagram,
      escuelaEmpresa: responsivaData.escuela_empresa,
      comoSeEntero: responsivaData.como_se_entero,
      contactoEmergencia: responsivaData.contacto_emergencia,
      telefonoEmergencia: responsivaData.telefono_emergencia,
      tieneSeguroMedico: responsivaData.tiene_seguro_medico,
      lugarAtencionMedica: responsivaData.lugar_atencion_medica,
      lesionesRestriccionesMedicamentos:
        responsivaData.lesiones_restricciones_medicamentos,
      frecuenciaEjercicio: responsivaData.frecuencia_ejercicio,
      aceptaTerminos: responsivaData.acepta_terminos,
      aceptaAvisoPrivacidad: responsivaData.acepta_aviso_privacidad,
      firmaDigital: responsivaData.firma_digital,
      fechaFirma: responsivaData.fecha_firma,
      timestamp: responsivaData.created_at,
      estado: responsivaData.estado,
    };

    // Generar el PDF
    const pdfStream = await pdf(
      <ResponsivaPDF data={formattedData} />
    ).toBlob();

    console.log("✅ PDF generado exitosamente");

    // Convertir Blob a ArrayBuffer para obtener el tamaño
    const pdfArrayBuffer = await pdfStream.arrayBuffer();
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // Retornar el PDF como respuesta
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="responsiva-${responsivaData.nombre.replace(
          /\s+/g,
          "-"
        )}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("❌ Error obteniendo responsiva:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: "Error obteniendo responsiva", details: errorMessage },
      { status: 500 }
    );
  }
}
