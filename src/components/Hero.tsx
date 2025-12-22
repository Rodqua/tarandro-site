import Link from "next/link";
import { FaArrowRight, FaStar } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden">
      {/* Animated Decoration elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 animate-float"></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 rounded-full filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-300 rounded-full filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo bannière */}
          <div className="mb-8 animate-scaleIn">
            <img
              src="https://8vsrlofryyepkmou.public.blob.vercel-storage.com/images/logo/1766338321745-LogoSite_Hor_Qualit__et_Formation.png"
              alt="Tarandro - Qualité et Formation"
              className="mx-auto h-20 md:h-24 w-auto"
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center bg-white px-4 py-2 rounded-full shadow-lg mb-8 animate-scaleIn hover:scale-105 transition-transform duration-300">
            <FaStar className="text-yellow-400 mr-2 animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              Expert certifié qualité & formation
            </span>
          </div>

          {/* Main Title - Optimisé SEO avec H1 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fadeInUp leading-tight">
            Accompagnement Qualité &{" "}
            <span className="gradient-text">Formation Professionnelle</span>
          </h1>

          {/* Subtitle avec mots-clés */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fadeInUp animate-delay-100">
            Certifications{" "}
            <strong className="text-primary-600">
              ISO, HAS-PSDM, QUALIOPI
            </strong>{" "}
            • Formation{" "}
            <strong className="text-secondary-600">Bureautique & SST</strong>
          </p>

          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto animate-fadeInUp animate-delay-200">
            Optimisez votre démarche qualité et développez les compétences de
            vos équipes avec un accompagnement personnalisé et des formations
            certifiées.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp animate-delay-300">
            <Link
              href="/contact"
              className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-105 hover:shadow-2xl shadow-lg font-semibold inline-flex items-center group overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Demander un devis gratuit
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></div>
            </Link>
            <Link
              href="/services"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all border-2 border-primary-600 font-semibold hover:shadow-xl transform hover:scale-105"
            >
              Découvrir nos services
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center animate-fadeInUp animate-delay-300 group cursor-default">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">
                10+
              </div>
              <div className="text-sm text-gray-600">Années d'expérience</div>
            </div>
            <div className="text-center animate-fadeInUp animate-delay-400 group cursor-default">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">
                50+
              </div>
              <div className="text-sm text-gray-600">Clients accompagnés</div>
            </div>
            <div className="text-center animate-fadeInUp animate-delay-500 group cursor-default">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">
                100%
              </div>
              <div className="text-sm text-gray-600">Taux de réussite</div>
            </div>
            <div className="text-center animate-fadeInUp animate-delay-500 group cursor-default">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">
                2500+
              </div>
              <div className="text-sm text-gray-600">Stagiaires formés</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
