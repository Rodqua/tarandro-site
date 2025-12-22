import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Partners from "@/components/Partners";
import CTA from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Tarandro - Accompagnement Qualité QUALIOPI, ISO, HAS & Formation Professionnelle",
  description:
    "Expert en accompagnement qualité (QUALIOPI,ISO, HAS) et formation professionnelle (bureautique, SST). Optimisez votre démarche qualité et développez les compétences de vos équipes avec un expert certifié.",
  alternates: {
    canonical: "https://tarandro.org",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Partners />
      <CTA />
    </>
  );
}
