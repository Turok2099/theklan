import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Registro - The Klan BJJ",
  description:
    "Crea tu cuenta en The Klan BJJ y accede a contenido exclusivo de Jiu Jitsu Brasileño",
  openGraph: {
    title: "Registro - The Klan BJJ",
    description:
      "Crea tu cuenta en The Klan BJJ y accede a contenido exclusivo de Jiu Jitsu Brasileño",
    url: "https://theklanbjj.com.mx/auth/register",
    siteName: "The Klan BJJ",
    images: [
      {
        url: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759430135/The%20Klan/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Klan BJJ - Registro",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  alternates: {
    canonical: "https://theklanbjj.com.mx/auth/register",
  },
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="container mx-auto">
        <RegisterForm />
      </div>
    </main>
  );
}
