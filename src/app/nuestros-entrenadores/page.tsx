import { Trainers } from "@/views/trainers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestros Entrenadores - The Klan BJJ | Instructores Certificados",
  description:
    "Conoce a nuestro equipo de instructores profesionales de Jiu Jitsu Brasileño y MMA. Entrenadores certificados con amplia experiencia en competencia.",
  openGraph: {
    title: "Nuestros Entrenadores - The Klan BJJ",
    description:
      "Conoce a nuestro equipo de instructores profesionales certificados en BJJ y MMA.",
    url: "https://theklanbjj.com.mx/nuestros-entrenadores",
  },
  alternates: {
    canonical: "https://theklanbjj.com.mx/nuestros-entrenadores",
  },
};

export default function NuestrosEntrenadores() {
  return (
    <div>
      <Trainers />
    </div>
  );
}

