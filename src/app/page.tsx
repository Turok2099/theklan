import { Principal } from "../views/principal";
import { Hero } from "@/components/Hero";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "The Klan BJJ",
    description:
      "Estudio privado de Jiu Jitsu Brasileño y MMA en CDMX. Más de 20 años de experiencia formando campeones.",
    image:
      "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427147/The%20Klan/the-klan-bjj-portada.png",
    "@id": "https://theklan.com",
    url: "https://theklan.com",
    telephone: "+52-55-XXXX-XXXX",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Del Valle",
      addressLocality: "Ciudad de México",
      addressRegion: "CDMX",
      postalCode: "03100",
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.381654,
      longitude: -99.163276,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "06:00",
      closes: "22:00",
    },
    sameAs: [
      "https://www.facebook.com/theklanjj",
      "https://www.instagram.com/theklanjj",
    ],
    priceRange: "$$",
    sport: "Brazilian Jiu-Jitsu",
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Brazilian Jiu-Jitsu (BJJ)",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Mixed Martial Arts (MMA)",
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Entrenamiento Funcional",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <Hero />
        <Principal />
      </div>
    </>
  );
}
