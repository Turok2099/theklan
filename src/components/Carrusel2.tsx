"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "@/styles/animations.module.css";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export const Carrusel2 = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const images = [
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427152/The%20Klan/1.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427154/The%20Klan/2.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427156/The%20Klan/3.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427158/The%20Klan/4.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427161/The%20Klan/5.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427163/The%20Klan/6.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427164/The%20Klan/7.jpg",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427166/The%20Klan/8.jpg",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427169/The%20Klan/9.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427171/The%20Klan/10.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427173/The%20Klan/12.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427175/The%20Klan/13.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427177/The%20Klan/14.jpg",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427179/The%20Klan/15.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427181/The%20Klan/16.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427182/The%20Klan/17.jpg",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427145/The%20Klan/jiu-jitsu1.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427147/The%20Klan/the-klan-bjj-portada.png",
  ];

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? images.length - 1 : selectedImage - 1
      );
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === images.length - 1 ? 0 : selectedImage + 1
      );
    }
  };

  return (
    <section className="w-full bg-white py-16 px-3 md:px-12 lg:px-24">
      {/* Título */}
      <div className="text-center mb-16">
        <div className="bg-red-600 text-white px-6 py-4 rounded-2xl mb-6 inline-block">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
            GALERÍA
          </h2>
        </div>
        <div className="w-32 h-1.5 bg-red-600 mx-auto mb-6"></div>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-light">
          Descubre nuestras instalaciones y el ambiente de{" "}
          <span className="font-bold text-gray-900">entrenamiento</span>
        </p>
      </div>

      {/* Carrusel */}
      <div className="overflow-hidden w-full">
        <div className={styles.marqueeRight}>
          {/* Primer set */}
          {images.map((src, i) => (
            <div
              key={i}
              onClick={() => setSelectedImage(i)}
              className="flex-shrink-0 w-56 sm:w-72 md:w-80 lg:w-96 h-80 sm:h-96 md:h-[28rem] lg:h-[32rem] relative mx-3 cursor-pointer group"
            >
              <Image
                src={src}
                alt={`Imagen ${i + 1}`}
                fill
                sizes="(max-width: 640px) 224px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
                className="object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-lg" />
            </div>
          ))}
          {/* Segundo set */}
          {images.map((src, i) => (
            <div
              key={`dup-${i}`}
              onClick={() => setSelectedImage(i)}
              className="flex-shrink-0 w-56 sm:w-72 md:w-80 lg:w-96 h-80 sm:h-96 md:h-[28rem] lg:h-[32rem] relative mx-3 cursor-pointer group"
            >
              <Image
                src={src}
                alt={`Imagen duplicada ${i + 1}`}
                fill
                sizes="(max-width: 640px) 224px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 384px"
                className="object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Botón cerrar */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-red-600 transition-colors z-10"
          >
            <XMarkIcon className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          {/* Botón anterior */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 text-white hover:text-red-600 transition-colors z-10"
          >
            <ChevronLeftIcon className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          {/* Imagen */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedImage]}
              alt={`Imagen ${selectedImage + 1}`}
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] w-auto h-auto"
            />
          </div>

          {/* Botón siguiente */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 text-white hover:text-red-600 transition-colors z-10"
          >
            <ChevronRightIcon className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          {/* Contador */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm md:text-base">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
};
