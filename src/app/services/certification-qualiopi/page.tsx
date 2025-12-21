import type { Metadata } from "next";
import Link from "next/link";
import { FaCheckCircle, FaArrowRight, FaPhone } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Certification Qualiopi - Accompagnement Organisme de Formation",
  description:
    "Expert en certification Qualiopi pour organismes de formation. Accompagnement complet pour obtenir et maintenir votre certification qualité. Taux de réussite 95%.",
  keywords: [
    "certification Qualiopi",
    "Qualiopi",
    "organisme de formation",
    "RNQ",
    "qualité formation",
    "consultant Qualiopi",
    "audit Qualiopi",
  ],
  alternates: {
    canonical: "https://tarandro.org/services/certification-qualiopi",
  },
};

const qualiopiCriteria = [
  {
    number: "1",
    title: "Information du Public",
    description:
      "Conditions d'information du public sur les prestations proposées, les délais d'accès et les résultats obtenus",
    points: [
      "Communication claire et accessible",
      "Transparence sur les résultats",
      "Informations contractuelles complètes",
    ],
  },
  {
    number: "2",
    title: "Analyse des Besoins",
    description:
      "Identification précise des objectifs de la prestation et adaptation aux publics bénéficiaires",
    points: [
      "Positionnement des apprenants",
      "Adaptation des parcours",
      "Personnalisation de l'accompagnement",
    ],
  },
  {
    number: "3",
    title: "Accompagnement",
    description:
      "Accompagnement des bénéficiaires dans leur parcours et adaptation aux évolutions",
    points: [
      "Suivi individualisé",
      "Moyens pédagogiques adaptés",
      "Coordination avec l'environnement professionnel",
    ],
  },
  {
    number: "4",
    title: "Moyens Pédagogiques",
    description:
      "Adéquation des moyens pédagogiques, techniques et d'encadrement aux prestations mises en œuvre",
    points: [
      "Qualification des formateurs",
      "Ressources pédagogiques actualisées",
      "Environnement technique approprié",
    ],
  },
  {
    number: "5",
    title: "Qualification des Formateurs",
    description:
      "Qualification et développement des connaissances et compétences des personnels chargés de formations",
    points: [
      "Parcours et compétences vérifiés",
      "Formation continue des formateurs",
      "Veille sur l'évolution des métiers",
    ],
  },
  {
    number: "6",
    title: "Insertion Professionnelle",
    description:
      "Inscription et investissement du prestataire dans son environnement professionnel",
    points: [
      "Veille sur l'évolution des métiers",
      "Relations avec les entreprises",
      "Partenariats et réseaux professionnels",
    ],
  },
  {
    number: "7",
    title: "Évaluation et Amélioration",
    description:
      "Recueil et prise en compte des appréciations et réclamations pour l'amélioration continue",
    points: [
      "Évaluation de la satisfaction",
      "Traitement des réclamations",
      "Actions d'amélioration documentées",
    ],
  },
];

const processSteps = [
  {
    number: "01",
    title: "Diagnostic Qualiopi",
    description:
      "Audit initial de votre organisme et analyse des écarts par rapport aux 7 critères et 32 indicateurs Qualiopi",
  },
  {
    number: "02",
    title: "Plan d'Actions",
    description:
      "Élaboration d'un plan d'actions détaillé et priorisé pour la mise en conformité avec le référentiel national qualité",
  },
  {
    number: "03",
    title: "Mise en Conformité",
    description:
      "Accompagnement dans l'adaptation de vos processus, la mise en place des procédures et la constitution des preuves",
  },
  {
    number: "04",
    title: "Documentation",
    description:
      "Création ou mise à jour de votre système documentaire : processus, procédures, indicateurs et tableaux de suivi",
  },
  {
    number: "05",
    title: "Formation Équipe",
    description:
      "Formation de vos équipes aux exigences Qualiopi et aux bonnes pratiques de gestion de la qualité",
  },
  {
    number: "06",
    title: "Audit à Blanc",
    description:
      "Simulation d'audit de certification pour identifier les derniers points d'amélioration avant l'audit officiel",
  },
  {
    number: "07",
    title: "Préparation Audit",
    description:
      "Préparation finale avec constitution du dossier, briefing des équipes et accompagnement pendant l'audit",
  },
  {
    number: "08",
    title: "Suivi Post-Certification",
    description:
      "Accompagnement au maintien de la certification avec audits de surveillance et amélioration continue",
  },
];

