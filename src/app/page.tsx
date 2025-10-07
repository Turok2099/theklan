import { Principal } from "../views/principal";
import { Hero } from "@/components/Hero";

export default function Home() {
  // Schema.org para LocalBusiness y SportsActivityLocation
  const jsonLdBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation", "ExerciseGym"],
    "@id": "https://theklanbjj.com.mx/#business",
    name: "The Klan BJJ",
    alternateName: "The Klan - Jiu Jitsu Brasileño",
    description:
      "Estudio privado de Jiu Jitsu Brasileño y MMA en CDMX. Más de 20 años de experiencia formando campeones.",
    image: {
      "@type": "ImageObject",
      url: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427147/The%20Klan/the-klan-bjj-portada.png",
      width: 1200,
      height: 630,
      caption: "The Klan - Jiu Jitsu Brasileño en CDMX",
    },
    url: "https://theklanbjj.com.mx",
    telephone: "+52-56-1370-1366",
    email: "contacto@theklan.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Colonia Del Valle",
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
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "06:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "14:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/theklanjj",
      "https://www.instagram.com/theklanjj",
    ],
    priceRange: "$$",
    currenciesAccepted: "MXN",
    paymentAccepted: "Efectivo, Tarjeta, Transferencia",
    hasMap: "https://maps.google.com/?q=19.381654,-99.163276",
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
      {
        "@type": "LocationFeatureSpecification",
        name: "Defensa Personal",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "50",
    },
  };

  // Schema.org para Organization
  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://theklanbjj.com.mx/#organization",
    name: "The Klan BJJ",
    url: "https://theklanbjj.com.mx",
    logo: {
      "@type": "ImageObject",
      url: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427147/The%20Klan/Logo.jpeg",
      width: 250,
      height: 250,
    },
    description:
      "Academia de Jiu Jitsu Brasileño y MMA en CDMX con más de 20 años de experiencia formando campeones.",
    foundingDate: "2000",
    founders: [
      {
        "@type": "Person",
        name: "Master Francisco Ramírez",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Colonia Del Valle",
      addressLocality: "Ciudad de México",
      addressRegion: "CDMX",
      postalCode: "03100",
      addressCountry: "MX",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+52-56-1370-1366",
      contactType: "customer service",
      availableLanguage: ["Spanish", "English"],
      areaServed: "MX",
    },
    sameAs: [
      "https://www.facebook.com/theklanjj",
      "https://www.instagram.com/theklanjj",
    ],
  };

  return (
    <>
      {/* Schema.org para LocalBusiness/SportsActivityLocation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBusiness) }}
      />
      {/* Schema.org para Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <main>
        <Hero />
        <Principal />
      </main>
    </>
  );
}
