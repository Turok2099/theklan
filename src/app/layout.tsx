import { Geist, Geist_Mono, Lexend } from "next/font/google";
import Script from "next/script";
import { metadata } from "@/components/seoMetadata";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["monospace"],
  adjustFontFallback: true,
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${lexend.variable}`}>
      <head>
        {/* 📊 Google Tag Manager - DEBE IR PRIMERO */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-N7LP9GLV');
            `,
          }}
        />

        {/* 📊 Google Analytics 4 - The Klan BJJ (Direct Implementation) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9YRTFHP6XN"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9YRTFHP6XN', {
                page_path: window.location.pathname,
              });
              console.log('✅ GA4 Inicializado - The Klan BJJ: G-9YRTFHP6XN');
            `,
          }}
        />

        {/* DNS Prefetch para recursos externos */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.google-analytics.com"
          crossOrigin="anonymous"
        />

        {/* Manejador global para errores de extensiones del navegador */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Manejador global para errores de extensiones del navegador
              window.addEventListener('error', function(event) {
                if (event.message && event.message.includes('message channel closed')) {
                  event.preventDefault();
                  event.stopPropagation();
                  return false;
                }
              });
              
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && event.reason.message && event.reason.message.includes('message channel closed')) {
                  event.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} antialiased bg-black text-white font-display`}
      >
        {/* 📊 Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N7LP9GLV"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <GoogleAnalytics gtmId="GTM-N7LP9GLV" />
        <AuthProvider>

          <Navbar />
          {children}
          <Footer />
          <WhatsAppButton phoneNumber="525613701366" />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#000000",
                color: "#ffffff",
                border: "1px solid #dc2626",
                borderRadius: "0.5rem",
                zIndex: 9999,
              },
              success: {
                iconTheme: {
                  primary: "#dc2626",
                  secondary: "#ffffff",
                },
              },
            }}
            containerStyle={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
