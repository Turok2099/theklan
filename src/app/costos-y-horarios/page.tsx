import { Cost } from "@/views/cost";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Costos y Horarios - The Klan BJJ | Precios de Clases",
  description:
    "Consulta nuestros horarios de clases de BJJ, MMA, Striking y Funcional. Planes accesibles para todos los niveles. Del Valle, CDMX.",
  openGraph: {
    title: "Costos y Horarios - The Klan BJJ",
    description:
      "Consulta nuestros horarios de clases de BJJ, MMA, Striking y Funcional en CDMX.",
    url: "https://theklanbjj.com.mx/costos-y-horarios",
  },
  alternates: {
    canonical: "https://theklanbjj.com.mx/costos-y-horarios",
  },
};

export default function CostosYHorarios() {
  return <Cost />;
}
