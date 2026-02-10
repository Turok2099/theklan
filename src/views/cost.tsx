import { PlansSection } from "@/components/PlansSection";
import Image from "next/image";
import { TextMarquee } from "@/components/Carrusel1";

export const Cost = () => {
  const schedule: Record<string, Array<{ time: string; label: string }>> = {
    Lunes: [
      { time: "07:00", label: "STK" },
      { time: "08:00", label: "STK" },
      { time: "09:00", label: "Funcional" },
      { time: "17:00", label: "BJJ Juniors" },
      { time: "18:00", label: "STK" },
      { time: "19:00", label: "MMA" },
      { time: "20:30", label: "BJJ No Gi" },
    ],
    Martes: [
      { time: "07:00", label: "BJJ & Box" },
      { time: "08:00", label: "STK" },
      { time: "10:00", label: "Lucha Olímpica" },
      { time: "17:00", label: "BJJ Kids" },
      { time: "18:00", label: "STK" },
      { time: "19:30", label: "BJJ Principiantes" },
      { time: "20:30", label: "BJJ" },
    ],
    Miércoles: [
      { time: "07:00", label: "STK" },
      { time: "08:00", label: "STK" },
      { time: "09:00", label: "Funcional" },
      { time: "17:00", label: "BJJ Juniors" },
      { time: "18:00", label: "STK" },
      { time: "19:00", label: "MMA" },
      { time: "20:30", label: "Lucha Olímpica" },
    ],
    Jueves: [
      { time: "07:00", label: "BJJ & Box" },
      { time: "08:00", label: "STK" },
      { time: "10:00", label: "Lucha Olímpica" },
      { time: "17:00", label: "BJJ Kids" },
      { time: "18:00", label: "STK" },
      { time: "19:30", label: "BJJ Principiantes" },
      { time: "20:30", label: "BJJ" },
    ],
    Viernes: [
      { time: "07:00", label: "STK" },
      { time: "08:00", label: "STK" },
      { time: "09:00", label: "Funcional" },
      { time: "17:00", label: "BJJ Juniors" },
      { time: "18:00", label: "STK" },
      { time: "19:00", label: "MMA" },
      { time: "20:30", label: "Open Mat" },
    ],
    Sábado: [
      { time: "09:00", label: "BJJ Todos los Niveles" },
      { time: "10:30", label: "Striking" },
      { time: "12:00", label: "Open Mat" },
    ]
  };

  const order = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] as const;

  return (
    <div className="min-h-screen bg-pure-black text-white">
      {/* Hero Header */}
      <section className="relative h-[90vh] w-full overflow-hidden flex items-end justify-center pb-8 top-0">
        {/* Background Image */}
        <Image
          src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1759975321/The%20Klan/static/contacto.jpg" // Using an existing or placeholder image
          alt="Costos y Horarios Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter text-white drop-shadow-xl">
            Costos y <span className="text-primary">Horarios</span>
          </h1>

        </div>
      </section>

      <TextMarquee />

      <PlansSection />

      {/* Horarios Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-900 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase italic tracking-tighter">
              Horarios de <span className="text-primary">Clase</span>
            </h2>
            <div className="inline-block bg-black/50 border border-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
              <p className="text-sm md:text-base font-bold text-gray-300">
                <span className="text-primary">STK:</span> Striking • <span className="text-primary">BJJ:</span> Brazilian Jiu Jitsu • <span className="text-primary">No Gi:</span> Sin Kimono • <span className="text-primary">MMA:</span> Artes Marciales Mixtas
              </p>
            </div>
          </div>

          {/* Grid de Horarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {order.map((day) => (
              <div key={day} className="bg-black border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
                <div className="bg-white/5 p-4 border-b border-white/10 group-hover:bg-primary/20 transition-colors">
                  <h3 className="text-xl font-black text-center uppercase tracking-wide text-white">
                    {day}
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {schedule[day]?.map((slot, i) => (
                      <li key={`${day}-${i}`} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                        <span className="font-bold text-primary font-mono">{slot.time}</span>
                        <span className="text-gray-300 text-sm font-medium uppercase tracking-wide text-right">{slot.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm italic">* Los horarios están sujetos a cambios sin previo aviso. Consulta disponibilidad en recepción.</p>
          </div>
        </div>
      </section>

      {/* Promociones / Call to Action */}
      <section className="py-24 px-6 relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-black/20 pattern-grid-lg opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase italic tracking-tighter">¿Listo para empezar?</h2>
          <p className="text-xl md:text-2xl mb-10 font-medium">Agenda tu clase de muestra hoy mismo y forma parte de The Klan.</p>
          <a href="https://wa.me/525613701366" target="_blank" rel="noopener noreferrer" className="bg-white text-primary hover:bg-black hover:text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-block">
            Agendar Clase Gratis
          </a>
        </div>
      </section>
    </div>
  );
};
