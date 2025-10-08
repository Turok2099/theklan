"use client";

import Image from "next/image";
import Link from "next/link";

export const TeamPreview = () => {
  const team = [
    {
      name: "Francisco Ramírez",
      role: "Head Coach",
      image:
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428609/The%20Klan/coaches/francisco-ramirez/paco1.png",
    },
    {
      name: "Sebastián Gómez",
      role: "Entrenador",
      image:
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428621/The%20Klan/coaches/sebastian-gomez/WhatsApp-Image-2025-06-05-at-11.jpg",
    },
    {
      name: "Luis González",
      role: "Entrenador",
      image:
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428622/The%20Klan/coaches/luis-gonzalez/WhatsApp-Image-2025-06-20-at-12.jpg",
    },
    {
      name: "Joaquín Lino",
      role: "Entrenador",
      image:
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428626/The%20Klan/coaches/joaquin-lino/TheKlan-EntregaFinal-13.jpg",
    },
  ];

  return (
    <section className="w-full bg-white py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            NUESTRO TEAM
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conoce a nuestro equipo de instructores profesionales
          </p>
        </div>

        {/* Grid de entrenadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Imagen */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  quality={60}
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-0 transition-transform duration-300">
                <p className="text-red-600 font-bold text-sm uppercase tracking-wider mb-1">
                  {member.role}
                </p>
                <h3 className="text-lg md:text-xl font-bold">{member.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Botón CTA */}
        <div className="text-center mt-12">
          <Link
            href="/nuestros-entrenadores"
            className="inline-flex items-center justify-center bg-red-600 text-white font-bold px-8 py-4 rounded-full hover:bg-red-600/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Ver equipo completo
          </Link>
        </div>
      </div>
    </section>
  );
};
