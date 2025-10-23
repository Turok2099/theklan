import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar Contraseña - The Klan BJJ",
  description:
    "Recupera tu contraseña de The Klan BJJ y accede nuevamente a tu cuenta",
  openGraph: {
    title: "Recuperar Contraseña - The Klan BJJ",
    description:
      "Recupera tu contraseña de The Klan BJJ y accede nuevamente a tu cuenta",
    url: "https://theklanbjj.com.mx/auth/forgot-password",
    siteName: "The Klan BJJ",
    images: [
      {
        url: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759430135/The%20Klan/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Klan BJJ - Recuperar Contraseña",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  alternates: {
    canonical: "https://theklanbjj.com.mx/auth/forgot-password",
  },
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="container mx-auto">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
