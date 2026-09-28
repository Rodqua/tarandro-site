import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight, FaPhone, FaUsers, FaCheckCircle } from "react-icons/fa";

import DiscTest from "@/components/disc/DiscTest";
import { DISC_DIMENSIONS, DIMENSION_ORDER } from "@/lib/disc/dimensions";
import { TOTAL_QUESTIONS } from "@/lib/disc/questions";

export const metadata: Metadata = {
  title: "Test DISC gratuit et complet - Analyse de profil comportemental",
  description:
    "Passez le test DISC complet en ligne (28 groupes en choix forcé) et obtenez immédiatement votre profil comportemental commenté, avec vos trois graphiques et vos axes de développement. Gratuit, sans inscription.",
  keywords: [
    "test DISC",
    "analyse DISC",
    "profil DISC",
    "test DISC gratuit",
    "méthode DISC",
    "profil comportemental",
    "couleurs DISC",
    "test de personnalité professionnel",
  ],
  alternates: {
    canonical: "https://tarandro.org/analyse-disc",
  },
  openGraph: {
    title: "Test DISC gratuit et complet - Analyse de profil comportemental",
    description:
      "Le test DISC complet en choix forcé, avec résultat commenté et graphiques. Gratuit, sans inscription, 10 minutes.",
    url: "https://tarandro.org/analyse-disc",
    type: "website",
  },
};

const faq = [
  {
    question: "Le test DISC proposé ici est-il le vrai test&nbsp;?",
    answer:
      "Il en reprend la méthodologie complète : 28 groupes de quatre adjectifs en choix forcé (« le plus » / « le moins »), un adjectif par dimension dans chaque groupe, et le calcul des trois graphiques classiques — masque, moteur, synthèse. C'est la construction utilisée par les questionnaires DISC professionnels depuis les travaux de Walter Clarke. Les versions commerciales certifiées ajoutent un étalonnage sur une population de référence et une restitution par un consultant habilité : c'est ce qui les distingue d'un test en ligne, et c'est pourquoi nous recommandons un débriefing pour toute utilisation en entreprise.",
  },
  {
    question: "Mes réponses sont-elles enregistrées&nbsp;?",
    answer:
      "Non. Le calcul est effectué entièrement dans votre navigateur et vos réponses sont conservées uniquement dans le stockage local de votre appareil, afin que vous puissiez reprendre un test interrompu. Aucune donnée n'est transmise à Tarandro ni à un tiers, et le bouton « Repasser le test » efface tout.",
  },
  {
    question: "Pourquoi trois graphiques et non un seul&nbsp;?",
    answer:
      "Parce que le comportement observable au travail n'est pas identique au fonctionnement naturel. Le premier graphique, construit sur les adjectifs choisis comme « le plus », décrit le comportement adapté à votre contexte professionnel. Le second, construit sur les adjectifs rejetés, est moins contrôlé : il révèle le comportement instinctif, celui qui ressort sous pression. L'écart entre les deux est l'information la plus utile de l'analyse : il mesure l'effort d'adaptation que votre poste vous demande.",
  },
  {
    question: "Le DISC mesure-t-il la personnalité&nbsp;?",
    answer:
      "Non, et la distinction est importante. Le DISC décrit des préférences comportementales observables dans un contexte donné, pas des traits de personnalité stables ni des aptitudes. Il ne mesure ni l'intelligence, ni les compétences, ni la motivation profonde. Un même individu peut obtenir des profils différents selon la période et le poste occupé.",
  },
  {
    question: "Peut-on utiliser le DISC en recrutement&nbsp;?",
    answer:
      "Le DISC peut éclairer un échange en recrutement, mais il ne constitue pas un outil de sélection : il n'est pas prédictif de la performance et son usage comme critère de décision est à la fois contestable méthodologiquement et risqué juridiquement. Il est en revanche très efficace en développement managérial, en cohésion d'équipe, en formation à la communication et en accompagnement de la prise de poste.",
  },
  {
    question: "Combien de temps faut-il pour le passer&nbsp;?",
    answer: `Comptez 10 à 15 minutes pour les ${TOTAL_QUESTIONS} groupes. Répondez d'un seul trait : le premier mouvement est plus fiable qu'une réponse longuement pesée.`,
  },
];

const usages = [
  {
    title: "Cohésion d'équipe",
    description:
      "Comprendre pourquoi deux collaborateurs compétents se comprennent mal, et outiller le collectif pour réduire les frictions inutiles.",
    icon: "🤝",
  },
  {
    title: "Développement managérial",
    description:
      "Identifier son style de management naturel, ses angles morts et son comportement sous pression.",
    icon: "🎯",
  },
  {
    title: "Communication et relation client",
    description:
      "Adapter son discours au profil de son interlocuteur : ce qui convainc un profil D braque un profil S.",
    icon: "💬",
  },
  {
    title: "Prise de poste et mobilité",
    description:
      "Mesurer l'écart entre le comportement demandé par le poste et le fonctionnement naturel de la personne.",
    icon: "🧭",
  },
];