const benefits = [
  {
    title: "Financement Public",
    description:
      "Accédez aux financements publics et mutualisés (CPF, OPCO, Pôle Emploi, Régions)",
    icon: "💰",
  },
  {
    title: "Crédibilité Renforcée",
    description:
      "Gagnez en visibilité et en confiance auprès de vos clients et partenaires",
    icon: "⭐",
  },
  {
    title: "Qualité Garantie",
    description:
      "Démontrez votre engagement qualité et l'amélioration continue de vos prestations",
    icon: "✅",
  },
  {
    title: "Développement Commercial",
    description:
      "Élargissez votre offre et accédez à de nouveaux marchés B2B et B2C",
    icon: "📈",
  },
];

const faq = [
  {
    question: "Qui est concerné par la certification Qualiopi ?",
    answer:
      "Tous les organismes réalisant des actions concourant au développement des compétences (formation professionnelle, apprentissage, VAE, bilan de compétences) et souhaitant bénéficier de fonds publics ou mutualisés.",
  },
  {
    question: "Combien de temps dure la démarche de certification ?",
    answer:
      "La durée varie selon votre niveau de maturité initial, généralement entre 3 et 6 mois de préparation avant l'audit de certification. La certification Qualiopi est valable 3 ans.",
  },
  {
    question: "Quel est le coût de la certification Qualiopi ?",
    answer:
      "Le coût se compose de nos honoraires d'accompagnement et des frais d'audit par l'organisme certificateur. Nous établissons un devis personnalisé selon votre structure et vos besoins.",
  },
  {
    question: "Puis-je obtenir des aides financières ?",
    answer:
      "Oui, des financements sont possibles via votre OPCO, France Travail ou certaines régions. Nous vous accompagnons dans la constitution des dossiers de financement.",
  },
];

export default function CertificationQualiopi() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
        {/* Image d'illustration */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src="https://8vsrlofryyepkmou.public.blob.vercel-storage.com/images/service/1766339707740-image1.png"
            alt="Certification Qualiopi"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-800"></div>
        </div>
        
        <div className="relative -mt-32 py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold mb-6">
              Certification Qualité Formation
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Certification Qualiopi
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Obtenez et maintenez votre certification qualité pour accéder aux
              financements publics
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center group"
              >
                Demander un accompagnement
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+33633289161"
                className="bg-primary-700/50 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-all border-2 border-white/20 inline-flex items-center"
              >
                <FaPhone className="mr-2" />
                06 33 28 91 61
              </a>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              La certification Qualiopi, un gage de qualité reconnu
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                Depuis le 1er janvier 2022, la <strong>certification Qualiopi</strong> est
                obligatoire pour tous les organismes de formation souhaitant
                accéder aux fonds publics et mutualisés. Cette certification
                atteste de la qualité du processus mis en œuvre et constitue un
                véritable atout commercial.
              </p>
              <p>
                Notre accompagnement personnalisé vous permet d'obtenir votre
                certification Qualiopi en toute sérénité, en respectant les{" "}
                <strong>7 critères et 32 indicateurs</strong> du référentiel
                national qualité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Les 7 Critères Qualiopi */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Les 7 Critères du Référentiel Qualiopi
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {qualiopiCriteria.map((criterion, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                      {criterion.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {criterion.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{criterion.description}</p>
                      <ul className="space-y-1">
                        {criterion.points.map((point, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Les Avantages de la Certification Qualiopi
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Processus d'Accompagnement */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Notre Accompagnement Étape par Étape
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Un accompagnement structuré et personnalisé pour maximiser vos
              chances d'obtenir la certification du premier coup
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Questions Fréquentes
            </h2>
            <div className="space-y-6">
              {faq.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {item.question}
                  </h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à Obtenir Votre Certification Qualiopi ?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Bénéficiez d'un diagnostic gratuit et d'un devis personnalisé pour
              votre projet de certification
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center group"
              >
                Demander un diagnostic gratuit
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="tel:+33633289161"
                className="bg-primary-700/50 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-all border-2 border-white/20 inline-flex items-center"
              >
                <FaPhone className="mr-2" />
                06 33 28 91 61
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
