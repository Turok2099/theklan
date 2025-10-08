import { Carrusel2 } from "@/components/Carrusel2";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TeamPreview } from "@/components/TeamPreview";
import { HeadCoach } from "@/components/HeadCoach";
import Image from "next/image";

export const Principal = () => {
  return (
    <section className="w-full bg-white text-gray-800 py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 mb-20">
        <div className="order-last md:order-first">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            The Klan
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800">
            El mejor lugar para entrenar Jiu Jitsu Brasileño en CDMX
          </h3>
          <p className="text-base md:text-lg leading-relaxed text-gray-700">
            Somos un estudio privado en la Colonia Del Valle enfocado al Combate
            y las Artes Marciales. Tenemos más de 20 años dando resultados
            eficientes y significativos en corto tiempo a todo aquel que entrena
            con nosotros.
          </p>
        </div>

        <div className="relative w-full h-64 md:h-96 lg:h-[500px] order-first md:order-last">
          <Image
            src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1759430135/The%20Klan/hero-image.jpg"
            alt="Entrenamiento de Jiu Jitsu"
            fill
            className="object-cover rounded-lg shadow-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={60}
          />
        </div>
      </div>

      <HeadCoach />

      <div className="mt-12">
        <FeaturesSection />
      </div>

      <TeamPreview />

      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl shadow-2xl p-10 md:p-16 max-w-6xl mx-auto mt-20">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)",
            }}
          ></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center justify-center mb-6">
            <span className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
              Más de 20 años de experiencia
            </span>
          </div>

          {/* Título principal */}
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Jiu Jitsu Brasileño
            <span className="block text-red-600 mt-2">en CDMX</span>
          </h2>

          {/* Línea decorativa */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-1 w-20 bg-red-600"></div>
            <div className="h-1 w-20 bg-white mx-2"></div>
            <div className="h-1 w-20 bg-red-600"></div>
          </div>

          {/* Descripción */}
          <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8">
            Descubre el arte del Jiu Jitsu Brasileño en CDMX, una disciplina que
            combina
            <span className="text-red-600 font-semibold"> técnica</span>,
            <span className="text-red-600 font-semibold"> estrategia </span>y{" "}
            <span className="text-red-600 font-semibold">
              resistencia física
            </span>{" "}
            para alcanzar el máximo rendimiento.
          </p>

          <p className="text-base text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            En nuestra academia, te sumergirás en un entrenamiento
            especializado, guiado por instructores expertos que te ayudarán a
            desarrollar habilidades de defensa personal, mejorar tu condición
            física y fortalecer tu confianza. No importa si eres principiante o
            avanzado, aquí encontrarás un ambiente de aprendizaje dinámico y
            desafiante.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/nuestros-entrenadores"
              className="inline-flex items-center justify-center bg-red-600 text-white font-bold px-8 py-4 rounded-full hover:bg-red-600/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Conoce a nuestros entrenadores
            </a>
            <a
              href="/contacto"
              className="inline-flex items-center justify-center border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
            >
              Contáctanos
            </a>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-700">
            <div>
              <p className="text-4xl md:text-5xl font-black text-red-600 mb-2">
                +20
              </p>
              <p className="text-sm md:text-base text-gray-400 uppercase tracking-wide">
                Años de experiencia
              </p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-red-600 mb-2">
                4
              </p>
              <p className="text-sm md:text-base text-gray-400 uppercase tracking-wide">
                Disciplinas
              </p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-red-600 mb-2">
                100%
              </p>
              <p className="text-sm md:text-base text-gray-400 uppercase tracking-wide">
                Dedicación
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-18">
        <Carrusel2 />
      </div>
    </section>
  );
};
