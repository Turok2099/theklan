"use client";

import { CoachGallery } from "@/components/CoachGallery";
import Image from "next/image";

export const Trainers = () => {
    const coaches = [
        {
            name: "Francisco Ramírez",
            title: "HEAD COACH",
            description:
                "Fundador y Head Coach. Más de 25 años de experiencia en Artes Marciales, Instructor de kickboxing (Dingolfing, Alemania) Avalado por WAKO Baviera Germany Full-contact, Kung Fu, American Kenpo, Kenpo Kinetico, Jiu-jitsu Brazileño, Universal Submission, Combativs (Alemania), Muay Thai, Boxeo Amateur y Profesional, Especialista en Striking.",
            teaches: ["JIU-JITSU BRASILEÑO", "STRIKING"],
            images: [
                "https://res.cloudinary.com/dxbtafe9u/image/upload/v1770769807/WhatsApp_Image_2026-02-10_at_6.21.24_PM_rntehe.jpg",
                "https://res.cloudinary.com/dxbtafe9u/image/upload/v1770769806/WhatsApp_Image_2026-02-10_at_6.21.01_PM_lcpziw.jpg",
                "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427156/The%20Klan/3.png",
                "https://res.cloudinary.com/dxbtafe9u/image/upload/v1761709455/WhatsApp_Image_2025-10-28_at_6.26.36_PM_hcsyah.jpg",
                "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429810/The%20Klan/coaches/francisco-ramirez/9.png",
                "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429794/The%20Klan/coaches/francisco-ramirez/14.jpg",
                "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759429793/The%20Klan/coaches/francisco-ramirez/12.jpg",
                "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428613/The%20Klan/coaches/francisco-ramirez/WhatsApp%20Image%202025-10-02%20at%2011.jpg",
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
        {
            name: 'Luis "El Toro" Zumaya',
            title: "ENTRENADOR LUCHA OLÍMPICA",
            description:
                "Entrenador especializado en Lucha Olímpica. Enfocado en técnicas de derribo, control y grappling para potenciar el juego de pie y suelo.",
            teaches: ["LUCHA OLÍMPICA"],
            images: [
                "https://res.cloudinary.com/dxbtafe9u/image/upload/v1771029402/WhatsApp_Image_2026-02-12_at_9.44.17_AM_s17xmn.jpg",
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-pure-black text-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] w-full overflow-hidden flex items-end justify-center pb-8">
                {/* Background Image - Placeholder or Reuse one */}
                <Image
                    src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1759428594/The%20Klan/hero_bg.jpg"
                    alt="Nuestros Entrenadores"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-black/40" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-white">
                        Nuestros <span className="text-primary">Entrenadores</span>
                    </h1>
                    <div className="w-40 h-2 bg-primary mx-auto mb-8 skew-x-[-12deg]" />
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
                        Conoce a los expertos que te guiarán en tu camino marcial.
                    </p>
                </div>
            </section>

            {/* Coaches List */}
            <section className="py-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto space-y-24">
                    {coaches.map((coach, index) => (
                        <div
                            key={coach.name}
                            className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex flex-col lg:flex-row">
                                {/* Content */}
                                <div className="p-8 md:p-12 lg:w-1/2 flex flex-col justify-center">
                                    <div className="mb-4">
                                        <span className="text-primary font-black tracking-widest uppercase text-sm border border-primary/30 px-3 py-1 rounded-full bg-primary/10">
                                            {coach.title}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">
                                        {coach.name}
                                    </h3>
                                    <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light">
                                        {coach.description}
                                    </p>

                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                                            <span className="w-1 h-4 bg-primary block" />
                                            Especialidades
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {coach.teaches.map((subject) => (
                                                <span
                                                    key={subject}
                                                    className="bg-black border border-white/10 px-4 py-2 rounded-lg text-sm font-bold text-gray-300 uppercase hover:text-primary hover:border-primary/50 transition-colors"
                                                >
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Gallery/Image Area */}
                                <div className="lg:w-1/2 p-6 md:p-8 bg-black/30">
                                    <div className="h-full rounded-2xl overflow-hidden border border-white/5 bg-zinc-950/50 p-4">
                                        <CoachGallery images={coach.images} coachName={coach.name} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
