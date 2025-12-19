import type { Metadata } from "next";
import Link from "next/link";
import { FaCheckCircle, FaArrowRight, FaPhone, FaHospital } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Certification HAS - Accompagnement Établissements de Santé et Médico-sociaux",
  description: "Expert certification HAS pour établissements de santé et médico-sociaux. Préparation complète à la visite de certification. Méthodologie éprouvée, taux de réussite élevé.",
  keywords: ["certification HAS", "Haute Autorité de Santé", "établissement de santé", "médico-social", "qualité santé", "visite de certification HAS"],
  alternates: {
    canonical: 'https://tarandro.org/services/certification-has',
  },
};

const hasFeatures = [
  {
    title: "Préparation Visite de Certification",
    description: "Accompagnement complet pour préparer sereinement la visite des experts-visiteurs HAS",
    icon: "🎯"
  },
  {
    title: "Gestion Documentaire",
    description: "Organisation et structuration de votre documentation qualité et gestion des risques",
    icon: "📋"
  },
  {
    title: "Formation des Équipes",
    description: "Formation de vos professionnels aux exigences HAS et aux bonnes pratiques",
    icon: "👥"
  },
  {
    title: "Accompagnement Continu",
    description: "Suivi régulier de votre démarche qualité entre les évaluations",
    icon: "🔄"
  }
];

const hasChapters = [
  "Droits des patients",
  "Parcours du patient",
  "Dossier patient",
  "Management de la qualité et de la sécurité des soins",
  "Gestion des risques",
  "Système d'information",
  "Ressources humaines",
  "Gestion des fonctions logistiques"
];

const processSteps = [
  {
    step: "1",
    title: "Diagnostic Initial",
    description: "Évaluation de votre niveau de conformité par rapport au référentiel HAS",
    duration: "2-3 jours"
  },
  {
    step: "2",
    title: "Plan d'Actions Priorisé",
    description: "Identification des axes d'amélioration prioritaires et planification",
    duration: "1 semaine"
  },
  {
    step: "3",
    title: "Mise en Conformité",
    description: "Accompagnement dans la mise en place des actions correctives et préventives",
    duration: "6-12 mois"
  },
  {
    step: "4",
    title: "Organisation Documentaire",
    description: "Structuration et mise à jour de votre documentation qualité",
    duration: "Continu"
  },
  {
    step: "5",
    title: "Formation des Professionnels",
    description: "Sensibilisation et formation de vos équipes aux exigences HAS",
    duration: "2-4 mois"
  },
  {
    step: "6",
    title: "Visite Blanc",
    description: "Simulation de la visite de certification pour identifier les derniers ajustements",
    duration: "2-3 jours"
  },
  {
    step: "7",
    title: "Préparation à la Visite",
    description: "Préparation logistique et psychologique de l'établissement",
    duration: "1 mois"
  },
  {
    step: "8",
    title: "Accompagnement Visite",
    description: "Présence et support pendant la visite des experts-visiteurs",
    duration: "3-4 jours"
  }
];

export default function CertificationHASPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-scaleIn">
              <FaHospital className="mr-2" />
              Expert Certification HAS
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeInUp">
              Certification HAS : Préparez Votre Visite avec Succès
            </h1>
            <p className="text-xl text-blue-100 mb-8 animate-fadeInUp animate-delay-100">
              Accompagnement expert des établissements de santé et médico-sociaux dans leur démarche de certification HAS. 
              Méthodologie éprouvée pour une préparation sereine et efficace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animate-delay-200">
              <Link
                href="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-2xl font-semibold inline-flex items-center justify-center group transform hover:scale-105"
              >
                Demander un diagnostic HAS
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <a
                href="tel:+33000000000"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all font-semibold inline-flex items-center justify-center"
              >
                <FaPhone className="mr-2" />
                01 XX XX XX XX
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Accompagnement Certification HAS
            </h2>
            <p className="text-lg text-gray-600">
              Une expertise reconnue au service de la qualité et de la sécurité des soins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hasFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HAS Chapters */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Les Chapitres du Référentiel HAS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasChapters.map((chapter, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 flex items-start shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{chapter}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                <strong>Notre expertise couvre l'ensemble du référentiel HAS</strong>, que vous soyez un établissement 
                de santé (MCO, SSR, PSY, HAD), un établissement médico-social (EHPAD, handicap), ou une structure ambulatoire. 
                Nous adaptons notre accompagnement à votre spécificité et à vos enjeux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Méthodologie en 8 Étapes
            </h2>
            <p className="text-lg text-gray-600">
              Un accompagnement structuré pour préparer sereinement votre visite de certification
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex items-start"
                >
                  <div className="bg-blue-600 text-white w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl mr-6 flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Pourquoi nous choisir ?
            </h2>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
                  <div className="text-gray-600">Années d'expérience HAS</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-600">Établissements accompagnés</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                  <div className="text-gray-600">Satisfaction client</div>
                </div>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700"><strong>Connaissance approfondie du référentiel HAS</strong> et de ses évolutions</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700"><strong>Expérience terrain</strong> dans tous types d'établissements de santé</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700"><strong>Méthode pragmatique</strong> adaptée à vos contraintes opérationnelles</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700"><strong>Disponibilité et réactivité</strong> tout au long de l'accompagnement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Préparez votre certification HAS en toute sérénité
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Diagnostic gratuit et devis personnalisé sous 48h
            </p>
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-110 shadow-lg hover:shadow-2xl font-semibold inline-flex items-center group"
            >
              Contactez-nous
              <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
