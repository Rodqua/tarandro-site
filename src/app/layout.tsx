import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import GoogleTagManager from "@/components/GoogleTagManager";
import AnalyticsProvider from "@/components/AnalyticsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://tarandro.org"),
  title: {
    default:
      "Tarandro - Accompagnement Qualité ISO, HAS, PSAD & Formation Professionnelle",
    template: "%s | Tarandro",
  },
  description:
    "Expert en accompagnement qualité (certifications ISO, HAS, PSAD) et formation professionnelle (bureautique, SST). Solutions sur-mesure pour optimiser votre démarche qualité et former vos équipes.",
  keywords: [
    "accompagnement qualité",
    "certification ISO",
    "certification HAS",
    "PSAD",
    "formation bureautique",
    "formation SST",
    "consultant qualité",
    "audit qualité",
    "management qualité",
    "formation professionnelle",
  ],
  authors: [{ name: "Tarandro" }],
  creator: "Tarandro",
  publisher: "Tarandro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://tarandro.org",
    siteName: "Tarandro",
    title: "Tarandro - Expert Qualité & Formation",
    description:
      "Accompagnement qualité ISO, HAS, PSAD et formation professionnelle",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tarandro - Expert Qualité & Formation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarandro - Expert Qualité & Formation",
    description:
      "Accompagnement qualité ISO, HAS, PSAD et formation professionnelle",
    images: ["/og-image.jpg"],
  },
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
  verification: {
    google: "votre-code-google-search-console",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="canonical" href="https://tarandro.org" />
      </head>
      <body className={inter.className}>
        <GoogleTagManager />
        <AnalyticsProvider>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </AuthProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
