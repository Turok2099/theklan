import { Geist, Geist_Mono } from "next/font/google";
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

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
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

        {/* CSS Crítico Inline para Above-the-Fold */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              *,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:currentColor}
              html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:var(--font-geist-sans),system-ui,sans-serif}
              body{margin:0;line-height:inherit;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
              h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}
              a{color:inherit;text-decoration:inherit}
              img,svg,video{display:block;max-width:100%;height:auto}
              button{background-color:transparent;background-image:none;padding:0;cursor:pointer}
              /* CSS Crítico Hero y Navbar */
              .relative{position:relative}
              .absolute{position:absolute}
              .sticky{position:sticky;top:0}
              .inset-0{top:0;right:0;bottom:0;left:0}
              .z-10{z-index:10}
              .z-20{z-index:20}
              .z-50{z-index:50}
              .bg-black{background-color:#000}
              .text-white{color:#fff}
              .text-red-600{color:#dc2626}
              .shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)}
              .w-full{width:100%}
              .h-screen{height:100vh}
              .overflow-hidden{overflow:hidden}
              .flex{display:flex}
              .items-center{align-items:center}
              .justify-between{justify-content:space-between}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
