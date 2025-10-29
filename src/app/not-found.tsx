import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Página no encontrada | The Klan BJJ",
  description:
    "La página que buscas no existe. Regresa al inicio de The Klan BJJ - Jiu Jitsu Brasileño en CDMX.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Número 404 grande */}
        <div className="mb-8">
          <h1 className="font-black tracking-tighter text-white text-[8rem] sm:text-[12rem] md:text-[16rem] leading-none">
            <span className="block">404</span>
          </h1>
        </div>

        {/* Mensaje */}
        <div className="mb-12">
          <div className="bg-red-600 text-white px-6 py-4 rounded-2xl mb-6 inline-block">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
              Página no encontrada
            </h2>
          </div>
          
          <div className="w-32 h-1.5 bg-red-600 mx-auto mb-8"></div>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 font-light max-w-xl mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida. 
            Regresa a la página principal para continuar navegando.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 text-lg shadow-lg"
          >
            Volver al inicio
          </Link>
          
          <Link
            href="/contacto"
            className="bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 text-lg"
          >
            Contacto
          </Link>
        </div>

        {/* Enlaces rápidos */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-gray-400 mb-4 text-sm">Enlaces útiles:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/nuestros-entrenadores"
              className="text-gray-300 hover:text-red-600 transition-colors duration-200"
            >
              Entrenadores
            </Link>
            <Link
              href="/costos-y-horarios"
              className="text-gray-300 hover:text-red-600 transition-colors duration-200"
            >
              Costos y Horarios
            </Link>
            <Link
              href="/semblanza-master-francisco-ramirez"
              className="text-gray-300 hover:text-red-600 transition-colors duration-200"
            >
              Master Francisco
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

