import type { Metadata } from "next";
import Link from "next/link";
import {
  FaCheckCircle,
  FaArrowRight,
  FaPhone,
  FaClipboardList,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "PSAD - Programme d'Actions et Amélioration Continue de la Qualité",
  description:
    "Expert en élaboration et suivi de PSAD (Programme d'Actions). Accompagnement qualité, gestion des risques et amélioration continue pour établissements de santé et entreprises.",
  keywords: [
    "PSAD",
    "programme d'actions",
    "amélioration continue",
    "gestion des risques",
    "qualité santé",
    "plan d'amélioration",
  ],
  alternates: {
    canonical: "https://tarandro.org/services/psad",
  },
};

const psadComponents = [
  {
    title: "Identification des Risques",
    description: "Cartographie complète des risques et analyse de criticité",
    icon: "🎯",
    points: [
      "Analyse des processus critiques",
      "Évaluation de la criticité",
      "Priorisation des risques",
      "Cartographie des risques",
    ],
  },
  {
    title: "Plan d'Actions",
    description: "Élaboration d'un plan d'actions priorisé et réaliste",
    icon: "📋",
    points: [
      "Définition des actions correctives",
      "Actions préventives ciblées",
      "Planification réaliste",
      "Attribution des responsabilités",
    ],
  },
  {
    title: "Suivi & Pilotage",
    description: "Mise en place d'indicateurs et tableau de bord",
    icon: "📊",
    points: [
      "Indicateurs de performance",
      "Tableau de bord dynamique",
      "Revues périodiques",
      "Ajustements en continu",
    ],
  },
  {
    title: "Amélioration Continue",
    description: "Démarche d'amélioration continue et retour d'expérience",
    icon: "🔄",
    points: [
      "Culture d'amélioration continue",
      "Analyse des évènements indésirables",
      "Capitalisation des bonnes pratiques",
      "Veille et benchmarking",
    ],
  },
];

const psadBenefits = [
  "Réduction des risques et des évènements indésirables",
  "Amélioration de la qualité des soins ou services",
  "Conformité réglementaire assurée",
  "Engagement de toutes les équipes",
  "Culture qualité renforcée",
  "Performance organisationnelle optimisée",
  "Traçabilité et transparence des actions",
  "Préparation facilitée aux certifications",
];

const implementationSteps = [
  {
    phase: "Phase 1",
    title: "Diagnostic & Analyse",
    duration: "2-4 semaines",
    activities: [
      "Diagnostic de l'organisation",
      "Analyse des risques existants",
      "Revue documentaire",
      "Entretiens avec les équipes",
    ],
  },
  {
    phase: "Phase 2",
    title: "Élaboration du PSAD",
    duration: "2-3 semaines",
    activities: [
      "Identification des actions prioritaires",
      "Définition des objectifs SMART",
      "Planification des actions",
      "Validation avec la direction",
    ],
  },
  {
    phase: "Phase 3",
    title: "Mise en Œuvre",
    duration: "6-12 mois",
    activities: [
      "Déploiement des actions",
      "Formation des équipes",
      "Suivi régulier de l'avancement",
      "Communication interne",
    ],
  },
  {
    phase: "Phase 4",
    title: "Évaluation & Amélioration",
    duration: "Continu",
    activities: [
      "Mesure de l'efficacité",
      "Analyse des résultats",
      "Ajustements nécessaires",
      "Bilan et perspectives",
    ],
  },
];

export default function PSADPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full filter blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-scaleIn">
              <FaClipboardList className="mr-2" />
              Expert PSAD
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeInUp">
              PSAD : Pilotez Votre Amélioration Continue
            </h1>
            <p className="text-xl text-purple-100 mb-8 animate-fadeInUp animate-delay-100">
              Élaboration et suivi de votre Programme d'Actions pour
              l'amélioration continue de la qualité et la gestion des risques.
              Démarche structurée et efficace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animate-delay-200">
              <Link
                href="/contact"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-2xl font-semibold inline-flex items-center justify-center group transform hover:scale-105"
              >
                Demander un accompagnement PSAD
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <a
                href="tel:+33000000000"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-purple-600 transition-all font-semibold inline-flex items-center justify-center"
              >
                <FaPhone className="mr-2" />
                06 33 28 91 61
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What is PSAD */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Qu'est-ce qu'un PSAD ?
            </h2>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Le{" "}
                <strong>
                  Programme d'Actions pour l'Amélioration continue de la Qualité
                  (PSAD)
                </strong>{" "}
                est un outil de pilotage stratégique qui structure votre
                démarche qualité. Il permet d'identifier, prioriser et suivre
                les actions d'amélioration au sein de votre organisation.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Particulièrement adapté aux{" "}
                <strong>établissements de santé</strong> (dans le cadre de la
                certification HAS) et aux{" "}
                <strong>entreprises engagées dans une démarche qualité</strong>,
                le PSAD constitue la colonne vertébrale de votre système
                d'amélioration continue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {psadComponents.map((component, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-5xl mb-4">{component.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {component.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{component.description}</p>
                  <ul className="space-y-2">
                    {component.points.map((point, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <span className="text-purple-600 mr-2">✓</span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Les Bénéfices d'un PSAD Structuré
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {psadBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 flex items-start shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <FaCheckCircle
                    className="text-green-500 mr-4 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8 text-center">
              <p className="text-xl font-semibold">
                Un PSAD bien conçu et suivi = Une organisation performante et
                résiliente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Notre Méthodologie de Mise en Place
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {implementationSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">
                      {step.phase}
                    </span>
                    <span className="bg-white text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      {step.duration}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>

                  <ul className="space-y-2">
                    {step.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-purple-600 mr-2 mt-1">▸</span>
                        <span className="text-gray-700">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Notre Approche
            </h2>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl mr-6 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Approche Participative
                    </h3>
                    <p className="text-gray-700">
                      Nous impliquons vos équipes dès le début pour garantir
                      l'adhésion et la pertinence des actions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl mr-6 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Priorisation Intelligente
                    </h3>
                    <p className="text-gray-700">
                      Nous vous aidons à identifier les quick wins et les
                      actions à fort impact pour des résultats rapides.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl mr-6 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Outils Pragmatiques
                    </h3>
                    <p className="text-gray-700">
                      Tableaux de bord, indicateurs, outils de suivi : nous
                      fournissons des outils simples et efficaces.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl mr-6 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Accompagnement Continu
                    </h3>
                    <p className="text-gray-700">
                      Suivi régulier, points d'avancement, ajustements : nous
                      restons à vos côtés tout au long du projet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Structurez Votre Démarche d'Amélioration Continue
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Diagnostic gratuit et proposition de PSAD personnalisé sous 48h
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-110 shadow-lg hover:shadow-2xl font-semibold inline-flex items-center justify-center group"
              >
                Demander un accompagnement
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/blog"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-purple-600 transition-all font-semibold"
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
