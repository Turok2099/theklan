"use client";

import { FloatingWhatsApp } from "react-floating-whatsapp";

export default function WhatsAppButton() {
  return (
    <FloatingWhatsApp
      phoneNumber="5613701366"
      accountName="The Klan"
      avatar="/Logo.jpeg"
      statusMessage="Normalmente responde en 1 hora"
      chatMessage="¡Hola! 👋 \n\n¿Cómo podemos ayudarte?"
      placeholder="Escribe un mensaje..."
      allowClickAway
      notification
      notificationSound
    />
  );
}
