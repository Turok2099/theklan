import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsiva de Inscripción - The Klan BJJ | Jiu Jitsu en CDMX",
  description:
    "Completa tu responsiva de inscripción para unirte a The Klan BJJ. Formulario digital seguro y fácil de usar.",
  openGraph: {
    title: "Responsiva de Inscripción - The Klan BJJ",
    description:
      "Completa tu responsiva de inscripción para unirte a The Klan BJJ.",
    url: "https://theklanbjj.com.mx/responsiva",
  },
};

export default function ResponsivaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
