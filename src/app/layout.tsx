import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Universo dos Oráculos - Consultas de Tarot",
  description: "Descubra seu futuro através das cartas do Tarot com ciganas especializadas",
  generator: "Next.js",
  applicationName: "Universo dos Oráculos",
  keywords: ["tarot", "oráculo", "consulta", "cigana", "futuro", "cartas"],
  authors: [{ name: "Universo dos Oráculos" }],
  creator: "Universo dos Oráculos",
  publisher: "Universo dos Oráculos",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://universodosoraculos.com.br"), // Altere para seu domínio
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Universo dos Oráculos",
    title: "Universo dos Oráculos - Consultas de Tarot",
    description: "Descubra seu futuro através das cartas do Tarot",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Universo dos Oráculos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Universo dos Oráculos",
    description: "Descubra seu futuro através das cartas do Tarot",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Oráculos",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Oráculos" />
      </head>
      <body className={`${inter.className} bg-gradient-primary min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}