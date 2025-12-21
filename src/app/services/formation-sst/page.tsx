import type { Metadata } from "next";
import Link from "next/link";
import {
  FaCheckCircle,
  FaArrowRight,
  FaPhone,
  FaFirstAid,
  FaCertificate,
  FaUsers,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Formation SST - Sauveteur Secouriste du Travail Certifié INRS",
  description:
    "Formation SST certifiée INRS : initial, recyclage MAC SST. Formateurs certifiés, sessions inter/intra-entreprise. Sauvez des vies, respectez vos obligations légales.",
  keywords: [
    "formation SST",
    "sauveteur secouriste du travail",
    "INRS",
    "MAC SST",
    "recyclage SST",
    "formation secourisme",
    "premiers secours entreprise",
  ],
  alternates: {
    canonical: "https://tarandro.org/services/formation-sst",
  },
};

const sstBenefits = [
  {
    title: "Conformité Légale",
    description:
      "Respectez vos obligations en matière de secourisme en entreprise",
    icon: "⚖️",
  },
  {
    title: "Sécurité des Salariés",
    description: "Protégez vos collaborateurs en cas d'accident ou de malaise",
    icon: "🛡️",
  },
  {
    title: "Réduction des Risques",
    description:
      "Développez une culture de prévention des risques professionnels",
    icon: "📉",
  },
  {
    title: "Image de l'Entreprise",
    description:
      "Démontrez votre engagement pour la santé et la sécurité au travail",
    icon: "⭐",
  },
];

const sstProgram = {
  initial: {
    title: "Formation SST Initiale",
    duration: "2 jours (14 heures)",
    description:
      "Formation complète pour devenir Sauveteur Secouriste du Travail",
    objectives: [
      "Protéger la victime et les témoins",
      "Examiner la victime",
      "Faire alerter ou alerter les secours",
      "Secourir la victime jusqu'à l'arrivée des secours",
    ],
    content: [
      "Le cadre juridique du SST",
      "Rechercher les risques persistants",
      "Protéger la zone de danger",
      "Examiner la victime (conscience, respiration, saignement)",
      "Alerter ou faire alerter les secours",
      "Gestes de secours : hémorragie, étouffement, malaise",
      "Perte de connaissance, arrêt cardiaque (RCP + DAE)",
      "Traumatismes (plaies, brûlures, fractures)",
      "Situations inhérentes aux risques spécifiques de l'entreprise",
    ],
  },
  mac: {
    title: "Recyclage MAC SST",
    duration: "1 jour (7 heures)",
    description: "Maintien et Actualisation des Compétences tous les 2 ans",
    objectives: [
      "Réviser les gestes de secours",
      "Actualiser ses connaissances",
      "Maintenir sa certification SST",
    ],
    content: [
      "Révision des techniques d'intervention",
      "Actualisation des compétences",
      "Retour d'expérience et cas vécus",
      "Mise à jour des procédures",
      "Mise en situation pratique",
      "Évaluation certificative",
    ],
  },
};

const practicalInfo = [
  {
    title: "Public Concerné",
    items: [
      "Tout salarié souhaitant devenir SST",
      "Aucun prérequis nécessaire",
      "Effectif : 4 à 10 participants",
    ],
  },
  {
    title: "Méthode Pédagogique",
    items: [
      "Formation pratique et interactive",
      "Mises en situation réelles",
      "Utilisation de mannequins et défibrillateur",
      "Études de cas concrets",
    ],
  },
  {
    title: "Validation",
    items: [
      "Évaluation continue",
      "Épreuves certificatives",
      "Certificat SST INRS valable 2 ans",
      "Carte de SST remise",
    ],
  },
  {
    title: "Obligations Légales",
    items: [
      "Code du Travail (Art. R4224-15)",
      "Au moins 1 SST dans chaque atelier",
      "1 SST pour 20 salariés minimum",
      "Recyclage obligatoire tous les 2 ans",
    ],
  },
];

const formationFormats = [
  {
    type: "Intra-entreprise",
    description: "Formation dans vos locaux, adaptée à vos risques spécifiques",
    features: [
      "Groupe de 4 à 10 personnes",
      "Dans vos locaux",
      "Dates à votre convenance",
      "Contenu adapté à vos risques",
      "Matériel pédagogique fourni",
    ],
    recommended: true,
  },
  {
    type: "Inter-entreprises",
    description: "Sessions planifiées avec d'autres entreprises",
    features: [
      "Sessions programmées",
      "Groupes restreints",
      "Centre de formation équipé",
      "Partage d'expériences",
      "Tarif attractif",
    ],
    recommended: false,
  },
];

