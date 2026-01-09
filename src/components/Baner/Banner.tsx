"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Banner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar el banner en cada recarga de página después de un pequeño delay
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Prevenir scroll del body cuando el banner está visible
  useEffect(() => {
    if (isVisible) {
      // Guardar el scroll position
      const scrollY = window.scrollY;
      // Bloquear scroll del body
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // Restaurar scroll al desmontar
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    // No guardar en storage, para que aparezca en cada recarga
  };

  // No renderizar nada si no está visible
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-start justify-center p-2 md:p-4 overflow-y-auto">
      {/* Botón cerrar */}
      <button
        onClick={handleClose}
        className="fixed top-4 right-4 text-white hover:text-red-600 transition-colors z-[10000] bg-black/50 rounded-full p-2 backdrop-blur-sm"
        aria-label="Cerrar banner"
      >
        <XMarkIcon className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Contenedor del banner */}
      <div
        className="relative max-w-5xl w-full bg-black rounded-2xl overflow-hidden shadow-2xl my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen del banner - 20% más pequeña */}
        <div className="relative w-full flex justify-center">
          <img
            src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1767974072/IMG_9526_1_zlnl0n.jpg"
            alt="The Klan - Agenda tu clase muestra"
            className="h-auto block mx-auto"
            style={{ maxHeight: "72vh", maxWidth: "80%", objectFit: "contain" }}
          />
        </div>

        {/* Botón de acción - Fuera del contenedor de la imagen, más pequeño */}
        <div className="w-full px-4 md:px-6 py-3 flex justify-center">
          <Link
            href="/costos-y-horarios"
            onClick={handleClose}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-200 text-sm md:text-base shadow-md hover:shadow-lg transform hover:scale-105 text-center"
          >
            Agenda tu clase muestra
          </Link>
        </div>
      </div>
    </div>
  );
}
