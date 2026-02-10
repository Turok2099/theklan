"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import styles from "@/styles/animations.module.css";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

export const Carrusel2 = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Rutas originales de las imágenes
  const imagePaths = [
    "v1770766481/WhatsApp_Image_2026-02-10_at_4.56.19_PM_2_kcavv6.jpg",
    "v1770766480/WhatsApp_Image_2026-02-10_at_4.56.19_PM_3_gxqq8j.jpg",
    "v1770766480/WhatsApp_Image_2026-02-10_at_4.56.19_PM_4_qpkw0j.jpg",
    "v1770766479/WhatsApp_Image_2026-02-10_at_4.56.19_PM_5_udssxh.jpg",
    "v1770766478/WhatsApp_Image_2026-02-10_at_4.56.19_PM_6_pdivg0.jpg",
    "v1770766477/WhatsApp_Image_2026-02-10_at_4.56.19_PM_7_bivpht.jpg",
    "v1770766476/WhatsApp_Image_2026-02-10_at_4.56.18_PM_cdqzhf.jpg",
    "v1770766476/WhatsApp_Image_2026-02-10_at_4.56.19_PM_1_gr22rt.jpg",
    "v1770766476/WhatsApp_Image_2026-02-10_at_4.56.19_PM_igrbob.jpg",
    "v1759427175/The%20Klan/13.png",
    "v1759427173/The%20Klan/12.png",
    "v1759427171/The%20Klan/10.png",
    "v1759427163/The%20Klan/6.png",
    "v1759427161/The%20Klan/5.png",

  ];

  // URLs optimizadas para thumbnails (calidad 85)
  const thumbnailImages = useMemo(
    () =>
      imagePaths.map((path) =>
        getCloudinaryImageUrl(path, {
          width: 400,
          height: 600,
          quality: 85,
          crop: "fill",
        })
      ),
    []
  );

  // URLs optimizadas para lightbox (calidad 90, sin redimensionar)
  const lightboxImages = useMemo(
    () =>
      imagePaths.map((path) =>
        getCloudinaryImageUrl(path, {
          quality: 90, // Mayor calidad para lightbox
        })
      ),
    []
  );

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? imagePaths.length - 1 : selectedImage - 1
      );
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === imagePaths.length - 1 ? 0 : selectedImage + 1
      );
    }
  };

  return (
    <section className="w-full bg-zinc-950 py-24 overflow-hidden relative" id="galeria">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Título */}
      <div className="text-center mb-16 relative z-10 px-4">
        <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 italic">
          Nuestra <span className="text-primary">Galería</span>
        </h2>
        <div className="w-24 h-1.5 bg-primary mx-auto mb-6 skew-x-[-12deg]"></div>
        <p className="text-gray-400 uppercase font-bold tracking-widest text-sm max-w-2xl mx-auto">
          Descubre nuestras instalaciones y el ambiente de entrenamiento
        </p>
      </div>

      {/* Carrusel */}
      <div className="overflow-hidden w-full relative z-10">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none"></div>

        <div className={styles.marqueeRight}>
          {/* Primer set */}
          {thumbnailImages.map((src, i) => (
            <div
              key={i}
              onClick={() => setSelectedImage(i)}
              className="flex-shrink-0 w-64 md:w-80 h-96 relative mx-4 cursor-pointer group rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300"
            >
              <Image
                src={src}
                alt={`Imagen ${i + 1}`}
                fill
                quality={85}
                sizes="(max-width: 640px) 256px, 320px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-primary/90 text-white p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100 shadow-lg shadow-primary/30">
                  <MagnifyingGlassPlusIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
          {/* Segundo set */}
          {thumbnailImages.map((src, i) => (
            <div
              key={`dup-${i}`}
              onClick={() => setSelectedImage(i)}
              className="flex-shrink-0 w-64 md:w-80 h-96 relative mx-4 cursor-pointer group rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300"
            >
              <Image
                src={src}
                alt={`Imagen duplicada ${i + 1}`}
                fill
                quality={85}
                sizes="(max-width: 640px) 256px, 320px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-primary/90 text-white p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100 shadow-lg shadow-primary/30">
                  <MagnifyingGlassPlusIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          {/* Botón cerrar */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-50 bg-black/50 p-2 rounded-full"
          >
            <XMarkIcon className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          {/* Botón anterior */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 text-white hover:text-primary transition-colors z-50 bg-black/50 p-3 rounded-full hidden md:block group"
          >
            <ChevronLeftIcon className="w-8 h-8 group-active:scale-90 transition-transform" />
          </button>

          {/* Imagen */}
          <div
            className="relative max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImages[selectedImage]}
              alt={`Imagen ${selectedImage + 1}`}
              width={1200}
              height={800}
              quality={90}
              className="object-contain max-h-[85vh] w-auto h-auto rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
              <span className="text-white text-xs md:text-sm font-bold tracking-widest">
                {selectedImage + 1} / {imagePaths.length}
              </span>
            </div>
          </div>

          {/* Botón siguiente */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 text-white hover:text-primary transition-colors z-50 bg-black/50 p-3 rounded-full hidden md:block group"
          >
            <ChevronRightIcon className="w-8 h-8 group-active:scale-90 transition-transform" />
          </button>
        </div>
      )}
    </section>
  );
};
