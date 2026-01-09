"use client";

import Image from "next/image";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

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
  };

  const order = ["Lunes", "Martes", "Miércoles", "Jueves"] as const;

  return (
    <main className="min-h-screen bg-white py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Costos y Horarios
          </h1>
          <div className="w-24 h-1 bg-red-600 mx-auto" />
        </header>

        {/* Leyenda (sobre el horario) */}
        <div className="mb-10">
          <p className="text-center text-lg md:text-xl font-semibold text-gray-900">
            STK: Striking • BJJ: Brazilian Jiu Jitsu • No Gi: sin kimono • MMA:
            Artes Marciales Mixtas
          </p>
        </div>

        {/* Horario semanal */}
        <section>
          <h2 className="sr-only">Horario semanal</h2>

          {/* Móvil/Tablet: tarjetas por día */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
            {order.map((day) => (
              <div key={day} className="bg-gray-50 rounded-xl shadow p-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {day}
                </h3>
                <ul className="space-y-2">
                  {schedule[day].map((slot, i) => (
                    <li
                      key={`${day}-${i}`}
                      className="group flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-2 hover:bg-red-600 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 group-hover:text-white">
                        {slot.time}
                      </span>
                      <span className="text-gray-700 group-hover:text-white">
                        {slot.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Escritorio: un solo módulo con 4 columnas */}
          <div className="hidden lg:block">
            <div className="bg-black rounded-2xl shadow p-6 lg:p-8">
              <div className="grid grid-cols-4 gap-6">
                {order.map((day) => (
                  <div key={`desk-${day}`}>
                    <h3 className="text-xl font-bold text-red-600 mb-4 text-center">
                      {day}
                    </h3>
                    <ul className="space-y-2">
                      {schedule[day].map((slot, i) => (
                        <li
                          key={`desk-${day}-${i}`}
                          className="group bg-white rounded-lg border border-gray-200 px-3 py-2 flex flex-col items-center hover:bg-red-600 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 group-hover:text-white">
                            {slot.time}
                          </span>
                          <span className="text-gray-700 text-sm group-hover:text-white">
                            {slot.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Costos (imagen) */}
        <section className="mt-12">
          <div className="max-w-6xl mx-auto">
            {/* Grid para las dos imágenes de planes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Plan 1 */}
              <div className="relative w-full">
                <Image
                  src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1767977235/plan1_dher9s.jpg"
                  alt="Plan 1 - The Klan BJJ"
                  width={800}
                  height={1200}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                  className="w-full h-auto rounded-xl shadow-lg"
                  priority
                />
              </div>

              {/* Plan 2 */}
              <div className="relative w-full">
                <Image
                  src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1767977236/plan2_yeik7g.jpg"
                  alt="Plan 2 - The Klan BJJ"
                  width={800}
                  height={1200}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                  className="w-full h-auto rounded-xl shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nota (oculta, se movió arriba en grande) */}
        <p className="sr-only">
          STK: Striking • BJJ: Brazilian Jiu Jitsu • No Gi: sin kimono • MMA:
          Artes Marciales Mixtas
        </p>
      </div>
    </main>
  );
};
