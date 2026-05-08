"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ConditionalMainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEvjf = pathname?.startsWith("/lise");

  if (isEvjf) {
    // Rendu minimaliste pour /lise : pas de Header/Footer Tarandro
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
