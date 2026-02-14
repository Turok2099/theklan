"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";
import { getCloudinaryImageUrl, extractCloudinaryPath } from "@/lib/cloudinary";

interface CoachGalleryProps {
  images: string[];
  coachName: string;
}

export const CoachGallery = ({ images, coachName }: CoachGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  // Responsive Carousel Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Optimizar URLs para thumbnails
  const thumbnailImages = useMemo(() => {
    if (!images || images.length === 0) return [];
    return images.map((url) => {
      const path = extractCloudinaryPath(url);
      return getCloudinaryImageUrl(path, {
        width: 1000,
        height: 1333,
        quality: 90,
        crop: "fill",
      });
    });
  }, [images]);

  // Optimizar URLs para lightbox
  const lightboxImages = useMemo(() => {
    if (!images || images.length === 0) return [];
    return images.map((url) => {
      const path = extractCloudinaryPath(url);
      return getCloudinaryImageUrl(path, {
        quality: 90,
      });
    });
  }, [images]);

  if (!images || images.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, images.length - itemsPerView);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, images.length - itemsPerView);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  // Lightbox Navigation
  const handlePreviousLightbox = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === 0 ? images.length - 1 : selectedImage - 1
      );
    }
  };

  const handleNextLightbox = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        selectedImage === images.length - 1 ? 0 : selectedImage + 1
      );
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setSelectedImage(null);
    if (e.key === "ArrowLeft") handlePreviousLightbox();
    if (e.key === "ArrowRight") handleNextLightbox();
  };

  // Agregar event listener para teclas en Lightbox
  if (typeof window !== "undefined" && selectedImage !== null) {
    window.addEventListener(
      "keydown",
      handleKeyDown as unknown as EventListener
    );
  }

  return (
    <>
      <div className="relative group/carousel">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {thumbnailImages.map((src, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div
                  onClick={() => setSelectedImage(i)}
                  className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 cursor-pointer group hover:border-primary/50 transition-all duration-300"
                >
                  <Image
                    src={src}
                    alt={`${coachName} - Imagen ${i + 1}`}
                    fill
                    quality={85}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-primary/90 text-white p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                      <MagnifyingGlassPlusIcon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-10 h-10 border border-white/10 bg-black/50 hover:bg-primary hover:border-primary rounded-full flex items-center justify-center text-white transition-all z-10 opacity-0 group-hover/carousel:opacity-100 pointer-events-auto"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-10 h-10 border border-white/10 bg-black/50 hover:bg-primary hover:border-primary rounded-full flex items-center justify-center text-white transition-all z-10 opacity-0 group-hover/carousel:opacity-100 pointer-events-auto"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-50 bg-black/50 p-2 rounded-full"
          >
            <XMarkIcon className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePreviousLightbox();
            }}
            className="absolute left-4 text-white hover:text-primary transition-colors z-50 bg-black/50 p-3 rounded-full hidden md:block group"
          >
            <ChevronLeftIcon className="w-8 h-8 group-active:scale-90 transition-transform" />
          </button>

          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImages[selectedImage]}
              alt={`${coachName} - Imagen ${selectedImage + 1}`}
              width={1200}
              height={800}
              quality={90}
              className="object-contain max-h-[90vh] w-auto h-auto rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
              <span className="text-white text-xs md:text-sm font-bold tracking-widest">
                {selectedImage + 1} / {images.length}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextLightbox();
            }}
            className="absolute right-4 text-white hover:text-primary transition-colors z-50 bg-black/50 p-3 rounded-full hidden md:block group"
          >
            <ChevronRightIcon className="w-8 h-8 group-active:scale-90 transition-transform" />
          </button>
        </div>
      )}
    </>
  );
};
