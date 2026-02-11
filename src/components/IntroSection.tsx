import Image from "next/image";
import { getCloudinaryImageUrl } from "@/lib/cloudinary";

export const IntroSection = () => {
  const introImg = "https://res.cloudinary.com/dxbtafe9u/image/upload/v1770766480/WhatsApp_Image_2026-02-10_at_4.56.19_PM_4_qpkw0j.jpg";

  return (
    <section className="py-24 bg-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="z-10 px-4 sm:px-0">
            <h2 className="text-6xl font-black text-white uppercase tracking-tighter mb-2 italic">
              THE <span className="text-primary">KLAN</span>
            </h2>
            <div className="h-1 w-24 bg-primary mb-8"></div>

            <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide leading-tight mb-8">
              El mejor lugar para entrenar <br />
              <span className="text-primary">Jiu Jitsu Brasileño</span> en CDMX
            </h3>

            <p className="text-gray-400 text-lg leading-relaxed font-medium">
              Somos un estudio privado en la Colonia Del Valle enfocado al Combate y las Artes Marciales.
              Tenemos más de 20 años dando resultados eficientes y significativos en corto tiempo a todo
              aquel que entrena con nosotros.
            </p>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative h-[85vh] w-full">
              {/* Gritty border effect */}
              <div className="absolute -inset-4 border-2 border-white/10 z-0 transform rotate-2"></div>
              <div className="absolute -inset-4 border-2 border-primary/20 z-0 transform -rotate-1"></div>

              <div className="relative h-full w-full bg-zinc-900 overflow-hidden shadow-2xl skew-y-0 transform hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src={introImg}
                  alt="The Klan BJJ Studio"
                  fill
                  className="object-cover object-right-top"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
