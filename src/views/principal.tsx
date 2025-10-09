import { Carrusel2 } from "@/components/Carrusel2";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TeamPreview } from "@/components/TeamPreview";
import { HeadCoach } from "@/components/HeadCoach";
import { GoogleReviews } from "@/components/GoogleReviews";
import { JiuJitsuSection } from "@/components/JiuJitsuSection";
import { IntroSection } from "@/components/IntroSection";

export const Principal = () => {
  return (
    <section className="w-full bg-white text-gray-800 py-12 px-6 md:px-12 lg:px-24">
      <IntroSection />

      <div className="mt-20">
        <HeadCoach />
      </div>

      <div className="mt-20">
        <FeaturesSection />
      </div>

      <div className="mt-20">
        <TeamPreview />
      </div>

      <div className="mt-20">
        <JiuJitsuSection />
      </div>

      <div className="mt-20">
        <Carrusel2 />
      </div>

      <div className="mt-20">
        <GoogleReviews />
      </div>
    </section>
  );
};
