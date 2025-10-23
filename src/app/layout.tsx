import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { metadata } from "@/components/seoMetadata";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { AuthProvider } from "@/contexts/AuthContext";
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
        {/* DNS Prefetch para recursos externos */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
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
        </AuthProvider>

        {/* 📊 Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
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
      </body>
    </html>
  );
}
