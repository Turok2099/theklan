"use client";

import Image from "next/image";

export const Contact = () => {
  return (
    <main className="min-h-screen bg-white py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Contacto
          </h1>
          <div className="w-24 h-1 bg-red-600 mx-auto" />
        </header>

        {/* Contenido */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Datos de contacto */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Dirección
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Anaxágoras 944, Col. Del Valle, CP 03100, 03020 Ciudad de México
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Teléfono
              </h2>
              <p>
                <a
                  href="tel:5613701366"
                  className="text-red-600 font-semibold hover:underline"
                >
                  56-1370-1366
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email</h2>
              <p>
                <a
                  href="mailto:contacto@theklanbjj.com.mx"
                  className="text-red-600 font-semibold hover:underline"
                >
                  contacto@theklanbjj.com.mx
                </a>
              </p>
            </div>
          </div>

          {/* Mapa */}
          <div className="w-full">
            <div className="relative w-full h-[380px] md:h-[450px] rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3763.6602822106515!2d-99.158454!3d19.383857!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ffa796a56025%3A0x6c9c08cbb4a17a3e!2sAnax%C3%A1goras%20944%2C%20Narvarte%20Poniente%2C%20Benito%20Ju%C3%A1rez%2C%2003020%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX%2C%20M%C3%A9xico!5e0!3m2!1ses-419!2sus!4v1759433173706!5m2!1ses-419!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* Formulario con fondo (transparente) */}
        <section className="mt-16">
          <div className="relative w-full min-h-[600px] md:min-h-[640px] rounded-2xl shadow-2xl overflow-hidden">
            {/* Fondo */}
            <Image
              src="/contacto.jpg"
              alt="The Klan - Contacto"
              fill
              sizes="100vw"
              quality={60}
              className="absolute inset-0 object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />

            {/* Formulario */}
            <div className="relative z-10 flex items-center justify-center py-8 px-4 md:py-12">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 text-white"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                  Envíanos un mensaje
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-200 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-200 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      placeholder="Tu teléfono"
                      className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-200 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-200 mb-1">
                      Mensaje
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Cuéntanos en qué podemos ayudarte"
                      className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center bg-red-600 hover:bg-red-600/90 transition-colors font-bold px-8 py-3 rounded-full shadow-lg"
                  >
                    Enviar mensaje
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
