import type { Metadata } from "next";
import Link from "next/link";
import {
  FaCheckCircle,
  FaArrowRight,
  FaPhone,
  FaLaptop,
  FaCertificate,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Formation Bureautique - Excel, Word, PowerPoint, Outlook | Tarandro",
  description:
    "Formation bureautique professionnelle : Microsoft Office (Excel, Word, PowerPoint, Outlook), Google Workspace. Tous niveaux. Inter et intra-entreprise. Formateurs certifiés.",
  keywords: [
    "formation bureautique",
    "formation Excel",
    "formation Word",
    "formation PowerPoint",
    "formation Outlook",
    "Microsoft Office",
    "Google Workspace",
  ],
  alternates: {
    canonical: "https://tarandro.org/services/formation-bureautique",
  },
};

const formations = [
  {
    name: "Microsoft Excel",
    levels: ["Débutant", "Intermédiaire", "Avancé", "Expert"],
    icon: "📊",
    color: "green",
    topics: [
      "Formules et fonctions",
      "Tableaux croisés dynamiques",
      "Graphiques et visualisations",
      "Macros et VBA",
      "Power Query et Power Pivot",
    ],
  },
  {
    name: "Microsoft Word",
    levels: ["Débutant", "Intermédiaire", "Avancé"],
    icon: "📝",
    color: "blue",
    topics: [
      "Mise en forme professionnelle",
      "Styles et modèles",
      "Table des matières",
      "Publipostage",
      "Documents longs",
    ],
  },
  {
    name: "Microsoft PowerPoint",
    levels: ["Débutant", "Intermédiaire", "Avancé"],
    icon: "📽️",
    color: "orange",
    topics: [
      "Design de présentations",
      "Animations et transitions",
      "Masques de diapositives",
      "Présentations interactives",
      "Storytelling visuel",
    ],
  },
  {
    name: "Microsoft Outlook",
    levels: ["Débutant", "Intermédiaire"],
    icon: "📧",
    color: "purple",
    topics: [
      "Gestion des emails",
      "Calendrier et rendez-vous",
      "Contacts et distribution",
      "Tâches et organisation",
      "Règles et automatisation",
    ],
  },
  {
    name: "Google Workspace",
    levels: ["Tous niveaux"],
    icon: "☁️",
    color: "red",
    topics: [
      "Gmail professionnel",
      "Google Sheets",
      "Google Docs",
      "Google Slides",
      "Collaboration en temps réel",
    ],
  },
  {
    name: "Teams & Collaboration",
    levels: ["Tous niveaux"],
    icon: "👥",
    color: "indigo",
    topics: [
      "Microsoft Teams",
      "SharePoint",
      "OneDrive",
      "Travail collaboratif",
      "Bonnes pratiques",
    ],
  },
];

const trainingFormats = [
  {
    title: "Formation Intra-entreprise",
    description: "Formation sur-mesure dans vos locaux",
    features: [
      "Programme adapté à vos besoins",
      "Dans vos locaux ou à distance",
      "Groupes de 4 à 12 personnes",
      "Dates et horaires flexibles",
      "Support de cours personnalisé",
    ],
    icon: "🏢",
  },
  {
    title: "Formation Inter-entreprises",
    description: "Sessions planifiées avec d'autres entreprises",
    features: [
      "Calendrier de sessions régulières",
      "Partage d'expériences",
      "Groupes restreints (max 8)",
      "Tarif attractif",
      "Certification incluse",
    ],
    icon: "🎓",
  },
  {
    title: "Formation à Distance",
    description: "Formation en visioconférence interactive",
    features: [
      "Depuis votre poste de travail",
      "Interaction en temps réel",
      "Enregistrement des sessions",
      "Suivi post-formation",
      "Flexibilité maximale",
    ],
    icon: "💻",
  },
  {
    title: "Coaching Individuel",
    description: "Accompagnement personnalisé one-to-one",
    features: [
      "100% sur-mesure",
      "Rythme adapté",
      "Focus sur vos problématiques",
      "Résultats rapides",
      "Suivi individualisé",
    ],
    icon: "🎯",
  },
];

