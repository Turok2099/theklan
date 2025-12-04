"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

export default function VideoYoutubeHome() {
  return (
    <div className="relative aspect-video w-full max-w-3xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
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
  );
}