export default function AnalyseDiscPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question.replace(/&nbsp;/g, " "),
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-secondary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float"></div>
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-scaleIn">
              <FaUsers className="mr-2" />
              Test complet · Gratuit · Sans inscription
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeInUp">
              Analyse DISC : découvrez votre profil comportemental
            </h1>
            <p className="text-xl text-primary-100 mb-8 animate-fadeInUp animate-delay-100">
              {TOTAL_QUESTIONS} groupes d&apos;adjectifs en choix forcé, la méthodologie complète du
              DISC, et un résultat immédiatement commenté : vos trois graphiques, votre profil, vos
              points de vigilance et vos axes de développement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animate-delay-200">
              <a
                href="#test-disc"
                className="bg-white text-primary-700 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-2xl font-semibold inline-flex items-center justify-center group transform hover:scale-105"
              >
                Passer le test maintenant
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </a>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-primary-700 transition-all font-semibold inline-flex items-center justify-center"
              >
                Former mon équipe au DISC
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Le modèle */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Qu&apos;est-ce que le modèle DISC&nbsp;?
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Le DISC est un modèle de lecture des comportements issu des travaux du psychologue
              américain William Moulton Marston, publiés en 1928 dans{" "}
              <em>Emotions of Normal People</em>. Marston observe que les comportements
              s&apos;organisent selon deux questions : la personne perçoit-elle son environnement
              comme favorable ou hostile, et s&apos;y estime-t-elle plus forte ou moins forte que
              lui&nbsp;? Le croisement de ces deux axes produit quatre grandes tendances.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Dans les années 1950, Walter Clarke transforme ce modèle descriptif en questionnaire
              utilisable en entreprise, sur le principe du <strong>choix forcé</strong> : au lieu de
              noter des affirmations une par une, la personne compare des adjectifs entre eux. Ce
              principe reste celui de tous les questionnaires DISC actuels, y compris celui de cette
              page.
            </p>
            <p className="text-lg text-gray-700">
              Le DISC ne classe pas les personnes en « bonnes » ou « mauvaises » catégories : il
              décrit des <strong>préférences comportementales</strong>. Chacun dispose des quatre
              dimensions, dans des intensités différentes, et peut mobiliser celle que la situation
              demande — simplement avec plus ou moins d&apos;effort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {DIMENSION_ORDER.map((dimension) => {
              const info = DISC_DIMENSIONS[dimension];
              return (
                <div
                  key={dimension}
                  className="rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all"
                  style={{ backgroundColor: info.softBg }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className="w-14 h-14 rounded-xl text-white text-2xl font-bold inline-flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: info.color }}
                    >
                      {info.letter}
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{info.name}</h3>
                      <p className="text-sm text-gray-600">{info.question}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{info.summary}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {info.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="bg-white/80 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-gray-900 mb-1">Ce dont ce profil a besoin :</p>
                    <ul className="space-y-1">
                      {info.needs.map((need) => (
                        <li key={need} className="flex items-start">
                          <FaCheckCircle
                            className="mr-2 mt-1 flex-shrink-0"
                            style={{ color: info.color }}
                          />
                          <span>{need}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Le test */}
      <section id="test-disc" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Votre test DISC
              </h2>
              <p className="text-lg text-gray-600">
                {TOTAL_QUESTIONS} groupes, deux choix par groupe, un résultat commenté à la fin.
                Rien n&apos;est envoyé sur nos serveurs.
              </p>
            </div>
            <DiscTest />
          </div>
        </div>
      </section>

      {/* Usages */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              À quoi sert une analyse DISC en entreprise&nbsp;?
            </h2>
            <p className="text-lg text-gray-600">
              Le profil n&apos;est pas une fin : c&apos;est un support de discussion. Sa valeur
              apparaît quand il est utilisé collectivement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {usages.map((usage) => (
              <div
                key={usage.title}
                className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-8 border border-primary-100 hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-3">{usage.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{usage.title}</h3>
                <p className="text-gray-700">{usage.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-4xl mx-auto bg-amber-50 border-2 border-amber-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Les limites à connaître avant d&apos;utiliser le DISC
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-amber-700 mr-2 flex-shrink-0">▸</span>
                <span>
                Le DISC n&apos;est pas un test d&apos;aptitude et n&apos;a pas de valeur prédictive
                sur la performance : il ne doit pas servir de critère de sélection.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 mr-2 flex-shrink-0">▸</span>
                <span>
                Le résultat dépend du contexte et de l&apos;état d&apos;esprit du moment ; un profil
                passé en période de tension n&apos;est pas comparable à un profil passé en période
                stable.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 mr-2 flex-shrink-0">▸</span>
                <span>
                Il décrit des comportements, pas des personnes : réduire un collaborateur à une
                lettre ou à une couleur est l&apos;erreur la plus courante — et la plus
                contre-productive.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 mr-2 flex-shrink-0">▸</span>
                <span>
                Un profil s&apos;interprète : deux graphiques identiques peuvent raconter deux
                histoires différentes selon le poste et le parcours. D&apos;où l&apos;intérêt
                d&apos;une restitution.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <details
                  key={item.question}
                  className="bg-white rounded-xl border border-gray-200 p-6 group"
                >
                  <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-start justify-between gap-4">
                    <span dangerouslySetInnerHTML={{ __html: item.question }} />
                    <span className="text-primary-600 group-open:rotate-45 transition-transform text-xl leading-none">
                      +
                    </span>
                  </summary>
                  <p className="text-gray-700 mt-4 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-700 via-primary-800 to-secondary-800 text-white relative overflow-hidden">
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
              Passer du profil individuel à la performance collective
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Ateliers DISC, restitutions individuelles, formation à la communication
              interpersonnelle : nous accompagnons vos équipes après le test.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-primary-700 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-110 shadow-lg hover:shadow-2xl font-semibold inline-flex items-center justify-center group"
              >
                Demander un devis
                <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <a
                href="tel:+33633289161"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-primary-700 transition-all font-semibold inline-flex items-center justify-center"
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
