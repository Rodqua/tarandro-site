import { FaCheckCircle, FaAward, FaUsers, FaChartLine } from "react-icons/fa";

const benefits = [
  {
    icon: FaCheckCircle,
    title: "Expertise Certifiée",
    description:
      "Consultants qualifiés et formateurs certifiés avec une solide expérience terrain",
  },
  {
    icon: FaAward,
    title: "Approche Personnalisée",
    description:
      "Chaque accompagnement est adapté à votre contexte, vos objectifs et vos contraintes",
  },
  {
    icon: FaUsers,
    title: "Accompagnement Complet",
    description:
      "De l'audit initial à la certification, nous sommes à vos côtés à chaque étape",
  },
  {
    icon: FaChartLine,
    title: "Résultats Mesurables",
    description:
      "Indicateurs de performance et amélioration continue pour garantir votre réussite",
  },
];

export default function About() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Pourquoi choisir Tarandro pour votre démarche qualité ?
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Spécialiste de l'accompagnement qualité et de la formation
              professionnelle, nous mettons notre expertise au service de votre
              performance et de votre conformité réglementaire.
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Que vous soyez une entreprise en quête de certification ISO, un
              établissement de santé préparant votre évaluation HAS, ou une
              organisation souhaitant développer les compétences de vos
              collaborateurs, nous concevons des solutions pragmatiques et
              efficaces adaptées à vos besoins.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mr-4">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Image or Stats */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-500">
              <h3 className="text-2xl font-bold mb-6">
                Notre Engagement Qualité
              </h3>

              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-default">
                  <div className="text-3xl font-bold mb-2">10+ ans</div>
                  <p className="text-primary-100">
                    d'expérience dans l'accompagnement qualité
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-default">
                  <div className="text-3xl font-bold mb-2">100%</div>
                  <p className="text-primary-100">
                    de nos clients nous recommandent
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-default">
                  <div className="text-3xl font-bold mb-2">Multi-secteurs</div>
                  <p className="text-primary-100">
                    Industrie, Santé, Services, BTP,Tertiaire
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300">
                <p className="text-sm italic leading-relaxed">
                  "L'excellence n'est pas une destination, c'est un voyage
                  continu. Nous vous accompagnons sur ce chemin avec méthode et
                  bienveillance."
                </p>
              </div>
            </div>

            {/* Decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-200 rounded-full filter blur-2xl opacity-50 -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary-200 rounded-full filter blur-2xl opacity-50 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
