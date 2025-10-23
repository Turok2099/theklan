import { Resend } from "resend";
import { pdf } from "@react-pdf/renderer";
import { ResponsivaPDF } from "@/components/pdf/ResponsivaPDF";
import { ResponsivaFormData } from "@/types/responsiva";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResponsivaEmail(responsivaData: ResponsivaFormData) {
  try {
    console.log("📧 Enviando email con PDF a:", responsivaData.email);

    // Generar PDF
    const pdfBlob = await pdf(<ResponsivaPDF data={responsivaData} />).toBlob();

    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    // Enviar email con PDF adjunto
    const emailResult = await resend.emails.send({
      from: "The Klan BJJ <noreply@theklanbjj.com.mx>",
      to: [responsivaData.email],
      subject: "Tu Responsiva de Inscripción - The Klan BJJ",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">THE KLAN BJJ</h1>
            <p style="margin: 5px 0 0 0; font-size: 16px;">Jiu Jitsu Brasileño en CDMX</p>
          </div>
          
          <div style="padding: 30px; background-color: #f9fafb;">
            <h2 style="color: #dc2626; margin-top: 0;">¡Bienvenido a The Klan!</h2>
            
            <p>Hola <strong>${responsivaData.nombre}</strong>,</p>
            
            <p>¡Gracias por completar tu responsiva de inscripción! Estamos emocionados de tenerte como parte de nuestra familia de Jiu Jitsu.</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #dc2626; margin-top: 0;">📋 Resumen de tu inscripción:</h3>
              <ul style="color: #374151;">
                <li><strong>Nombre:</strong> ${responsivaData.nombre}</li>
                <li><strong>Email:</strong> ${responsivaData.email}</li>
                <li><strong>Celular:</strong> ${responsivaData.celular}</li>
                <li><strong>Frecuencia:</strong> ${
                  responsivaData.frecuenciaEjercicio === "1dia"
                    ? "1 día a la semana"
                    : responsivaData.frecuenciaEjercicio === "2dias"
                    ? "2 días a la semana"
                    : "3 días o más a la semana"
                }</li>
                <li><strong>Estado:</strong> Pendiente de revisión</li>
              </ul>
            </div>
            
            <p>Tu responsiva ha sido registrada exitosamente y está siendo revisada por nuestro equipo. Te contactaremos pronto para coordinar tu primera clase.</p>
            
            <div style="background-color: #dc2626; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">📄 Documento adjunto</h3>
              <p style="margin-bottom: 0;">Encuentra tu responsiva oficial en formato PDF adjunta a este email. Guárdala como comprobante de tu inscripción.</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <h3 style="color: #dc2626;">📞 ¿Tienes preguntas?</h3>
              <p>Si tienes alguna pregunta sobre tu inscripción o sobre nuestras clases, no dudes en contactarnos:</p>
              <ul style="color: #374151;">
                <li><strong>Email:</strong> contacto@theklanbjj.com.mx</li>
                <li><strong>Teléfono:</strong> +52-56-1370-1366</li>
                <li><strong>WhatsApp:</strong> <a href="https://wa.me/525613701366" style="color: #dc2626;">+52-56-1370-1366</a></li>
              </ul>
            </div>
            
            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              ¡Nos vemos en el tatami!<br>
              <strong>El equipo de The Klan BJJ</strong>
            </p>
          </div>
          
          <div style="background-color: #1f2937; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 The Klan BJJ. Todos los derechos reservados.</p>
            <p style="margin: 5px 0 0 0;">Este email fue generado automáticamente. Por favor no responder.</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `responsiva-${responsivaData.nombre.replace(
            /\s+/g,
            "-"
          )}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log("✅ Email enviado exitosamente:", emailResult.data?.id);
    return emailResult;
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    throw error;
  }
}
