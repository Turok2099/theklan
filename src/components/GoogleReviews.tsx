"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Review {
  author_name: string;
  author_photo_url?: string;
  rating: number;
  text: string;
  relative_time_description: string;
}

interface PlaceDetails {
  reviews: Review[];
  rating: number;
  user_ratings_total: number;
}

export const GoogleReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [placeInfo, setPlaceInfo] = useState<PlaceDetails | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configuración del carrusel
  const reviewsPerView = 1; // Mostrar 1 reseña a la vez (Google solo da 5 máximo)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");

        if (!response.ok) {
          throw new Error("Error al obtener reseñas");
        }

        const data = await response.json();

        setPlaceInfo({
          reviews: data.reviews || [],
          rating: data.rating || 0,
          user_ratings_total: data.user_ratings_total || 0,
        });

        // Google Places API devuelve máximo 5 reseñas
        const sortedReviews = (data.reviews || []).sort(
          (a: Review, b: Review) => b.rating - a.rating
        );

        setReviews(sortedReviews);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("No se pudieron cargar las reseñas");
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Auto-rotate cada 5 segundos
  useEffect(() => {
    if (reviews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = reviews.length - reviewsPerView;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const nextReview = () => {
    setCurrentIndex((prev) => {
      const maxIndex = reviews.length - reviewsPerView;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevReview = () => {
    setCurrentIndex((prev) => {
      const maxIndex = reviews.length - reviewsPerView;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="py-16 px-3 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">Cargando reseñas...</p>
        </div>
      </section>
    );
  }

  if (error || reviews.length === 0) {
    return null; // No mostrar nada si hay error
  }

  return (
    <section className="w-full py-16 px-3 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto bg-black rounded-3xl shadow-2xl overflow-hidden p-10 md:p-16">
        {/* Título y Rating General */}
        <div className="text-center mb-16">
          <h2 className="text-hero-title font-black mb-8 text-white">
            Google Reviews
          </h2>
          <div className="w-32 h-1.5 bg-red-600 mx-auto mb-6"></div>
          {placeInfo && (
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-6xl md:text-7xl font-black text-red-600">
                  {placeInfo.rating.toFixed(1)}
                </span>
                {renderStars(Math.round(placeInfo.rating))}
              </div>
            </div>
          )}
        </div>

        {/* Carrusel de Reseñas */}
        <div className="relative">
          {/* Contenedor del Carrusel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / reviewsPerView)
                }%)`,
              }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="w-full flex-shrink-0 px-3">
                  <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col border-t-4 border-red-600">
                    {/* Header con foto y nombre */}
                    <div className="flex items-center gap-4 mb-4">
                      {review.author_photo_url ? (
                        <Image
                          src={review.author_photo_url}
                          alt={review.author_name}
                          width={48}
                          height={48}
                          className="rounded-full ring-2 ring-red-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-lg">
                          {review.author_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-lg text-gray-900">
                          {review.author_name}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500 font-light">
                          {review.relative_time_description}
                        </p>
                      </div>
                    </div>

                    {/* Estrellas */}
                    <div className="mb-3">{renderStars(review.rating)}</div>

                    {/* Texto de la reseña */}
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed flex-grow line-clamp-6 font-light">
                      {review.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controles de Navegación */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-red-600 hover:text-white transition-all z-10"
            aria-label="Reseña anterior"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-red-600 hover:text-white transition-all z-10"
            aria-label="Siguiente reseña"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Indicadores de posición */}
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(reviews.length - reviewsPerView + 1)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-red-600"
                  : "w-2 bg-gray-500 hover:bg-gray-400"
              }`}
              aria-label={`Ir a grupo de reseñas ${index + 1}`}
            />
          ))}
        </div>

        {/* Botón Ver Más en Google */}
        <div className="text-center mt-10">
          <a
            href="https://www.google.com/maps/place/The+Klan/@19.3839507,-99.1584908,17z/data=!4m18!1m9!3m8!1s0x85d1ffa796af0001:0x2825f997c5e4c604!2sThe+Klan!8m2!3d19.3839507!4d-99.1584908!9m1!1b1!16s%2Fg%2F11j4svv45s!3m7!1s0x85d1ffa796af0001:0x2825f997c5e4c604!8m2!3d19.3839507!4d-99.1584908!9m1!1b1!16s%2Fg%2F11j4svv45s?entry=ttu&g_ep=EgoyMDI1MTAwNi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border-2 border-white text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Ver todas las reseñas en Google
          </a>
        </div>
      </div>
    </section>
  );
};
