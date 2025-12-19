import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Mentions Légales - Tarandro",
  description: "Mentions légales, informations légales et conditions d'utilisation du site Tarandro.org",
  robots: {
    index: false,
    follow: true,
  },
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center text-primary-100 hover:text-white mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold">
            Mentions Légales
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8">
            
            {/* Éditeur du site */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Éditeur du site</h2>
              <div className="text-gray-700 space-y-2">
                <p><strong>Raison sociale :</strong> Tarandro</p>
                <p><strong>Forme juridique :</strong> SARL</p>
                <p><strong>Capital social :</strong> 10 000 €</p>
                <p><strong>Siège social :</strong> 17 Av. Professeur Horatio Smith, 14000 Caen</p>
                <p><strong>SIRET :</strong> 949 495 204 00016</p>
                <p><strong>RCS :</strong> 949 495 204 R.C.S. Caen</p>
                <p><strong>TVA Intracommunautaire :</strong> FR17949495204</p>
                <p><strong>Téléphone :</strong> 06 33 28 91 61</p>
                <p><strong>Email :</strong> <a href="mailto:contact@tarandro.org" className="text-primary-600 hover:underline">contact@tarandro.org</a></p>
                <p><strong>Directeur de la publication :</strong> Quentin TARANDRO</p>
              </div>
            </div>

            {/* Hébergement */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hébergement</h2>
              <div className="text-gray-700 space-y-2">
                <p><strong>Hébergeur :</strong> Vercel Inc.</p>
                <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
                <p><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">vercel.com</a></p>
              </div>
            </div>

            {/* Propriété intellectuelle */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
                </p>
                <p>
                  Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                </p>
                <p>
                  La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
                </p>
                <p>
                  Les marques citées sur ce site sont déposées par les sociétés qui en sont propriétaires.
                </p>
              </div>
            </div>

            {/* Protection des données personnelles (RGPD) */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Protection des données personnelles (RGPD)</h2>
              <div className="text-gray-700 space-y-3">
                <h3 className="text-xl font-semibold text-gray-900 mt-4">4.1. Collecte des données</h3>
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, nous collectons uniquement les données personnelles nécessaires au traitement de vos demandes via le formulaire de contact.
                </p>
                <p>Les données collectées sont :</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Nom de l'entreprise (facultatif)</li>
                  <li>Message de contact</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">4.2. Finalité du traitement</h3>
                <p>
                  Vos données personnelles sont collectées pour les finalités suivantes :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Répondre à vos demandes d'information</li>
                  <li>Établir des devis</li>
                  <li>Assurer le suivi commercial</li>
                  <li>Respecter nos obligations légales</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">4.3. Durée de conservation</h3>
                <p>
                  Vos données sont conservées pendant une durée maximale de 3 ans à compter de notre dernier contact, conformément aux recommandations de la CNIL.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mt-6">4.4. Vos droits</h3>
                <p>
                  Conformément à la réglementation en vigueur, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Droit d'accès :</strong> obtenir la confirmation que des données vous concernant sont traitées et en obtenir une copie</li>
                  <li><strong>Droit de rectification :</strong> faire corriger des données inexactes ou incomplètes</li>
                  <li><strong>Droit à l'effacement :</strong> obtenir l'effacement de vos données dans certains cas</li>
                  <li><strong>Droit à la limitation :</strong> obtenir la limitation du traitement de vos données</li>
                  <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                  <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                </ul>
                <p className="mt-4">
                  Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@tarandro.org" className="text-primary-600 hover:underline">contact@tarandro.org</a>
                </p>
                <p>
                  Vous pouvez également introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">www.cnil.fr</a>
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Ce site utilise des cookies strictement nécessaires à son fonctionnement (cookies de session pour l'administration).
                </p>
                <p>
                  Aucun cookie de tracking ou de publicité n'est utilisé.
                </p>
                <p>
                  Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut limiter l'accès à certaines fonctionnalités du site.
                </p>
              </div>
            </div>

            {/* Responsabilité */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation de responsabilité</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
                </p>
                <p>
                  Si vous constatez une lacune, erreur ou ce qui paraît être un dysfonctionnement, merci de bien vouloir le signaler par email à <a href="mailto:contact@tarandro.org" className="text-primary-600 hover:underline">contact@tarandro.org</a>.
                </p>
                <p>
                  Tarandro ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.
                </p>
              </div>
            </div>

            {/* Droit applicable */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Droit applicable et juridiction compétente</h2>
              <div className="text-gray-700 space-y-3">
                <p>
                  Les présentes mentions légales sont soumises au droit français.
                </p>
                <p>
                  En cas de litige et à défaut d'accord amiable, le tribunal compétent sera celui du ressort du siège social de Tarandro.
                </p>
              </div>
            </div>

            {/* Crédits */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Crédits</h2>
              <div className="text-gray-700 space-y-2">
                <p><strong>Conception et développement :</strong> Tarandro</p>
                <p><strong>Hébergement :</strong> Vercel</p>
                <p><strong>Icônes :</strong> React Icons</p>
              </div>
            </div>

            {/* Date de mise à jour */}
            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* CTA Retour */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              <FaArrowLeft className="mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
