import type { Metadata } from "next";
import Link from "next/link";
import { FaCheckCircle, FaArrowRight, FaPhone } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Certification ISO 9001, 14001, 45001, 27001 - Accompagnement Expert",
  description: "Expert en certification ISO pour votre entreprise. Accompagnement complet de l'audit initial à la certification : ISO 9001, 14001, 45001, 27001. Taux de réussite 95%.",
  keywords: ["certification ISO", "ISO 9001", "ISO 14001", "ISO 45001", "ISO 27001", "consultant ISO", "audit qualité"],
  alternates: {
    canonical: 'https://tarandro.org/services/certification-iso',
  },
};

const isoNorms = [
  {
    name: "ISO 9001",
    subtitle: "Management de la Qualité",
    description: "La norme de référence pour améliorer la satisfaction client et optimiser vos processus",
    benefits: [
      "Amélioration de la satisfaction client",
      "Optimisation des processus internes",
      "Réduction des coûts et des non-conformités",
      "Avantage concurrentiel sur le marché",
      "Accès facilité aux appels d'offres"
    ]
  },
  {
    name: "ISO 14001",
    subtitle: "Management Environnemental",
    description: "Démontrez votre engagement environnemental et réduisez votre impact écologique",
    benefits: [
      "Réduction de l'impact environnemental",
      "Conformité réglementaire assurée",
      "Économies d'énergie et de ressources",
      "Image de marque responsable",
      "Anticipation des évolutions réglementaires"
    ]
  },
  {
    name: "ISO 45001",
    subtitle: "Santé et Sécurité au Travail",
    description: "Protégez vos collaborateurs et créez un environnement de travail sûr",
    benefits: [
      "Réduction des accidents du travail",
      "Amélioration du bien-être des salariés",
      "Diminution de l'absentéisme",
      "Conformité légale garantie",
      "Responsabilité sociale de l'entreprise"
    ]
  },
  {
    name: "ISO 27001",
    subtitle: "Sécurité de l'Information",
    description: "Sécurisez vos données et protégez votre système d'information",
    benefits: [
      "Protection des données sensibles",
      "Conformité RGPD facilitée",
      "Prévention des cyberattaques",
      "Confiance des clients renforcée",
      "Continuité d'activité assurée"
    ]
  }
];

const processSteps = [
  {
    number: "01",
    title: "Diagnostic Initial",
    description: "Audit de votre organisation et analyse des écarts par rapport aux exigences de la norme"
  },
  {
    number: "02",
    title: "Plan d'Actions",
    description: "Définition d'un plan d'actions personnalisé avec planification et allocation des ressources"
  },
  {
    number: "03",
    title: "Mise en Conformité",
    description: "Accompagnement dans l'adaptation de vos processus et la mise en place du système de management"
  },
  {
    number: "04",
    title: "Documentation",
    description: "Création et structuration de votre documentation qualité (manuel, procédures, instructions)"
  },
  {
    number: "05",
    title: "Formation",
    description: "Formation de vos équipes aux exigences de la norme et aux nouveaux processus"
  },
  {
    number: "06",
    title: "Audit Blanc",
    description: "Simulation de l'audit de certification pour identifier les derniers points d'amélioration"
  },
  {
    number: "07",
    title: "Certification",
    description: "Accompagnement lors de l'audit de certification par l'organisme accrédité"
  },
  {
    number: "08",
    title: "Suivi",
    description: "Accompagnement post-certification pour le maintien et l'amélioration continue"
  }
];

export default function CertificationISOPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-300 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-scaleIn">
              ⭐ Taux de réussite 95%
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeInUp">
              Certification ISO : Votre Passeport pour l'Excellence
            </h1>
            <p className="text-xl text-primary-100 mb-8 animate-fadeInUp animate-delay-100">
              Accompagnement expert pour vos certifications ISO 9001, 14001, 45001, 27001. 
              De l'audit à la certification, nous garantissons votre réussite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animate-delay-200">
              <Link
                href="/contact"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-2xl font-semibold inline-flex items-center justify-center group transform hover:scale-105"
              >
                Demander un diagnostic gratuit
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <a
                href="tel:+33000000000"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-primary-600 transition-all font-semibold inline-flex items-center justify-center"
              >
                <FaPhone className="mr-2" />
                01 XX XX XX XX
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ISO Norms Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Les Normes ISO que nous Accompagnons
            </h2>
            <p className="text-lg text-gray-600">
              Expertise reconnue sur les principales normes ISO de management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isoNorms.map((norm, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-primary-500 hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="flex items-start mb-4">
                  <div className="bg-primary-100 text-primary-600 px-4 py-2 rounded-lg font-bold text-lg group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    {norm.name}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{norm.subtitle}</h3>
                <p className="text-gray-600 mb-6">{norm.description}</p>
                
                <div className="space-y-2">
                  {norm.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start">
                      <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Méthodologie Éprouvée
            </h2>
            <p className="text-lg text-gray-600">
              Un accompagnement structuré en 8 étapes pour garantir votre succès
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-5xl font-bold text-primary-100 mb-4">{step.number}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Pourquoi choisir Tarandro ?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                <div className="text-gray-600">Taux de réussite à la certification</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">10+</div>
                <div className="text-gray-600">Années d'expérience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
                <div className="text-gray-600">Entreprises certifiées</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Notre engagement</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-primary-600 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700"><strong>Accompagnement sur-mesure :</strong> Chaque entreprise est unique, notre approche aussi</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-primary-600 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700"><strong>Experts certifiés :</strong> Consultants qualifiés avec une solide expérience terrain</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-primary-600 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700"><strong>Approche pragmatique :</strong> Solutions opérationnelles adaptées à votre réalité</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-primary-600 mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700"><strong>Suivi post-certification :</strong> Nous restons à vos côtés après l'obtention du certificat</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à obtenir votre certification ISO ?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Diagnostic gratuit de votre organisation et devis personnalisé sous 48h
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-110 shadow-lg hover:shadow-2xl font-semibold inline-flex items-center justify-center group"
              >
                Demander un diagnostic gratuit
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/blog"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-primary-600 transition-all font-semibold"
              >
                En savoir plus sur le blog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
