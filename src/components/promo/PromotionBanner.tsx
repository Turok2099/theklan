"use client";

import Image from "next/image";
import Link from "next/link";

export const PromotionBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black py-4 md:py-6">
      {/* Efecto de brillo animado de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full promo-glow-1"
          style={{
            background:
              "radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.1) 30%, transparent 70%)",
          }}
        ></div>
        <div
          className="absolute top-0 left-0 w-full h-full promo-glow-2"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.15), transparent 50%)",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group py-8 md:py-12 px-8 md:px-12">
          {/* Borde brillante animado */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300 promo-border-glow"></div>

          {/* Contenedor principal */}
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-red-900/50">
            {/* Efecto shimmer */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Contenido */}
            <Link href="/costos-y-horarios" className="block cursor-pointer">
              <div className="relative w-full">
                <Image
                  src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1767977235/promocion_2026_oy37x7.jpg"
                  alt="Promoción 2026 - The Klan BJJ"
                  width={800}
                  height={450}
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 560px"
                  quality={90}
                  priority
                />

                {/* Overlay sutil al hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Indicador de acción */}
                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-red-600 text-white px-3 py-1.5 rounded-full font-bold text-xs md:text-sm shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5">
                  <span>Ver Promoción</span>
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Estilos CSS para animaciones personalizadas */}
      <style jsx>{`
        @keyframes promo-glow {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        @keyframes promo-border-pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        .promo-glow-1 {
          animation: promo-glow 3s ease-in-out infinite;
        }
        .promo-glow-2 {
          animation: promo-glow 3s ease-in-out infinite 0.5s;
        }
        .promo-border-glow {
          animation: promo-border-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
