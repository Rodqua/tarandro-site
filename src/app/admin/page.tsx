import Link from "next/link";
import { FaBlog, FaUsers, FaChartLine, FaEnvelope } from "react-icons/fa";

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de bord</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Articles publiés</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
            <div className="bg-primary-100 text-primary-600 p-4 rounded-lg">
              <FaBlog size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Visiteurs (mois)</p>
              <p className="text-3xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="bg-green-100 text-green-600 p-4 rounded-lg">
              <FaUsers size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Taux de conversion</p>
              <p className="text-3xl font-bold text-gray-900">3.2%</p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-4 rounded-lg">
              <FaChartLine size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Messages reçus</p>
              <p className="text-3xl font-bold text-gray-900">45</p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-4 rounded-lg">
              <FaEnvelope size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <Link
              href="/admin/blog"
              className="block bg-primary-50 hover:bg-primary-100 text-primary-700 px-4 py-3 rounded-lg transition-colors font-medium"
            >
              📝 Créer un nouvel article
            </Link>
            <Link
              href="/blog"
              className="block bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg transition-colors font-medium"
            >
              👀 Voir le blog public
            </Link>
            <Link
              href="/contact"
              className="block bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg transition-colors font-medium"
            >
              📧 Voir les messages
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dernières activités</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                ✓
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Article publié</p>
                <p className="text-xs text-gray-500">Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                📧
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Nouveau message reçu</p>
                <p className="text-xs text-gray-500">Il y a 5 heures</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg mr-3">
                ✏️
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Article modifié</p>
                <p className="text-xs text-gray-500">Hier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
