"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

export default function VideoYoutubeHome() {
  return (
    <section className="w-full py-16 px-3 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto bg-black rounded-3xl shadow-2xl overflow-hidden p-10 md:p-16">
        {/* Título del marco */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-section-title font-black mb-6 text-white">
            Así son las clases en <span className="text-red-600">The Klan</span>
          </h2>
          <div className="w-32 h-1.5 bg-red-600 mx-auto"></div>
        </div>

        {/* Contenedor del video */}
        <div className="relative w-full aspect-video max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
          <LiteYouTubeEmbed
            id="xPMSkloAMFo"
            title="The Klan - Jiu Jitsu Brasileño en CDMX"
            poster="maxresdefault"
          />

          {/* ESTILOS LOCALES PARA PERSONALIZAR EL BOTÓN */}
          <style jsx>{`
            /* Botón de play redondo y moderno */
            .lty-playbtn {
              width: 80px !important;
              height: 80px !important;
              border-radius: 50% !important;
              background: rgba(0, 0, 0, 0.6) !important;
              backdrop-filter: blur(4px);
              transition: 0.25s ease;
            }

            /* Triangulito blanco */
            .lty-playbtn:before {
              border-left-color: white !important;
              margin-left: 7px !important;
            }

            /* Hover elegante */
            .lty-playbtn:hover {
              background: rgba(0, 0, 0, 0.8) !important;
              transform: scale(1.12);
            }

            /* Quitar el borde feo por defecto */
            .lty-playbtn:after {
              border-color: transparent !important;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
