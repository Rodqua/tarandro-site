import type { Metadata } from "next";
import { FaAward, FaUsers, FaCheckCircle, FaChartLine } from "react-icons/fa";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À Propos - Expert Qualité et Formation depuis 10 ans",
  description: "Découvrez Tarandro, expert en accompagnement qualité (ISO, HAS, PSAD) et formation professionnelle. 10 ans d'expérience, 100+ clients accompagnés, solutions sur-mesure.",
  alternates: {
    canonical: 'https://tarandro.org/a-propos',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              À propos de Tarandro
            </h1>
            <p className="text-xl text-primary-100">
              Votre partenaire de confiance pour l'excellence qualité et le développement des compétences
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Accompagner les entreprises et établissements dans leur démarche qualité et 
                le développement des compétences de leurs collaborateurs. Nous croyons que 
                l'excellence opérationnelle et la montée en compétences sont les clés de la 
                performance durable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-primary-50 rounded-xl p-8">
                <FaAward className="text-primary-600 text-4xl mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Expertise Reconnue</h3>
                <p className="text-gray-600">
                  Plus de 10 ans d'expérience dans l'accompagnement qualité et la formation professionnelle. 
                  Consultants et formateurs certifiés.
                </p>
              </div>

              <div className="bg-secondary-50 rounded-xl p-8">
                <FaUsers className="text-secondary-600 text-4xl mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Approche Humaine</h3>
                <p className="text-gray-600">
                  Nous plaçons l'humain au cœur de notre démarche. Écoute, pédagogie et 
                  accompagnement personnalisé pour chaque client.
                </p>
              </div>

              <div className="bg-primary-50 rounded-xl p-8">
                <FaCheckCircle className="text-primary-600 text-4xl mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Résultats Garantis</h3>
                <p className="text-gray-600">
                  95% de taux de réussite aux certifications. Nos clients nous recommandent 
                  pour notre efficacité et notre professionnalisme.
                </p>
              </div>

              <div className="bg-secondary-50 rounded-xl p-8">
                <FaChartLine className="text-secondary-600 text-4xl mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Amélioration Continue</h3>
                <p className="text-gray-600">
                  Nous appliquons nous-mêmes les principes que nous enseignons : veille 
                  réglementaire, innovation et perfectionnement constant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Nos Valeurs
            </h2>

            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-2xl font-bold text-primary-600 mb-3">Excellence</h3>
                <p className="text-gray-600">
                  Nous visons la perfection dans chaque mission, avec une exigence de qualité 
                  qui reflète nos standards professionnels. Nos méthodes éprouvées garantissent 
                  des résultats durables.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-2xl font-bold text-primary-600 mb-3">Pragmatisme</h3>
                <p className="text-gray-600">
                  Nos solutions sont concrètes, applicables et adaptées à votre réalité opérationnelle. 
                  Pas de théorie inutile, seulement des outils efficaces et des méthodes qui fonctionnent.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-2xl font-bold text-primary-600 mb-3">Bienveillance</h3>
                <p className="text-gray-600">
                  L'accompagnement au changement nécessite écoute, pédagogie et patience. 
                  Nous construisons avec vous une relation de confiance basée sur le respect mutuel.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8">
                <h3 className="text-2xl font-bold text-primary-600 mb-3">Engagement</h3>
                <p className="text-gray-600">
                  Votre réussite est notre priorité. Nous nous impliquons pleinement dans chaque projet 
                  et restons à vos côtés jusqu'à l'atteinte de vos objectifs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold text-center mb-12">Tarandro en chiffres</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
                <div className="text-primary-100">Années d'expérience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
                <div className="text-primary-100">Clients accompagnés</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
                <div className="text-primary-100">Taux de réussite</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-primary-100">Stagiaires formés</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discutons de vos besoins et construisons ensemble votre stratégie qualité
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all shadow-lg font-semibold"
          >
            Contactez-nous
          </Link>
        </div>
      </section>
    </div>
  );
}