const advantages = [
  "Formateurs certifiés Microsoft Office Specialist",
  "Méthode pédagogique active (70% pratique)",
  "Supports de cours détaillés remis",
  "Exercices basés sur vos cas réels",
  "Attestation de formation délivrée",
  "Éligible au financement CPF",
  "Passage de la certification TOSA possible",
  "Suivi post-formation (email, téléphone)",
];

export default function FormationBureautiquePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-teal-600 to-cyan-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-scaleIn">
              <FaLaptop className="mr-2" />
              <FaCertificate className="mr-2" />
              Formateurs Certifiés
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeInUp">
              Formation Bureautique Professionnelle
            </h1>
            <p className="text-xl text-green-100 mb-8 animate-fadeInUp animate-delay-100">
              Maîtrisez Excel, Word, PowerPoint, Outlook et Google Workspace.
              Formations tous niveaux, inter ou intra-entreprise, avec
              formateurs certifiés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animate-delay-200">
              <Link
                href="/contact"
                className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-2xl font-semibold inline-flex items-center justify-center group transform hover:scale-105"
              >
                Demander un devis formation
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <a
                href="tel:+33000000000"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-green-600 transition-all font-semibold inline-flex items-center justify-center"
              >
                <FaPhone className="mr-2" />
                06 33 28 91 61
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Formations Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Catalogue de Formations
            </h2>
            <p className="text-lg text-gray-600">
              Des formations adaptées à tous les niveaux, du débutant à l'expert
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {formations.map((formation, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-green-500 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{formation.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {formation.name}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {formation.levels.map((level, idx) => (
                    <span
                      key={idx}
                      className={`bg-${formation.color}-100 text-${formation.color}-700 px-2 py-1 rounded text-xs font-medium`}
                    >
                      {level}
                    </span>
                  ))}
                </div>

                <ul className="space-y-2">
                  {formation.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Formats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Formats de Formation
            </h2>
            <p className="text-lg text-gray-600">
              Choisissez la formule qui correspond le mieux à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {trainingFormats.map((format, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{format.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {format.title}
                </h3>
                <p className="text-gray-600 mb-6">{format.description}</p>

                <ul className="space-y-3">
                  {format.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Pourquoi choisir nos formations ?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {advantages.map((advantage, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6 flex items-start hover:shadow-lg transition-shadow"
                >
                  <FaCheckCircle
                    className="text-green-600 mr-4 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <span className="text-gray-700 font-medium">{advantage}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Financement Formation</h3>
              <p className="text-lg text-green-100 mb-6">
                Nos formations sont éligibles aux financements OPCO, CPF et Plan
                de Développement des Compétences
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-white/20 px-4 py-2 rounded-full">OPCO</span>
                <span className="bg-white/20 px-4 py-2 rounded-full">CPF</span>
                <span className="bg-white/20 px-4 py-2 rounded-full">
                  FNE Formation
                </span>
                <span className="bg-white/20 px-4 py-2 rounded-full">
                  Plan de formation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <FaCertificate className="text-green-600 text-6xl mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Certification TOSA
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Validez vos compétences avec la certification TOSA, reconnue par
                les entreprises et inscrite au Répertoire Spécifique de France
                Compétences.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    Excel
                  </div>
                  <div className="text-sm text-gray-600">Certification</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    Word
                  </div>
                  <div className="text-sm text-gray-600">Certification</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    PowerPoint
                  </div>
                  <div className="text-sm text-gray-600">Certification</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    Outlook
                  </div>
                  <div className="text-sm text-gray-600">Certification</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-700 text-white relative overflow-hidden">
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
              Boostez les Compétences de Vos Équipes
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Programme de formation sur-mesure et devis gratuit sous 48h
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-110 shadow-lg hover:shadow-2xl font-semibold inline-flex items-center justify-center group"
              >
                Demander un devis
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <a
                href="tel:+33000000000"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-green-600 transition-all font-semibold inline-flex items-center justify-center"
              >
                <FaPhone className="mr-2" />
                Appelez-nous
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
