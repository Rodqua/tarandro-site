import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import CTA from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarandro - Accompagnement Qualité ISO, HAS, PSAD & Formation Professionnelle",
  description: "Expert en accompagnement qualité (ISO, HAS, PSAD) et formation professionnelle (bureautique, SST). Optimisez votre démarche qualité et développez les compétences de vos équipes avec un expert certifié.",
  alternates: {
    canonical: 'https://tarandro.org',
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <CTA />
    </>
  );
}
