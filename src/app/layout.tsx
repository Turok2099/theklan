import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Klan - Jiu Jitsu Brasileño en CDMX | BJJ Del Valle",
  description:
    "The Klan es el mejor gimnasio de Jiu Jitsu Brasileño (BJJ) y MMA en CDMX. Ubicados en Del Valle, Benito Juárez. Clases de jiujitsu brasileño, artes marciales mixtas y más. +20 años de experiencia.",
  keywords: [
    "The Klan",
    "BJJ",
    "Jiujitsu",
    "jiujitsu brasileño",
    "jiu jitsu brasileño",
    "brazilian jiujitsu",
    "jiujitsu en CDMX",
    "jiujitsu en del Valle",
    "jiujitsu en benito juarez",
    "MMA en CDMX",
    "artes marciales CDMX",
    "brazilian jiu jitsu CDMX",
    "academia de BJJ",
    "clases de jiujitsu",
  ],
  authors: [{ name: "The Klan BJJ" }],
  creator: "The Klan",
  publisher: "The Klan",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://theklan.com",
    siteName: "The Klan BJJ",
    title: "The Klan - Jiu Jitsu Brasileño en CDMX | BJJ Del Valle",
    description:
      "El mejor lugar para entrenar Jiu Jitsu Brasileño y MMA en CDMX. Ubicados en Del Valle, Benito Juárez. +20 años de experiencia formando campeones.",
    images: [
      {
        url: "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427147/The%20Klan/the-klan-bjj-portada.png",
        width: 1200,
        height: 630,
        alt: "The Klan - Jiu Jitsu Brasileño en CDMX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Klan - Jiu Jitsu Brasileño en CDMX | BJJ Del Valle",
    description:
      "El mejor gimnasio de Jiu Jitsu Brasileño y MMA en CDMX. Del Valle, Benito Juárez. +20 años de experiencia.",
    images: [
      "https://res.cloudinary.com/dxbtafe9u/image/upload/v1759427147/The%20Klan/the-klan-bjj-portada.png",
    ],
  },
  alternates: {
    canonical: "https://theklan.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
