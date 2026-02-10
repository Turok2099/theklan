"use client";

import Image from "next/image";

export const Rules = () => {
    const sections = [
        {
            title: "1. Normas Generales de Disciplina",
            items: [
                {
                    label: "Respeto Mutuo",
                    content:
                        "Todos los miembros deben mostrar respeto hacia los instructores, compañeros y el personal en todo momento, tanto dentro como fuera del tatami.",
                },
                {
                    label: "Puntualidad",
                    content:
                        "Es obligatorio llegar a tiempo a las clases de preferencia 5 minutos del inicio. Las llegadas tardías pueden interrumpir el desarrollo de la sesión y afectan el aprendizaje colectivo.",
                },
                {
                    label: "Uso del Uniforme",
                    content:
                        "El gi debe estar limpio y en buen estado. El uso correcto del uniforme es obligatorio durante las clases y competiciones.",
                },
                {
                    label: "Comportamiento",
                    content:
                        "Está prohibido el uso de lenguaje ofensivo, gestos inapropiados o cualquier conducta violenta o disruptiva.",
                },
                {
                    label: "Atención y Participación",
                    content:
                        "Se debe prestar atención a las instrucciones del profesor y participar activamente en las actividades y entrenamientos.",
                },
                {
                    label: "Dispositivos Electrónicos",
                    content:
                        "Durante la clase, el uso de teléfonos móviles o dispositivos electrónicos está prohibido para evitar distracciones.",
                },
            ],
        },
        {
            title: "2. Normas de Higiene y Limpieza",
            items: [
                {
                    label: "Higiene Personal",
                    content:
                        "Todos los practicantes deben acudir a clase con una higiene adecuada: uñas cortas, cuerpo y gi limpios, cabello recogido si es necesario, y uso de desodorante.",
                },
                {
                    label: "Limpieza del Gi y Equipo",
                    content:
                        "El gi y cualquier equipo personal deben estar limpios antes de cada entrenamiento para evitar contagios y mantener un ambiente saludable.",
                },
                {
                    label: "Uso de Protector Bucal y Accesorios",
                    content:
                        "Se recomienda el uso de protector bucal y otros accesorios higiénicos para proteger la salud durante el entrenamiento.",
                },
                {
                    label: "Enfermedad",
                    content:
                        "Se recomienda recuperarse en casa y no asistir a las clases para evitar contagios.",
                },
                {
                    label: "Limpieza del Tatami",
                    content:
                        "Cada miembro debe colaborar en mantener el área de entrenamiento limpia. Está prohibido comer o beber (excepto agua) sobre el tatami. Y pisar con calzado el mismo.",
                },
                {
                    label: "Desinfección",
                    content:
                        "Se deben seguir las indicaciones del instructor para la desinfección del tatami y el equipo, especialmente en casos de heridas o sudor excesivo llevar toalla.",
                },
            ],
        },
        {
            title: "3. Responsabilidades y Sanciones",
            items: [
                {
                    label: "Responsabilidad Individual",
                    content:
                        "Cada miembro es responsable de sus pertenencias y de cuidar las instalaciones.",
                },
                {
                    label: "Reportar Incidentes",
                    content:
                        "Cualquier lesión, accidente o situación irregular debe ser reportada inmediatamente al instructor.",
                },
                {
                    label: "Sanciones",
                    content:
                        "El incumplimiento de las normas puede conllevar advertencias, suspensión temporal o expulsión, dependiendo de la gravedad de la falta.",
                },
                {
                    label: "Resolución de Conflictos",
                    content:
                        "Los conflictos deben resolverse con diálogo y respeto, siempre con la mediación del instructor o responsable del grupo.",
                },
            ],
        },
        {
            title: "4. Compromiso con The Klan",
            items: [
                {
                    label: "Fomentar el Espíritu de Equipo",
                    content:
                        "Se espera que todos los miembros apoyen y respeten la filosofía y valores de The Klan.",
                },
                {
                    label: "Participación en Eventos",
                    content:
                        "La asistencia a seminarios, competencias y actividades especiales es parte del compromiso con el crecimiento personal y colectivo.",
                },
                {
                    label: "Promoción de la Disciplina",
                    content:
                        "Cada miembro debe ser un ejemplo de disciplina y limpieza dentro y fuera de la academia.",
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-pure-black text-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] w-full overflow-hidden flex items-end justify-center pb-8">
                {/* Background Image */}
                <Image
                    src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1759975321/The%20Klan/static/contacto.jpg"
                    alt="Reglamento The Klan"
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-black/40" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-white drop-shadow-xl">
                        Reglamento <span className="text-primary">2026</span>
                    </h1>
                    <div className="w-40 h-2 bg-primary mx-auto mb-8 skew-x-[-12deg]" />
                    <p className="text-xl md:text-3xl text-gray-200 font-light tracking-wide">
                        THE KLAN MARTIAL ARTS
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-5xl mx-auto space-y-20">
                    {sections.map((section, index) => (
                        <div key={index} className="relative">
                            {/* Section Decoration */}
                            <div className="absolute -left-4 md:-left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-30" />

                            <h2 className="text-3xl md:text-4xl font-black text-white mb-10 flex items-center gap-4">
                                <span className="text-primary text-5xl opacity-50 select-none">{index + 1}</span>
                                {section.title.replace(/^\d+\.\s/, "")}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {section.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:bg-zinc-900 hover:border-primary/30 transition-all duration-300 group"
                                    >
                                        <h3 className="text-primary font-bold text-lg mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-primary rounded-full group-hover:scale-125 transition-transform" />
                                            {item.label}
                                        </h3>
                                        <p className="text-gray-400 font-light leading-relaxed group-hover:text-gray-300 transition-colors">
                                            {item.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Footer of Rules */}
                    <div className="text-center pt-12 border-t border-white/10 mt-20">
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
                            The Klan Martial Arts
                        </h3>
                        <p className="text-gray-500 font-mono">
                            Disciplina • Lealtad • Honor
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
