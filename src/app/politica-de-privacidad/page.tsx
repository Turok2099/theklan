import { Privacy } from "@/views/privacy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad - The Klan BJJ",
  description:
    "Conoce nuestra política de privacidad y protección de datos. The Klan BJJ se compromete a proteger tu información personal.",
  openGraph: {
    title: "Política de Privacidad - The Klan BJJ",
    description:
      "Conoce nuestra política de privacidad y protección de datos personales.",
    url: "https://theklanbjj.com.mx/politica-de-privacidad",
  },
  alternates: {
    canonical: "https://theklanbjj.com.mx/politica-de-privacidad",
  },
};

export default function PrivacyPage() {
  return <Privacy />;
}
