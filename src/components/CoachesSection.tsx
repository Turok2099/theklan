"use client";

import { CoachGallery } from "./CoachGallery";

export const CoachesSection = () => {
  const coaches = [
    {
      name: "Francisco Ramírez",
      title: "HEAD COACH",
      description:
        "Fundador y Head Coach. Más de 25 años de experiencia en Artes Marciales, Instructor de kickboxing (Dingolfing, Alemania) Avalado por WAKO Baviera Germany Full-contact, Kung Fu, American Kenpo, Kenpo Kinetico, Jiu-jitsu Brazileño, Universal Submission, Combativs (Alemania), Muay Thai, Boxeo Amateur y Profesional, Especialista en Striking.",
      teaches: ["JIU-JITSU BRASILEÑO", "STRIKING"],
      images: [
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429787/The%20Klan/coaches/francisco-ramirez/1.png",
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
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429794/The%20Klan/coaches/francisco-ramirez/13.jpg",
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429794/The%20Klan/coaches/francisco-ramirez/14.jpg",
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429795/The%20Klan/coaches/francisco-ramirez/15.jpg",
      ],
    },
    {
      name: "Sebastián Gómez",
      title: "INSTRUCTOR MMA",
      description:
        "Peleador profesional de MMA en las 145LB. Campeón Nacional de Muay Thai 3 veces. Cinta azul de Jiu-jitsu. 8 años y medio de experiencia en Muay Thai. 4 años y medio de experiencia en Jiu-jitsu y Lucha.",
      teaches: ["MMA"],
      images: [
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428614/The%20Klan/coaches/sebastian-gomez/1-3.png",
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428615/The%20Klan/coaches/sebastian-gomez/2-3.png",
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428617/The%20Klan/coaches/sebastian-gomez/3-3.png",
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428618/The%20Klan/coaches/sebastian-gomez/4-3.png",
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428619/The%20Klan/coaches/sebastian-gomez/5-3.png",
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428621/The%20Klan/coaches/sebastian-gomez/WhatsApp-Image-2025-06-05-at-11.jpg",
      ],
    },
    {
      name: "Luis González",
      title: "ENTRENADOR FUNCIONAL",
      description:
        "Entrenador especializado en Crossfit, Hyrox, HIIT, entrenamiento funcional, Clubbells y Kettlebells.",
      teaches: ["ENTRENAMIENTO FUNCIONAL"],
      images: [
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428622/The%20Klan/coaches/luis-gonzalez/WhatsApp-Image-2025-06-20-at-12.jpg",
      ],
    },
    {
      name: "Joaquín Lino",
      title: "INSTRUCTOR JIU-JITSU INFANTIL",
      description:
        "Más de 7 años de experiencia en Jiu-Jitsu Brasileño. Campeón de FJJRIO, IBJJF y KOTM. Subcampeón mundial en CBJJO y ADCC-CDMX.",
      teaches: ["JIU-JITSU INFANTIL"],
      images: [
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428624/The%20Klan/coaches/joaquin-lino/13.png",
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428626/The%20Klan/coaches/joaquin-lino/TheKlan-EntregaFinal-13.jpg",
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428627/The%20Klan/coaches/joaquin-lino/TheKlan-EntregaFinal-18.jpg",
        "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428628/The%20Klan/coaches/joaquin-lino/WhatsApp-Image-2025-06-16-at-5.jpg",
      ],
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Título de sección */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            NUESTROS ENTRENADORES
          </h2>
          <div className="w-24 h-1 bg-red-600 mx-auto"></div>
        </div>

        {/* Entrenadores */}
        <div className="space-y-24">
          {coaches.map((coach) => (
            <div
              key={coach.name}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Header del entrenador */}
              <div className="bg-black px-8 py-10 md:px-12 md:py-12">
                <div className="max-w-4xl">
                  <p className="text-red-600 font-bold text-sm md:text-base mb-3 uppercase tracking-wider">
                    {coach.title}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    {coach.name}
                  </h3>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    {coach.description}
                  </p>
                </div>
              </div>

              {/* Disciplinas */}
              <div className="px-8 py-6 md:px-12 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="text-gray-700 font-semibold text-lg">
                    IMPARTE:
                  </span>
                  {coach.teaches.map((subject) => (
                    <span
                      key={subject}
                      className="inline-flex items-center bg-red-600 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-md hover:bg-red-600/90 transition-colors"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Galería de imágenes */}
              <div className="px-8 py-10 md:px-12 md:py-12">
                <CoachGallery images={coach.images} coachName={coach.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
