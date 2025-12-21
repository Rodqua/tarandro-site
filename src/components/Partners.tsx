"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Partner {
  name: string;
  path: string;
}

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const response = await fetch("/api/admin/images?category=partenaire");
        const data = await response.json();
        if (data.success) {
          setPartners(data.images);
        }
        setLoading(false);
      } catch (error) {
        console.error("Erreur chargement partenaires:", error);
        setLoading(false);
      }
    };

    loadPartners();
  }, []);

  if (loading || partners.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas de partenaires
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Partenaires
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ils nous font confiance pour leur accompagnement qualité et leurs formations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-full h-24 flex items-center justify-center">
                <img
                  src={partner.path}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
