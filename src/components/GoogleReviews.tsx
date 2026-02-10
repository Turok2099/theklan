"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";

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
  const [isMobile, setIsMobile] = useState(false);

  // Responsive: Mostrar 1 reseña en móvil, 2 en tablet, 3 en desktop
  const getReviewsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 1;
  };

  const [reviewsPerView, setReviewsPerView] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setReviewsPerView(getReviewsPerView());
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Auto-rotate
  useEffect(() => {
    if (reviews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, reviews.length - reviewsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [reviews.length, reviewsPerView]);

  const nextReview = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, reviews.length - reviewsPerView);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevReview = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, reviews.length - reviewsPerView);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-4 h-4 ${i < rating ? "text-primary" : "text-zinc-700"
              }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading || error || reviews.length === 0) {
    return null; // Ocultar si hay error o cargando para no romper layout
  }

  return (
    <section className="py-24 bg-zinc-950 border-t border-white/5 relative overflow-hidden" id="reviews">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-3 h-3 text-primary" />
              ))}
            </div>
            <span className="text-white text-xs font-bold uppercase tracking-widest">
              {placeInfo ? `${placeInfo.rating} / 5.0` : "Excelente"}
            </span>
          </div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 italic">
            Lo que dicen <span className="text-primary">de nosotros</span>
          </h2>
          <p className="text-gray-400 uppercase font-bold tracking-widest text-sm">
            La comunidad más fuerte de CDMX
          </p>
        </div>

        {/* Reviews Slider */}
        <div className="relative">
          <div className="overflow-hidden px-4 md:px-0">
            <div
              className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
              style={{ transform: `translateX(-${currentIndex * (100 / reviewsPerView)}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / reviewsPerView}%` }}
                >
                  <div className="bg-zinc-900 border border-white/5 p-8 h-full flex flex-col rounded-2xl relative group hover:border-primary/30 transition-colors">
                    <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                      </svg>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-800 bg-zinc-800 flex-shrink-0">
                        {review.author_photo_url ? (
                          <Image
                            src={review.author_photo_url}
                            alt={review.author_name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white font-bold">
                            {review.author_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm tracking-wide">{review.author_name}</h4>
                        <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider">{review.relative_time_description}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      {renderStars(review.rating)}
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-4 flex-grow">
                      "{review.text}"
                    </p>

                    <a
                      href="https://www.google.com/maps/place/The+Klan/@19.3839507,-99.1584908,17z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 text-xs font-bold text-white uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"
                    >
                      Ver en Google
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls - Left */}
          <button
            onClick={prevReview}
            className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-10 h-10 border border-white/10 bg-black/50 hover:bg-primary hover:border-primary rounded-full flex items-center justify-center text-white transition-all z-10 hidden md:flex"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* Controls - Right */}
          <button
            onClick={nextReview}
            className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-10 h-10 border border-white/10 bg-black/50 hover:bg-primary hover:border-primary rounded-full flex items-center justify-center text-white transition-all z-10 hidden md:flex"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="https://search.google.com/local/writereview?placeid=ChIJBCbk9af10YURBMbkxZf5JSg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-white/20 hover:border-primary text-white hover:text-primary px-8 py-3 font-bold uppercase tracking-widest text-sm rounded transition-all"
          >
            Escribir una reseña
          </a>
        </div>
      </div>
    </section>
  );
};
