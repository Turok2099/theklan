"use client";

import { CoachGallery } from "@/components/CoachGallery";
import Image from "next/image";

export const Master = () => {
  const images = [
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1770769807/WhatsApp_Image_2026-02-10_at_6.21.24_PM_rntehe.jpg",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1770769806/WhatsApp_Image_2026-02-10_at_6.21.01_PM_lcpziw.jpg",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427156/The%20Klan/3.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1761709455/WhatsApp_Image_2025-10-28_at_6.26.36_PM_hcsyah.jpg",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429810/The%20Klan/coaches/francisco-ramirez/9.png",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429794/The%20Klan/coaches/francisco-ramirez/14.jpg",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429793/The%20Klan/coaches/francisco-ramirez/12.jpg",
    "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428613/The%20Klan/coaches/francisco-ramirez/WhatsApp%20Image%202025-10-02%20at%2011.jpg",
  ];

  return (
    <div className="min-h-screen bg-pure-black text-white">
      {/* Hero Section con imagen de fondo */}
      <section className="relative w-full h-[85vh] overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429793/The%20Klan/coaches/francisco-ramirez/12.jpg"
          alt="Master Francisco Ramírez"
          fill
          priority
          className="object-cover object-top"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-black/30" />

        {/* Contenido */}
        <div className="relative z-10 h-full flex flex-col items-start justify-between px-6 md:px-12 lg:px-24 pb-20 md:pb-32 pt-32 text-left">
          <div className="border border-primary/50 bg-black/50 backdrop-blur-sm px-6 py-2 rounded-full inline-block">
            <span className="text-primary font-black uppercase tracking-widest text-sm md:text-base">
              Head Coach & Fundador
            </span>
          </div>

          <div className="w-full">
            <h1 className="font-black text-white leading-[0.85] mb-6 tracking-tighter mt-5">
              <span className="block text-4xl md:text-6xl lg:text-7xl xl:text-8xl uppercase italic">MASTER</span>
              <span className="block text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-primary drop-shadow-[0_0_15px_rgba(242,13,13,0.6)] uppercase italic">
                FRANCISCO <br /> RAMÍREZ
              </span>
            </h1>

            <div className="w-24 h-2 bg-primary mb-8 skew-x-[-12deg]" />

            <div className="bg-black/90 p-6 md:p-8 rounded-xl inline-block border-l-4 border-primary shadow-2xl backdrop-blur-sm max-w-4xl">
              <p className="text-xl md:text-3xl text-white font-light leading-relaxed">
                Más de <span className="font-bold text-primary">20 años</span> dedicados a las Artes Marciales
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grados y Certificaciones */}
      <section className="py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 skewed-bg pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase italic tracking-tighter">
              Grados y <span className="text-primary">Certificaciones</span>
            </h2>
            <div className="w-full h-px bg-white/10 max-w-xs mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-2xl hover:border-primary/50 transition-colors duration-300">
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary block"></span>
                Grados Marciales
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start group">
                  <span className="text-primary mr-4 text-xl group-hover:scale-125 transition-transform">❖</span>
                  <span className="text-gray-300 text-lg font-medium group-hover:text-white transition-colors">
                    Cinturón Negro en Jiu Jitsu Brasileño
                  </span>
                </li>
                <li className="flex items-start group">
                  <span className="text-primary mr-4 text-xl group-hover:scale-125 transition-transform">❖</span>
                  <span className="text-gray-300 text-lg font-medium group-hover:text-white transition-colors">
                    Cinturón Negro 6to grado en KENPO
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-2xl hover:border-primary/50 transition-colors duration-300">
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary block"></span>
                Certificaciones
              </h3>
              <ul className="space-y-4">
                {[
                  "Cinta negra IBJJF 318063",
                  "Curso de arbitraje IBJJF",
                  "Curso de ética IBJJF",
                  "International ward kenpo # WK-MX-01 May 2019",
                  "Instructor de Kickboxing avalado por WAKO Baviera Germany"
                ].map((cert, idx) => (
                  <li key={idx} className="flex items-start group">
                    <span className="text-primary mr-4 text-xl group-hover:scale-125 transition-transform">❖</span>
                    <span className="text-gray-300 text-lg font-medium group-hover:text-white transition-colors">
                      {cert}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Linaje Marcial */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-900 border-y border-white/5 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-12 text-center uppercase italic tracking-tighter">
            Linaje <span className="text-primary">Marcial</span>
          </h2>

          <div className="bg-gradient-to-br from-black to-zinc-900 p-8 md:p-14 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Linaje 1: KEMPO */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-primary mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                    <span className="text-white">Linaje</span> KEMPO
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Grand Master Ed Parker",
                      "Senior Master Ed Parker Jr.",
                      "Master Frank Soto",
                      "Master Jhon Ward"
                    ].map((master, idx) => (
                      <li key={idx} className="text-lg md:text-xl font-bold flex flex-col group">
                        <div className="flex items-center">
                          <span className="text-primary font-black mr-3 text-xl group-hover:scale-110 transition-transform">❖</span>
                          <span className="text-gray-200 group-hover:text-white transition-colors">{master}</span>
                        </div>
                        {master === "Master Jhon Ward" && (
                          <span className="text-gray-500 text-sm font-normal ml-8 mt-1 block">
                            (Cinturón Negro 10° grado, Dublin, Irlanda)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Linaje 2: JIUJITSU BRASILEÑO */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-primary mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                    <span className="text-white">Linaje</span> BJJ
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Mitsuyo Maeda",
                      "Luis França",
                      "Oswaldo Fadda",
                      "Monir Salomão",
                      "Juarez Soares",
                      "Wilson Féu"
                    ].map((master, idx) => (
                      <li key={idx} className="text-lg md:text-xl font-bold flex flex-col group">
                        <div className="flex items-center">
                          <span className="text-primary font-black mr-3 text-xl group-hover:scale-110 transition-transform">❖</span>
                          <span className="text-gray-200 group-hover:text-white transition-colors">{master}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experiencia y Trayectoria */}
      <section className="py-24 px-6 md:px-12 lg:px-24 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center uppercase italic tracking-tighter">
            Experiencia y <span className="text-primary">Trayectoria</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="bg-zinc-900/80 p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all">
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-wide">
                  Fundador
                </h3>
                <p className="text-xl text-gray-300 font-light">
                  The Klan – Forging Lives in Martial Arts CDMX <span className="text-primary font-bold">(2004)</span>
                </p>
              </div>

              <div className="bg-zinc-900/80 p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all">
                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-wide">
                  Experiencia
                </h3>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Más de 25 años de experiencia en artes marciales</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>15 años enseñando defensa personal</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Entrenador de Jiu Jitsu en UFC GYM</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span>Esquina en peleadores de MMA Pro</li>
                </ul>
              </div>
            </div>

            <div className="bg-zinc-900/80 p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all">
              <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-wide">
                Especialidades
              </h3>
              <div className="flex flex-wrap gap-3">
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
                    className="bg-white/5 hover:bg-primary/20 text-gray-300 hover:text-white border border-white/10 hover:border-primary/50 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-1"
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
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-16 text-center uppercase italic tracking-tighter">
            Logros en <span className="text-primary">Competencias</span>
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
                  "Premio a lo más destacado del deporte y fitness 2024",
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
                className="bg-black border border-white/10 p-8 rounded-xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(242,13,13,0.1)] transition-all duration-300 group"
              >
                <p className="text-primary font-black text-sm mb-3 tracking-widest border-b border-primary/20 pb-2 inline-block">
                  {trophy.year}
                </p>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{trophy.achievement}</h3>
                <p className="text-gray-500 text-sm uppercase font-bold tracking-wider">{trophy.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seguridad Personal */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-12 text-center uppercase italic tracking-tighter">
                Especialista en <span className="text-primary">Seguridad Personal</span>
              </h2>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  "Entrenamiento a Guardia Nacional",
                  "Entrenamiento a Fuerzas de la Policía Federal y Estatal",
                  "Capacitación a Policía de Tránsito SSP CDMX",
                  "Instrucción en manejo de armas de fuego por capitanes del Ejército Mexicano",
                  "Talleres de Prevención y Seguridad Personal en más de 30 empresas privadas"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                      <span className="text-primary font-bold text-sm">✓</span>
                    </div>
                    <span className="text-gray-300 font-medium text-lg leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Apariciones en Medios */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-16 text-center uppercase italic tracking-tighter">
            Apariciones en <span className="text-primary">Medios</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-zinc-900/50 p-10 rounded-2xl border border-white/5">
              <h3 className="text-2xl font-black text-white mb-8 border-l-4 border-primary pl-4 uppercase">
                Revistas
              </h3>
              <div className="flex flex-wrap gap-4">
                {[
                  "Men's Health",
                  "Saludable",
                  "Artes Marciales",
                  "Tatami Ilustrado",
                ].map((magazine) => (
                  <span
                    key={magazine}
                    className="bg-white text-black px-6 py-3 rounded-lg font-black uppercase tracking-wider transform -skew-x-12 hover:skew-x-0 hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <span className="block transform skew-x-12 hover:skew-x-0">{magazine}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/50 p-10 rounded-2xl border border-white/5">
              <h3 className="text-2xl font-black text-white mb-8 border-l-4 border-primary pl-4 uppercase">
                Televisión
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Hoy (Televisa)", "La Jugada", "Ponte Fit (TUDN)", "Venga la Alegría (TV Azteca)",
                  "Grupo Fórmula", "Azteca América (EE.UU.)", "El Heraldo TV", "TeleFórmula",
                  "Efecto TV", "World TV"
                ].map((tv, idx) => (
                  <p key={idx} className="text-gray-400 font-medium hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary rounded-full"></span>
                    {tv}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-zinc-900 to-black border border-white/10 p-8 rounded-xl text-center shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            <p className="text-xl md:text-2xl font-black text-white uppercase italic tracking-wide relative z-10">
              Participación en la película <span className="text-primary">&quot;El Negocio&quot;</span> <span className="text-gray-400 text-lg not-italic">(Bogotá, Colombia)</span>
            </p>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-16 text-center uppercase tracking-tighter text-white">
            MASTER <span className="text-primary">FRANCISCO</span>
          </h2>
          <CoachGallery images={images} coachName="Francisco Ramírez" />
        </div>
      </section>
    </div>
  );
};
