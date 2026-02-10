"use client";

import Image from "next/image";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export const Hero = () => {
  const heroImageUrl = getCloudinaryImageUrl("The%20Klan/hero-image.jpg", {
    width: 1920,
    height: 1080,
    quality: 90,
    crop: "fill",
  });

  return (
    <header className="relative h-screen w-full overflow-hidden bg-pure-black">
      {/* Background Image (Carousel Slide) */}
      <div className="absolute inset-0 opacity-60">
        <Image
          src={heroImageUrl}
          alt="The Klan BJJ - Sangre y Sudor"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-pure-black/40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-24 md:justify-center md:pb-0">
        <div className="max-w-4xl animate-fade-in-up">
          <h1 className="font-black text-white leading-[0.85] mb-6 tracking-tighter">
            <span className="block text-7xl md:text-9xl lg:text-[10rem] xl:text-[12rem]">THE</span>
            <span className="block text-7xl md:text-9xl lg:text-[10rem] xl:text-[12rem] text-primary drop-shadow-[0_0_15px_rgba(242,13,13,0.6)]">
              KLAN
            </span>
          </h1>
          <p className="text-2xl md:text-4xl text-white mb-10 font-bold uppercase tracking-wide drop-shadow-lg max-w-2xl">
            Jiu Jitsu Brasileño en CDMX
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#contacto"
              className="bg-primary hover:bg-red-700 text-white text-center px-10 py-5 font-black uppercase tracking-widest transition-all shadow-2xl shadow-primary/40"
            >
              ÚNETE AL EQUIPO
            </Link>
            <Link
              href="#planes"
              className="bg-black hover:bg-zinc-900 text-white text-center px-10 py-5 font-black uppercase tracking-widest transition-all shadow-lg"
            >
              VER PROGRAMAS
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel Controls (Visual only for now as requested by static template look) */}

    </header>
  );
};
