"use client";

import Image from "next/image";
import { useState } from "react";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface CoachGalleryProps {
  images: string[];
  coachName: string;
}

export const CoachGallery = ({ images, coachName }: CoachGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setSelectedImage(null);
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
  };

  // Agregar event listener para teclas
  if (typeof window !== "undefined" && selectedImage !== null) {
    window.addEventListener(
      "keydown",
      handleKeyDown as unknown as EventListener
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setSelectedImage(i)}
            className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <Image
              src={src}
              alt={`${coachName} - Imagen ${i + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          </div>
        ))}
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
            className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors z-10"
          >
            <XMarkIcon className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          {/* Botón anterior */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 text-white hover:text-red-500 transition-colors z-10"
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
              alt={`${coachName} - Imagen ${selectedImage + 1}`}
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
            className="absolute right-4 text-white hover:text-red-500 transition-colors z-10"
          >
            <ChevronRightIcon className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          {/* Contador */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm md:text-base">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};
