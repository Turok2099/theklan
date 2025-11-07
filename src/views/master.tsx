"use client";

import { CoachGallery } from "@/components/CoachGallery";
import Image from "next/image";

export const Master = () => {
  const images = [
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428590/The%20Klan/coaches/francisco-ramirez/2.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428596/The%20Klan/coaches/francisco-ramirez/3.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428597/The%20Klan/coaches/francisco-ramirez/4.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428601/The%20Klan/coaches/francisco-ramirez/5.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428603/The%20Klan/coaches/francisco-ramirez/6.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428606/The%20Klan/coaches/francisco-ramirez/7.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428607/The%20Klan/coaches/francisco-ramirez/8.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429810/The%20Klan/coaches/francisco-ramirez/9.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429789/The%20Klan/coaches/francisco-ramirez/10.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428588/The%20Klan/coaches/francisco-ramirez/11.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429793/The%20Klan/coaches/francisco-ramirez/12.jpg",

    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429794/The%20Klan/coaches/francisco-ramirez/14.jpg",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section con imagen de fondo */}
      <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429793/The%20Klan/coaches/francisco-ramirez/12.jpg"
          alt="Master Francisco Ramírez"
          fill
          priority
          className="object-cover object-top"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Contenido */}
        <div className="relative z-10 h-full flex flex-col items-center justify-end px-6 md:px-12 lg:px-24 pb-14 md:pb-20 text-center text-white">
          <p className="text-red-600 font-bold text-sm md:text-base uppercase tracking-wider mb-3 md:mb-4">
            HEAD COACH & FUNDADOR
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 md:mb-6">
            Master Francisco Ramírez
          </h1>
          <div className="w-32 h-1 bg-red-600 mx-auto mb-6 md:mb-8" />
          <p className="text-lg md:text-2xl text-gray-200 max-w-4xl mx-auto">
            Más de 20 años dedicados a las Artes Marciales y formando campeones
          </p>
        </div>
      </section>

      {/* Grados y Certificaciones */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Grados y Certificaciones
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Grados Marciales
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">●</span>
                  <span className="text-gray-700">
                    Cinturón Negro en Jiu Jitsu Brasileño
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">●</span>
                  <span className="text-gray-700">
                    Cinturón Negro 6to grado en KENPO
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Certificaciones
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">●</span>
                  <span className="text-gray-700">
                    Cinta negra IBJJF 318063
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">●</span>
                  <span className="text-gray-700">
                    Curso de arbitraje IBJJF
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">●</span>
                  <span className="text-gray-700">Curso de ética IBJJF</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">●</span>
                  <span className="text-gray-700">
                    International ward kenpo # WK-MX-01 May 2019
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3 text-xl">●</span>
                  <span className="text-gray-700">
                    Instructor de Kickboxing avalado por WAKO Baviera Germany
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Linaje Marcial */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Linaje Marcial
          </h2>

          <div className="bg-gradient-to-r from-gray-900 to-black text-white p-8 md:p-12 rounded-xl">
            <div className="max-w-4xl mx-auto">
              <ul className="space-y-4">
                <li className="text-lg md:text-xl">
                  <span className="text-red-600 font-bold">→</span> Grand Master
                  Ed Parker
                </li>
                <li className="text-lg md:text-xl pl-8">
                  <span className="text-red-600 font-bold">→</span> Senior
                  Master Ed Parker Jr.
                </li>
                <li className="text-lg md:text-xl pl-16">
                  <span className="text-red-600 font-bold">→</span> Master Frank
                  Soto
                </li>
                <li className="text-lg md:text-xl pl-8">
                  <span className="text-red-600 font-bold">→</span> Master Jhon
                  Ward (Cinturón Negro 10° grado, Dublin, Irlanda)
                </li>
                <li className="text-lg md:text-xl">
                  <span className="text-red-600 font-bold">→</span> Maestre
                  Juarez Soares (Cinturón Negro 6° grado)
                </li>
                <li className="text-lg md:text-xl">
                  <span className="text-red-600 font-bold">→</span> Maestre
                  Wilson Feu (Cinturón Negro 3° grado)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Experiencia y Trayectoria */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Experiencia y Trayectoria
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Fundador
                </h3>
                <p className="text-gray-700">
                  The Klan – Forging Lives in Martial Arts CDMX (2004)
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Experiencia
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Más de 25 años de experiencia en artes marciales</li>
                  <li>• 15 años enseñando defensa personal</li>
                  <li>• Entrenador de Jiu Jitsu en UFC GYM</li>
                  <li>• Esquina en peleadores de MMA Pro</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Especialidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Striking",
                  "Muay Thai",
                  "Boxeo",
                  "Full-contact",
                  "Kung Fu",
                  "American Kenpo",
                  "Kenpo Kinético",
                  "Jiu Jitsu Brasileño",
                  "Universal Submission",
                  "Combatives",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logros en Competencias */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Logros en Competencias
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                year: "2025",
                achievement: "Participante en el Wold Master IBJJF",
                location: "Las Vegas, Estados Unidos",
              },
              {
                year: "2024",
                achievement:
                  "Premio a lo más descarado del deporte y fineness 2024",
                location: "Ciudad de México, México",
              },

              {
                year: "2024",
                achievement: "Subcampeón Mundial CBJJO",
                location: "Río de Janeiro, Brasil",
              },
              {
                year: "2024",
                achievement: "Subcampeón del Estado FJJBRIO",
                location: "Río de Janeiro, Brasil",
              },
              {
                year: "2022",
                achievement: "Campeón Carioca FJJBRIO",
                location: "Río de Janeiro, Brasil",
              },
              {
                year: "2022",
                achievement: "3er Lugar IBJJF",
                location: "São Paulo, Brasil",
              },
              {
                year: "2019",
                achievement: "Campeón Nacional FNJJB",
                location: "México",
              },
              {
                year: "2018-2020",
                achievement: "Ganador en Torneo WFI (SuperFight)",
                location: "México",
              },
              {
                year: "2018",
                achievement: "Subcampeón Internacional IBJJF",
                location: "México",
              },
              {
                year: "2015",
                achievement: "Subcampeón Nacional Open México",
                location: "México",
              },
            ].map((trophy, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
              >
                <p className="text-red-600 font-bold text-sm mb-2">
                  {trophy.year}
                </p>
                <h3 className="text-lg font-bold mb-2">{trophy.achievement}</h3>
                <p className="text-gray-400 text-sm">{trophy.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seguridad Personal */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Especialista en Seguridad Personal
          </h2>

          <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <li className="flex items-start">
                <span className="text-red-600 mr-3 text-xl">✓</span>
                <span className="text-gray-700">
                  Entrenamiento a Guardia Nacional
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3 text-xl">✓</span>
                <span className="text-gray-700">
                  Entrenamiento a Fuerzas de la Policía Federal y Estatal
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3 text-xl">✓</span>
                <span className="text-gray-700">
                  Capacitación a Policía de Tránsito SSP CDMX
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3 text-xl">✓</span>
                <span className="text-gray-700">
                  Instrucción en manejo de armas de fuego por capitanes del
                  Ejército Mexicano
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3 text-xl">✓</span>
                <span className="text-gray-700">
                  Talleres de Prevención y Seguridad Personal en más de 30
                  empresas privadas
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Apariciones en Medios */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Apariciones en Medios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Revistas
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Men's Health",
                  "Saludable",
                  "Artes Marciales",
                  "Tatami Ilustrado",
                ].map((magazine) => (
                  <span
                    key={magazine}
                    className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold"
                  >
                    {magazine}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Televisión
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>• Hoy (Televisa)</p>
                <p>• La Jugada</p>
                <p>• Ponte Fit (TUDN)</p>
                <p>• Venga la Alegría (TV Azteca)</p>
                <p>• Grupo Fórmula</p>
                <p>• Azteca América (EE.UU.)</p>
                <p>• El Heraldo TV</p>
                <p>• TeleFórmula</p>
                <p>• Efecto TV</p>
                <p>• World TV</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-red-600 to-red-600 text-white p-8 rounded-xl text-center">
            <p className="text-xl font-bold">
              Participación en la película &quot;El Negocio&quot; (Bogotá,
              Colombia)
            </p>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Galería
          </h2>
          <CoachGallery images={images} coachName="Francisco Ramírez" />
        </div>
      </section>
    </div>
  );
};
