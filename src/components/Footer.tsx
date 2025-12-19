import Link from "next/link";
import { FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Tarandro</h3>
            <p className="text-sm mb-4">
              Expert en accompagnement qualité et formation professionnelle.
              Nous vous accompagnons vers l'excellence.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Nos Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/certification-iso" className="hover:text-primary-400 transition-colors">
                  Certification ISO
                </Link>
              </li>
              <li>
                <Link href="/services/certification-has" className="hover:text-primary-400 transition-colors">
                  Certification HAS
                </Link>
              </li>
              <li>
                <Link href="/services/psad" className="hover:text-primary-400 transition-colors">
                  PSAD
                </Link>
              </li>
              <li>
                <Link href="/services/formation-bureautique" className="hover:text-primary-400 transition-colors">
                  Formation Bureautique
                </Link>
              </li>
              <li>
                <Link href="/services/formation-sst" className="hover:text-primary-400 transition-colors">
                  Formation SST
                </Link>
              </li>
            </ul>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/a-propos" className="hover:text-primary-400 transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="hover:text-primary-400 transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-3 mt-1 flex-shrink-0" />
                <span>17 Av. Professeur Horatio Smith<br />14000 Caen</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 flex-shrink-0" />
                <a href="tel:+33633289161" className="hover:text-primary-400 transition-colors">
                  06 33 28 91 61
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 flex-shrink-0" />
                <a href="mailto:contact@tarandro.org" className="hover:text-primary-400 transition-colors">
                  contact@tarandro.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p>&copy; {new Date().getFullYear()} Tarandro. Tous droits réservés.</p>
            <div className="flex items-center space-x-6">
              <Link href="/mentions-legales" className="hover:text-primary-400 transition-colors">
                Mentions légales
              </Link>
              <Link href="/mentions-legales#rgpd" className="hover:text-primary-400 transition-colors">
                RGPD
              </Link>
              <Link href="/mentions-legales#cookies" className="hover:text-primary-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
