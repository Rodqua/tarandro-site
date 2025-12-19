import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Nos Services - Accompagnement Qualité & Formation Professionnelle",
  description: "Découvrez nos services d'accompagnement qualité (ISO, HAS, PSAD) et de formation professionnelle (bureautique, SST). Solutions sur-mesure pour votre entreprise.",
  alternates: {
    canonical: 'https://tarandro.org/services',
  },
};

const servicesData = [
  {
    category: "Accompagnement Qualité",
    description: "Des solutions complètes pour votre démarche qualité et vos certifications",
    services: [
      {
        title: "Certification ISO",
        slug: "certification-iso",
        description: "ISO 9001 (qualité), ISO 14001 (environnement), ISO 45001 (santé/sécurité), ISO 27001 (sécurité de l'information)",
        features: ["Audit de préparation", "Mise en conformité", "Documentation", "Accompagnement à la certification", "Suivi post-certification"]
      },
      {
        title: "Certification HAS",
        slug: "certification-has",
        description: "Accompagnement des établissements de santé et médico-sociaux dans leur démarche de certification HAS",
        features: ["Diagnostic initial", "Plan d'actions", "Préparation à la visite", "Gestion documentaire", "Formation des équipes"]
      },
      {
        title: "PSAD",
        slug: "psad",
        description: "Élaboration et suivi du Programme d'Actions pour l'amélioration continue",
        features: ["Diagnostic qualité", "Élaboration du programme", "Gestion des risques", "Indicateurs de suivi", "Amélioration continue"]
      }
    ]
  },
  {
    category: "Formation Professionnelle",
    description: "Des formations adaptées pour développer les compétences de vos équipes",
    services: [
      {
        title: "Formation Bureautique",
        slug: "formation-bureautique",
        description: "Maîtrise des outils Microsoft Office, Google Workspace et logiciels collaboratifs",
        features: ["Word, Excel, PowerPoint", "Outlook et gestion emails", "Google Workspace", "Tous niveaux (débutant à expert)", "Inter et intra-entreprise"]
      },
      {
        title: "Formation SST",
        slug: "formation-sst",
        description: "Formation Sauveteur Secouriste du Travail certifiée INRS",
        features: ["Formation initiale (2 jours)", "Recyclage MAC SST", "Certification officielle INRS", "Pratique et mise en situation", "Formateurs certifiés"]
      }
    ]
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nos Services d'Excellence
            </h1>
            <p className="text-xl text-primary-100">
              Accompagnement qualité et formation professionnelle sur-mesure 
              pour vous aider à atteindre vos objectifs de performance et de conformité
            </p>
          </div>
        </div>
      </section>

      {/* Services Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {servicesData.map((category, idx) => (
            <div key={idx} className={idx > 0 ? "mt-24" : ""}>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {category.category}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {category.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.services.map((service, serviceIdx) => (
                  <div
                    key={serviceIdx}
                    className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start text-sm text-gray-700">
                          <span className="text-primary-600 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 group"
                    >
                      En savoir plus
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Besoin d'un accompagnement personnalisé ?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour discuter de votre projet et obtenir un devis gratuit
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all shadow-lg font-semibold group"
          >
            Demander un devis gratuit
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
