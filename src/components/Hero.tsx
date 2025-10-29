"use client";

import Image from "next/image";
import { TextMarquee } from "./Carrusel1";

export const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src="https://res.cloudinary.com/dxbtafe9u/image/upload/The%20Klan/hero-image.jpg"
        alt="The Klan - Jiu Jitsu Brasileño en CDMX"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Gradiente más oscuro para mayor contraste */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50 z-10" />

      {/* Contenedor principal alineado a la izquierda */}
      <div className="relative z-20 flex flex-col justify-center h-full px-6 sm:px-8 md:px-12 lg:px-20 xl:px-24">
        <h1
          className="
            !font-black !tracking-tighter drop-shadow-2xl !text-white
            !text-[3.5rem]            /* Móvil: 56px (30% menor) */
            sm:!text-[5rem]           /* Tablet: 80px */
            md:!text-[7rem]           /* Tablet grande: 112px */
            lg:!text-[10rem]          /* Desktop: 160px */
            xl:!text-[12.5rem]        /* Desktop grande: 200px */
            2xl:!text-[14rem]         /* Extra grande: 224px */
            !leading-[0.85]           /* Muy compacto entre líneas */
            -mb-4
          "
        >
          <span className="block text-left">THE</span>
          <span className="block text-left !text-red-600">KLAN</span>
        </h1>

        {/* Subtítulo opcional */}
        <p className="!text-white !text-lg sm:!text-xl md:!text-2xl lg:!text-3xl !font-bold mt-8 !tracking-wide drop-shadow-lg max-w-2xl">
          Jiu Jitsu Brasileño en CDMX
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-20">
        <TextMarquee />
      </div>
    </div>
  );
};
