import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  metadataBase: new URL("https://seertix.com"),
  title: {
    template: "%s | Seertix",
    default: "Seertix - Plateforme Collaborative de Conseils de Vie",
  },
  description:
    "Rejoins Seertix pour partager, découvrir et recevoir des conseils précieux pour la vie quotidienne.",
  openGraph: {
    title: "Seertix - Partage de Conseils",
    description: "Échange des conseils inspirants avec la communauté Seertix.",
    url: "https://seertix.com",
    siteName: "Seertix",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seertix - Partage de Conseils",
    description: "Plateforme interactive pour des conseils précieux.",
    creator: "@seertix",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="scroll-smooth antialiased">
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-tr from-white to-indigo-50 text-gray-900`}
      >
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
