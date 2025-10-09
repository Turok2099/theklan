import Image from "next/image";

export const IntroSection = () => {
  return (
    <section className="w-full bg-white py-16 px-3 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-last md:order-first">
          <h2 className="text-hero-title font-black mb-8 text-gray-900">
            The Klan
          </h2>

          <div className="bg-red-600 text-white px-6 py-4 rounded-2xl mb-8 inline-block">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug">
              El mejor lugar para entrenar Jiu Jitsu Brasileño en CDMX
            </h3>
          </div>

          <div className="w-20 h-1 bg-red-600 mb-6"></div>

          <p className="text-lg md:text-xl leading-relaxed text-gray-700 font-light">
            Somos un estudio privado en la{" "}
            <span className="font-semibold text-gray-900">
              Colonia Del Valle
            </span>{" "}
            enfocado al Combate y las Artes Marciales. Tenemos más de{" "}
            <span className="font-semibold text-gray-900">20 años</span> dando
            resultados eficientes y significativos en corto tiempo a todo aquel
            que entrena con nosotros.
          </p>
        </div>

        <div className="relative w-full h-64 md:h-96 lg:h-[500px] order-first md:order-last">
          <Image
            src="https://res.cloudinary.com/dxbtafe9u/image/upload/f_auto,q_auto:eco,w_800/The%20Klan/hero-image.jpg"
            alt="Entrenamiento de Jiu Jitsu"
            fill
            className="object-cover rounded-lg shadow-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={75}
          />
        </div>
      </div>
    </section>
  );
};
