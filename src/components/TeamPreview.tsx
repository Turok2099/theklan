"use client";

import Image from "next/image";
import Link from "next/link";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

export const TeamPreview = () => {
  const team = [
    {
      name: "Francisco Ramírez",
      role: "Head Coach",
      imagePath: "v1759428609/The%20Klan/coaches/francisco-ramirez/paco1.png",
      belt: "Head Coach",
    },
    {
      name: "Sebastián Gómez",
      role: "Entrenador",
      imagePath:
        "v1759428621/The%20Klan/coaches/sebastian-gomez/WhatsApp-Image-2025-06-05-at-11.jpg",
      belt: "Entrenador",
    },
    {
      name: "Luis González",
      role: "Entrenador",
      imagePath:
        "v1759428622/The%20Klan/coaches/luis-gonzalez/WhatsApp-Image-2025-06-20-at-12.jpg",
      belt: "Entrenador",
    },
    {
      name: "Joaquín Lino",
      role: "Entrenador",
      imagePath:
        "v1759428626/The%20Klan/coaches/joaquin-lino/TheKlan-EntregaFinal-13.jpg",
      belt: "Entrenador",
    },
  ].map((member) => ({
    ...member,
    image: getCloudinaryImageUrl(member.imagePath, {
      width: 400,
      height: 533,
      quality: 85,
      crop: "fill",
    }),
  }));

  return (
    <section className="py-24 bg-background-dark/50 border-y border-white/5" id="equipo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic">
            Nuestro <span className="text-primary">Staff Técnico</span>
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="group relative overflow-hidden bg-black border border-white/10"
            >
              <div className="w-full aspect-[3/4] overflow-hidden bg-zinc-900">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={533}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h4 className="text-white font-black uppercase text-lg leading-none">
                  {member.name}
                </h4>
                <p className="text-primary font-bold text-xs uppercase tracking-widest">
                  {member.belt}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/nuestros-entrenadores"
            className="text-white border-2 border-white hover:bg-white hover:text-black px-8 py-3 font-black uppercase tracking-widest transition-all"
          >
            Ver Equipo Completo
          </Link>
        </div>
      </div>
    </section>
  );
};
