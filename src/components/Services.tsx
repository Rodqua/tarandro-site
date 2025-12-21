import Link from "next/link";
import { 
  FaCertificate, 
  FaHospital, 
  FaFileAlt, 
  FaLaptop, 
  FaFirstAid,
  FaAward,
  FaArrowRight 
} from "react-icons/fa";

const services = [
  {
    icon: FaCertificate,
    title: "Certification ISO",
    description: "Accompagnement complet pour obtenir vos certifications ISO (9001, 14001, 45001, 27001...). Audit, mise en conformité et suivi.",
    href: "/services/certification-iso",
    color: "primary"
  },
  {
    icon: FaHospital,
    title: "Certification HAS",
    description: "Expert en certification Haute Autorité de Santé pour établissements de santé et médico-sociaux. Préparation à la visite de certification.",
    href: "/services/certification-has",
    color: "secondary"
  },
  {
    icon: FaFileAlt,
    title: "PSAD (Programme d'Actions)",
    description: "Élaboration et suivi de votre Programme d'Actions pour l'amélioration continue de la qualité et la gestion des risques.",
    href: "/services/psad",
    color: "primary"
  },
  {
    icon: FaLaptop,
    title: "Formation Bureautique",
    description: "Formations Microsoft Office (Word, Excel, PowerPoint, Outlook), Google Workspace et outils collaboratifs. Tous niveaux.",
    href: "/services/formation-bureautique",
    color: "secondary"
  },
  {
    icon: FaFirstAid,
    title: "Formation SST",
    description: "Formation Sauveteur Secouriste du Travail certifiée INRS. Initial, recyclage et maintien des compétences. Sessions inter et intra-entreprise.",
    href: "/services/formation-sst",
    color: "primary"
  },
  {
    icon: FaAward,
    title: "Certification Qualiopi",
    description: "Accompagnement complet pour obtenir et maintenir votre certification Qualiopi. Accédez aux financements publics et mutualisés.",
    href: "/services/certification-qualiopi",
    color: "secondary"
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header - Optimisé SEO */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Services d'Accompagnement Qualité et Formation
          </h2>
          <p className="text-lg text-gray-600">
            Des solutions sur-mesure pour répondre à vos enjeux de qualité, 
            conformité réglementaire et développement des compétences
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            const colorClass = service.color === "primary" 
              ? "bg-primary-100 text-primary-600" 
              : "bg-secondary-100 text-secondary-600";
            const hoverClass = service.color === "primary"
              ? "group-hover:bg-primary-600"
              : "group-hover:bg-secondary-600";

            return (
              <Link
                key={index}
                href={service.href}
                className="group bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${colorClass} ${hoverClass} rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:text-white group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={32} />
                  </div>
                
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform">
                    En savoir plus
                    <FaArrowRight className="ml-2 group-hover:ml-3 transition-all" size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all shadow-lg font-semibold group"
          >
            Voir tous nos services
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