export default function FormationSSTPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white overflow-hidden">
        {/* Image d'illustration */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src="https://8vsrlofryyepkmou.public.blob.vercel-storage.com/images/service/pexels-shox-28271058b.png"
            alt="Formation SST"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-700"></div>
        </div>

        <div className="relative -mt-32 py-20">
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
                <FaFirstAid className="mr-2" />
                <FaCertificate className="mr-2" />
                Formation Certifiée INRS
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeInUp">
                Formation SST : Sauveteur Secouriste du Travail
              </h1>
              <p className="text-xl text-red-100 mb-8 animate-fadeInUp animate-delay-100">
                Formation certifiée INRS pour devenir Sauveteur Secouriste du
                Travail. Apprenez les gestes qui sauvent et répondez à vos
                obligations légales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animate-delay-200">
                <Link
                  href="/contact"
                  className="bg-white text-red-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-2xl font-semibold inline-flex items-center justify-center group transform hover:scale-105"
                >
                  Inscrire mes équipes
                  <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
                <a
                  href="tel:+33000000000"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-red-600 transition-all font-semibold inline-flex items-center justify-center"
                >
                  <FaPhone className="mr-2" />
                  06 33 28 91 61
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Former Vos Salariés au SST ?
            </h2>
            <p className="text-lg text-gray-600">
              Des bénéfices concrets pour votre entreprise et vos collaborateurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {sstBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-700">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-4xl mx-auto bg-red-50 border-2 border-red-200 rounded-xl p-8">
            <div className="flex items-start">
              <div className="bg-red-100 text-red-600 p-4 rounded-lg mr-6 flex-shrink-0">
                <FaUsers size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Obligation Légale
                </h3>
                <p className="text-gray-700 mb-4">
                  <strong>Code du Travail (Art. R4224-15) :</strong> "Un membre
                  du personnel reçoit la formation de secouriste nécessaire pour
                  donner les premiers secours en cas d'urgence dans chaque
                  atelier où sont accomplis des travaux dangereux et dans chaque
                  chantier employant 20 travailleurs au moins pendant plus de
                  quinze jours où sont réalisés des travaux dangereux."
                </p>
                <p className="text-red-700 font-semibold">
                  ⚠️ Recommandation : 10 à 15% de l'effectif formé SST
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Formations SST
            </h2>
            <p className="text-lg text-gray-600">
              Formation initiale et recyclage pour maintenir vos compétences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Initial SST */}
            <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-red-200 hover:border-red-500 transition-all">
              <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg inline-block mb-4 font-bold">
                {sstProgram.initial.duration}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {sstProgram.initial.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {sstProgram.initial.description}
              </p>

              <h4 className="font-bold text-gray-900 mb-3">Objectifs :</h4>
              <ul className="space-y-2 mb-6">
                {sstProgram.initial.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start">
                    <FaCheckCircle className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{obj}</span>
                  </li>
                ))}
              </ul>

              <h4 className="font-bold text-gray-900 mb-3">Programme :</h4>
              <ul className="space-y-2">
                {sstProgram.initial.content.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <span className="text-red-600 mr-2">▸</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* MAC SST */}
            <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-orange-200 hover:border-orange-500 transition-all">
              <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg inline-block mb-4 font-bold">
                {sstProgram.mac.duration}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {sstProgram.mac.title}
              </h3>
              <p className="text-gray-600 mb-6">{sstProgram.mac.description}</p>

              <h4 className="font-bold text-gray-900 mb-3">Objectifs :</h4>
              <ul className="space-y-2 mb-6">
                {sstProgram.mac.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start">
                    <FaCheckCircle className="text-orange-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{obj}</span>
                  </li>
                ))}
              </ul>

              <h4 className="font-bold text-gray-900 mb-3">Programme :</h4>
              <ul className="space-y-2 mb-6">
                {sstProgram.mac.content.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <span className="text-orange-600 mr-2">▸</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  <strong>⏰ Rappel :</strong> Le recyclage MAC SST doit être
                  effectué avant la date de fin de validité du certificat (tous
                  les 24 mois maximum).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Informations Pratiques
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {practicalInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {info.title}
                  </h3>
                  <ul className="space-y-3">
                    {info.items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <FaCheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formation Formats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Formats de Formation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {formationFormats.map((format, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl p-8 shadow-lg relative ${
                    format.recommended ? "border-2 border-red-500" : ""
                  }`}
                >
                  {format.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Recommandé
                      </span>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {format.type}
                  </h3>
                  <p className="text-gray-600 mb-6">{format.description}</p>

                  <ul className="space-y-3">
                    {format.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <FaCheckCircle className="text-red-500 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-red-700 to-orange-700 text-white relative overflow-hidden">
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
              Formez Vos Équipes aux Gestes qui Sauvent
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Devis gratuit et programme de formation personnalisé sous 48h
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-red-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-110 shadow-lg hover:shadow-2xl font-semibold inline-flex items-center justify-center group"
              >
                Demander un devis
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <a
                href="tel:+33000000000"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-red-600 transition-all font-semibold inline-flex items-center justify-center"
              >
                <FaPhone className="mr-2" />
                Appelez-nous
              </a>
            </div>
            <p className="mt-6 text-red-100 text-sm">
              🎖️ Formateurs SST certifiés INRS • 📋 Conformité garantie • ⭐
              Sessions régulières
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
