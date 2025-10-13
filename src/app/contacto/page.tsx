import { Contact } from "@/views/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto - The Klan BJJ | Jiu Jitsu en CDMX",
  description:
    "Contáctanos para más información sobre nuestras clases de Jiu Jitsu Brasileño y MMA en CDMX. Ubicados en Del Valle. Agenda tu clase de prueba gratis.",
  openGraph: {
    title: "Contacto - The Klan BJJ",
    description:
      "Contáctanos para más información sobre nuestras clases de Jiu Jitsu Brasileño y MMA en CDMX.",
    url: "https://theklanbjj.com.mx/contacto",
  },
};

export default function Contacto() {
  return <Contact />;
}
