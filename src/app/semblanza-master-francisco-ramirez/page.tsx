import { Master } from "@/views/master";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Francisco Ramírez - The Klan BJJ | Cinturón Negro Jiu Jitsu",
  description:
    "Conoce la trayectoria de Master Francisco Ramírez, fundador de The Klan. Cinturón Negro en BJJ, 6to grado KENPO. Más de 25 años de experiencia y campeón internacional.",
  openGraph: {
    title: "Master Francisco Ramírez - The Klan BJJ",
    description:
      "Fundador y Head Coach con más de 25 años de experiencia en Artes Marciales. Cinturón Negro en BJJ y campeón internacional.",
    url: "https://theklanbjj.com.mx/semblanza-master-francisco-ramirez",
  },
  alternates: {
    canonical: "https://theklanbjj.com.mx/semblanza-master-francisco-ramirez",
  },
};

export default function SemblanzaMaster() {
  return <Master />;
}
