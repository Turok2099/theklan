"use client";

import Image from "next/image";
import Link from "next/link";

export const HeadCoach = () => {
  return (
    <section className="w-full bg-black py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Imagen */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429794/The%20Klan/coaches/francisco-ramirez/14.jpg"
              alt="Francisco Ramírez - Head Coach"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Contenido */}
          <div className="text-white">
            <div className="mb-6">
              <p className="text-red-500 font-bold text-sm md:text-base uppercase tracking-wider mb-2">
                HEAD COACH
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Francisco Ramírez
              </h2>
              <div className="w-24 h-1 bg-red-600"></div>
            </div>

            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-6">
              Fundador y Head Coach con más de 20 años de experiencia en Artes
              Marciales. Instructor de kickboxing avalado por WAKO Baviera
              Germany, especialista en Striking y Jiu-jitsu Brasileño.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-red-500 mr-3">✓</span>
                <span className="text-gray-300">
                  Cinturón Negro en Jiu Jitsu Brasileño
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">✓</span>
                <span className="text-gray-300">
                  Cinturón Negro 6to grado en KENPO
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">✓</span>
                <span className="text-gray-300">
                  Fundador de The Klan CDMX (2004)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3">✓</span>
                <span className="text-gray-300">
                  Competidor internacional Activo IBJJF, FJJB, FNJJB
                </span>
              </li>
            </ul>

            <Link
              href="/semblanza-master-francisco-ramirez"
              className="inline-flex items-center justify-center bg-red-600 text-white font-bold px-8 py-4 rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Conoce su historia completa
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
