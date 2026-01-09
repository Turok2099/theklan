import { Carrusel2 } from "@/components/Carrusel2";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TeamPreview } from "@/components/TeamPreview";
import { HeadCoach } from "@/components/HeadCoach";
import { GoogleReviews } from "@/components/GoogleReviews";
import { JiuJitsuSection } from "@/components/JiuJitsuSection";
import { IntroSection } from "@/components/IntroSection";
import VideoYoutubeHome from "@/components/Youtube/youtubeHome";
import Image from "next/image";
import Link from "next/link";

export const Principal = () => {
  return (
    <section className="w-full bg-white text-gray-800 py-12 px-6 md:px-12 lg:px-24">
      <IntroSection />

      <div className="mt-10 md:mt-20">
        <VideoYoutubeHome />
      </div>

      <div className="mt-10 md:mt-20">
        <HeadCoach />
      </div>

      <div className="mt-10 md:mt-20">
        <FeaturesSection />
      </div>

      <div className="mt-10 md:mt-20">
        <TeamPreview />
      </div>

      <div className="mt-10 md:mt-20">
        <JiuJitsuSection />
      </div>

      <div className="mt-10 md:mt-20">
        <Carrusel2 />
      </div>

      <div className="mt-10 md:mt-20">
        <GoogleReviews />
      </div>

      {/* Banner de clase muestra al final */}
      <div className="mt-10 md:mt-20 w-full py-16 px-3 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto bg-black rounded-3xl shadow-2xl overflow-hidden p-10 md:p-16">
          {/* Contenedor de la imagen */}
          <div className="relative w-full flex justify-center mb-6">
            <div className="relative w-full max-w-5xl">
              <Image
                src="https://res.cloudinary.com/dxbtafe9u/image/upload/v1767974072/IMG_9526_1_zlnl0n.jpg"
                alt="The Klan - Agenda tu clase muestra"
                width={1400}
                height={900}
                className="w-full h-auto rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                quality={90}
              />
            </div>
          </div>

          {/* Botón de acción */}
          <div className="w-full px-4 md:px-6 py-3 flex justify-center">
            <Link
              href="/costos-y-horarios"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 text-base md:text-lg shadow-md hover:shadow-lg transform hover:scale-105 text-center"
            >
              Agenda tu clase muestra
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
