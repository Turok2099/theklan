"use client";

import Image from "next/image";
import Link from "next/link";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

export const HeadCoach = () => {
  const headCoachImageUrl = getCloudinaryImageUrl(
    "v1761709455/WhatsApp_Image_2025-10-28_at_6.26.36_PM_hcsyah.jpg",
    {
      width: 800,
      height: 1200,
      quality: 85,
      crop: "fill",
    }
  );

  return (
    <section className="py-24 bg-black" id="headcoach">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-primary"></div>
            <div className="relative w-full aspect-[4/5] bg-gray-900">
              <Image
                src={headCoachImageUrl}
                alt="Head Coach Francisco Ramírez"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Visual element for mobile or decoration */}
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-primary/30"></div>
          </div>

          <div>
            <span className="text-primary font-black text-sm uppercase tracking-[0.3em] mb-4 block">
              HEAD COACH
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 italic">
              Francisco Ramírez
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 font-medium">
              Fundador y Head Coach con más de 25 años de experiencia en Artes Marciales.
              Especialista en defensa personal. Instructor de kickboxing avalado por la WAKO Bavaria, Alemania. Striking y competidor nacional de jiu-jitsu brasileño.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Cinturón Negro en Jiu Jitsu Brasileño",
                "Cinturón Negro 6to grado en KENPO",
                "Competidor internacional Activo IBJJF, FJJB, FNJJB",
                "Fundador de The Klan CDMX (2004)",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white font-bold text-lg">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/semblanza-master-francisco-ramirez"
              className="group inline-flex items-center gap-2 bg-primary hover:bg-neutral-800 text-white px-8 py-4 font-black uppercase tracking-widest transition-all rounded-sm"
            >
              Conoce su historia completa
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
