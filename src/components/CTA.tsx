import Link from "next/link";
import { FaArrowRight, FaPhone } from "react-icons/fa";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
      {/* Animated Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary-400 rounded-full filter blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à démarrer votre projet qualité ou formation ?
          </h2>
          
          <p className="text-xl mb-8 text-primary-100">
            Bénéficiez d'un diagnostic gratuit et d'un devis personnalisé sous 48h
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-110 shadow-lg hover:shadow-2xl font-semibold inline-flex items-center group"
            >
              Demander un devis gratuit
              <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <a
              href="tel:+33000000000"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-primary-600 transition-all font-semibold inline-flex items-center transform hover:scale-110 shadow-lg hover:shadow-2xl"
            >
              <FaPhone className="mr-2" />
              06 33 28 91 61
            </a>
          </div>

          <p className="mt-8 text-primary-100 text-sm">
            Réponse rapide • Devis gratuit • Sans engagement
          </p>
        </div>
      </div>
    </section>
  );
}
