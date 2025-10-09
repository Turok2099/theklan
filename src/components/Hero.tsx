"use client";

import Image from "next/image";
import { TextMarquee } from "./Carrusel1";

export const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src="https://res.cloudinary.com/dxbtafe9u/image/upload/f_auto,q_auto:eco,w_1920/The%20Klan/hero-image.jpg"
        alt="The Klan - Jiu Jitsu Brasileño en CDMX"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={75}
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/70 z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4">
        <h1
          className="
            font-black tracking-tight drop-shadow-xl text-white mb-6
            text-[7rem]              /* Tamaño base (móvil) */
            sm:text-[8rem]           /* a partir de 640px */
            md:text-[12rem]          /* a partir de 768px */
            lg:text-[16rem]          /* a partir de 1024px */
            leading-none             /* sin espacio extra entre líneas */
            text-center
          "
        >
          <span className="block">THE</span>
          <span className="block">KLAN</span>
        </h1>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-20">
        <TextMarquee />
      </div>
    </div>
  );
};
