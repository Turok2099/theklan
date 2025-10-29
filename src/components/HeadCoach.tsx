"use client";

import Image from "next/image";
import Link from "next/link";

export const HeadCoach = () => {
  return (
    <section className="w-full py-16 px-3 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto bg-black rounded-3xl shadow-2xl overflow-hidden p-10 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Imagen */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1761709455/WhatsApp_Image_2025-10-28_at_6.26.36_PM_hcsyah.jpg"
              alt="Francisco Ramírez - Head Coach"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Contenido */}
          <div className="text-white">
            <div className="mb-8">
              <p className="text-red-600 font-black text-xs md:text-sm uppercase tracking-widest mb-3">
                HEAD COACH
              </p>
              <h2 className="text-section-title font-black mb-6">
                Francisco Ramírez
              </h2>
              <div className="w-32 h-1.5 bg-red-600"></div>
            </div>

            <p className="text-lg md:text-xl text-white leading-relaxed mb-8 font-light">
              Fundador y Head Coach con más de{" "}
              <span className="font-bold text-red-600">
                25 años de experiencia
              </span>{" "}
              en Artes Marciales. Instructor de kickboxing avalado por WAKO
              Baviera Germany, especialista en Striking y Jiu-jitsu Brasileño.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start group">
                <span className="text-red-600 mr-4 text-xl font-bold group-hover:scale-125 transition-transform duration-200">
                  ✓
                </span>
                <span className="text-gray-300 text-lg md:text-xl font-light">
                  Cinturón Negro en Jiu Jitsu Brasileño
                </span>
              </li>
              <li className="flex items-start group">
                <span className="text-red-600 mr-4 text-xl font-bold group-hover:scale-125 transition-transform duration-200">
                  ✓
                </span>
                <span className="text-gray-300 text-lg md:text-xl font-light">
                  Cinturón Negro 6to grado en KENPO
                </span>
              </li>
              <li className="flex items-start group">
                <span className="text-red-600 mr-4 text-xl font-bold group-hover:scale-125 transition-transform duration-200">
                  ✓
                </span>
                <span className="text-gray-300 text-lg md:text-xl font-light">
                  Fundador de The Klan CDMX (2004)
                </span>
              </li>
              <li className="flex items-start group">
                <span className="text-red-600 mr-4 text-xl font-bold group-hover:scale-125 transition-transform duration-200">
                  ✓
                </span>
                <span className="text-gray-300 text-lg md:text-xl font-light">
                  Competidor internacional Activo IBJJF, FJJB, FNJJB
                </span>
              </li>
            </ul>

            <Link
              href="/semblanza-master-francisco-ramirez"
              className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{ color: "#ffffff" }}
            >
              Conoce su historia completa
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
