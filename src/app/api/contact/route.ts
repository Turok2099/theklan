import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validaciones básicas
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Enviar email con Resend
    const data = await resend.emails.send({
      from: "The Klan BJJ <onboarding@resend.dev>", // Dominio verificado de Resend
      to: ["contacto@theklanbjj.com.mx"],
      replyTo: email, // Para poder responder directamente al cliente
      subject: `Nuevo mensaje de contacto: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #dc2626; margin-bottom: 5px; }
              .value { background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #dc2626; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">📧 Nuevo Mensaje de Contacto</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">The Klan BJJ - Formulario Web</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">👤 Nombre:</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">📧 Email:</div>
                  <div class="value"><a href="mailto:${email}" style="color: #dc2626; text-decoration: none;">${email}</a></div>
                </div>
                ${
                  phone
                    ? `
                <div class="field">
                  <div class="label">📱 Teléfono:</div>
                  <div class="value"><a href="tel:${phone}" style="color: #dc2626; text-decoration: none;">${phone}</a></div>
                </div>
                `
                    : ""
                }
                <div class="field">
                  <div class="label">💬 Mensaje:</div>
                  <div class="value" style="white-space: pre-wrap;">${message}</div>
                </div>
                <div class="footer">
                  <p>Este mensaje fue enviado desde el formulario de contacto en <strong>theklanbjj.com.mx</strong></p>
                  <p>Puedes responder directamente a este correo para contactar al cliente</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error enviando email:", error);
    return NextResponse.json(
      { error: "Error al enviar el mensaje. Por favor intenta nuevamente." },
      { status: 500 }
    );
  }
}
