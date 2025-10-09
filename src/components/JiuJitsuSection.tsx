export const JiuJitsuSection = () => {
  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-24">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl shadow-2xl p-10 md:p-16 max-w-7xl mx-auto">
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
          {/* Título principal */}
          <h2 className="text-hero-title font-black mb-8 text-white">
            Jiu Jitsu Brasileño en CDMX
          </h2>

          {/* Badge - 20 años de experiencia */}
          <div className="inline-flex items-center justify-center mb-10">
            <span className="bg-red-600 text-white px-6 py-3 rounded-full text-sm md:text-base font-black uppercase tracking-widest shadow-lg">
              Más de 20 años de experiencia
            </span>
          </div>

          {/* Línea decorativa */}
          <div className="flex items-center justify-center mb-10">
            <div className="h-1 w-24 bg-red-600"></div>
            <div className="h-1 w-24 bg-white mx-3"></div>
            <div className="h-1 w-24 bg-red-600"></div>
          </div>

          {/* Descripción */}
          <p className="text-xl md:text-2xl text-white leading-relaxed max-w-4xl mx-auto mb-10 font-light">
            Descubre el arte del Jiu Jitsu Brasileño en CDMX, una disciplina que
            combina
            <span className="text-red-600 font-bold"> técnica</span>,
            <span className="text-red-600 font-bold"> estrategia </span>y{" "}
            <span className="text-red-600 font-bold">resistencia física</span>{" "}
            para alcanzar el máximo rendimiento.
          </p>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t-2 border-gray-700">
            <div className="group">
              <p className="text-5xl md:text-6xl lg:text-7xl font-black text-red-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                +20
              </p>
              <p className="text-sm md:text-base lg:text-lg text-gray-300 uppercase tracking-widest font-bold">
                Años de experiencia
              </p>
            </div>
            <div className="group">
              <p className="text-5xl md:text-6xl lg:text-7xl font-black text-red-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                4
              </p>
              <p className="text-sm md:text-base lg:text-lg text-gray-300 uppercase tracking-widest font-bold">
                Disciplinas
              </p>
            </div>
            <div className="group">
              <p className="text-5xl md:text-6xl lg:text-7xl font-black text-red-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                100%
              </p>
              <p className="text-sm md:text-base lg:text-lg text-gray-300 uppercase tracking-widest font-bold">
                Dedicación
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
