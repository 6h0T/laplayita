import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://laplayita.com'),
  title: {
    default: "La Playita - Sistema de Gestión de Estacionamiento",
    template: "%s | La Playita"
  },
  description: "Sistema moderno y completo para la gestión de playas de estacionamiento. Control de vehículos, tarifas flexibles, reportes en tiempo real y más.",
  keywords: ["estacionamiento", "parking", "gestión", "vehículos", "playas", "sistema de estacionamiento", "control de vehículos", "gestión de parking", "software estacionamiento", "playa de estacionamiento"],
  authors: [{ name: "La Playita" }],
  creator: "La Playita",
  publisher: "La Playita",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://laplayita.com',
    title: 'La Playita - Sistema de Gestión de Estacionamiento',
    description: 'Sistema moderno y completo para la gestión de playas de estacionamiento. Control de vehículos, tarifas flexibles, reportes en tiempo real.',
    siteName: 'La Playita',
    images: [
      {
        url: '/metadata.jpg',
        width: 1200,
        height: 630,
        alt: 'La Playita - Sistema de Gestión de Estacionamiento',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Playita - Sistema de Gestión de Estacionamiento',
    description: 'Sistema moderno y completo para la gestión de playas de estacionamiento.',
    images: ['/metadata.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'google-site-verification-code', // Reemplazar con el código real de Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={poppins.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
