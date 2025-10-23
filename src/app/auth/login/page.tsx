import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar Sesión - The Klan BJJ",
  description:
    "Inicia sesión en tu cuenta de The Klan BJJ y accede a contenido exclusivo",
  openGraph: {
    title: "Iniciar Sesión - The Klan BJJ",
    description:
      "Inicia sesión en tu cuenta de The Klan BJJ y accede a contenido exclusivo",
    url: "https://theklanbjj.com.mx/auth/login",
    siteName: "The Klan BJJ",
    images: [
      {
        url: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759430135/The%20Klan/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Klan BJJ - Login",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  alternates: {
    canonical: "https://theklanbjj.com.mx/auth/login",
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="container mx-auto">
        <LoginForm />
      </div>
    </main>
  );
}
