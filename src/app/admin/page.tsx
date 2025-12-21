"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaBlog,
  FaUsers,
  FaChartLine,
  FaEnvelope,
  FaTrophy,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaGoogle,
  FaEye,
  FaImage,
} from "react-icons/fa";

interface Stats {
  totalContacts: number;
  contactsThisMonth: number;
  blogPosts: number;
  estimatedVisitors: number;
  conversionRate: string;
  trend: number;
  serviceStats: { [key: string]: number };
  recentContacts: Array<{
    name: string;
    service: string;
    date: string;
    email: string;
  }>;
}

interface AnalyticsData {
  overview: {
    users: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    conversionRate: number;
  };
  trafficSources: Array<{
    source: string;
    sessions: number;
    users: number;
  }>;
  topPages: Array<{
    title: string;
    path: string;
    views: number;
    users: number;
  }>;
  events: Array<{
    name: string;
    count: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    // Charger les stats de base
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        setLoading(false);
      });

    // Charger les stats Google Analytics
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Réponse API Analytics:", data);
        if (data.success && data.analytics) {
          setAnalytics(data.analytics);
          setAnalyticsEnabled(true);
          setAnalyticsError(null);
        } else if (data.error) {
          setAnalyticsError(data.error);
          console.error("Erreur GA4:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching analytics:", error);
        setAnalyticsError(error.message);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  const serviceLabels: { [key: string]: string } = {
    iso: "Certification ISO",
    has: "Certification HAS",
    psad: "PSAD",
    bureautique: "Formation Bureautique",
    sst: "Formation SST",
    autre: "Autre",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          {analyticsEnabled && (
            <div className="flex items-center mt-2 text-sm text-green-600">
              <FaGoogle className="mr-1" />
              Google Analytics connecté
            </div>
          )}
          {!analyticsEnabled && analyticsError && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Google Analytics non disponible:</strong>{" "}
                {analyticsError}
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Consultez{" "}
                <a href="/GOOGLE_ANALYTICS_CONFIG.md" className="underline">
                  GOOGLE_ANALYTICS_CONFIG.md
                </a>{" "}
                pour la configuration
              </p>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500">
          Dernière mise à jour:{" "}
          {new Date().toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-gray-600 mb-1">Messages reçus</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalContacts || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.contactsThisMonth || 0} ce mois
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-4 rounded-lg">
              <FaEnvelope size={24} />
            </div>
          </div>
          {stats && stats.trend !== 0 && (
            <div
              className={`flex items-center text-sm mt-2 ${
                stats.trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stats.trend > 0 ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              {Math.abs(stats.trend)}% vs mois dernier
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Articles publiés</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.blogPosts || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Sur le blog</p>
            </div>
            <div className="bg-primary-100 text-primary-600 p-4 rounded-lg">
              <FaBlog size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Visiteurs (est.)</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.estimatedVisitors || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ce mois</p>
            </div>
            <div className="bg-green-100 text-green-600 p-4 rounded-lg">
              <FaUsers size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Taux de conversion</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.conversionRate || "0.0"}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Messages / Visites</p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-4 rounded-lg">
              <FaChartLine size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Services les plus demandés */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaTrophy className="text-yellow-500 mr-2" />
            Services les plus demandés
          </h2>
          {stats && Object.keys(stats.serviceStats).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.serviceStats)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([service, count]) => {
                  const total = Object.values(stats.serviceStats).reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = ((count / total) * 100).toFixed(0);
                  return (
                    <div key={service}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {serviceLabels[service] || service}
                        </span>
                        <span className="text-sm text-gray-600">
                          {count} demandes
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune demande pour le moment
            </p>
          )}
        </div>

        {/* Google Analytics Stats */}
        {analyticsEnabled && analytics && (
          <>
            {/* Analytics Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaEye className="text-green-500 mr-2" />
                Trafic du site (30 jours)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.overview.users.toLocaleString("fr-FR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.overview.sessions.toLocaleString("fr-FR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pages vues</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.overview.pageViews.toLocaleString("fr-FR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux rebond</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.overview.bounceRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Durée moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(analytics.overview.avgSessionDuration)}s
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux conversion</p>
                  <p className="text-2xl font-bold text-green-600">
                    {analytics.overview.conversionRate.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Sources de trafic
              </h2>
              {analytics.trafficSources.length > 0 ? (
                <div className="space-y-3">
                  {analytics.trafficSources.map((source, index) => {
                    const total = analytics.trafficSources.reduce(
                      (sum, s) => sum + s.sessions,
                      0
                    );
                    const percentage = (
                      (source.sessions / total) *
                      100
                    ).toFixed(0);
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {source.source}
                          </span>
                          <span className="text-sm text-gray-600">
                            {source.sessions} sessions
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Aucune donnée disponible
                </p>
              )}
            </div>

            {/* Top Pages */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Pages populaires
              </h2>
              {analytics.topPages.length > 0 ? (
                <div className="space-y-2">
                  {analytics.topPages.slice(0, 10).map((page, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {page.title || page.path}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {page.path}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600 ml-2">
                        {page.views.toLocaleString("fr-FR")} vues
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Aucune donnée disponible
                </p>
              )}
            </div>

            {/* Custom Events */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Événements trackés
              </h2>
              {analytics.events.length > 0 ? (
                <div className="space-y-3">
                  {analytics.events.map((event, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {event.name}
                      </span>
                      <span className="text-lg font-bold text-primary-600">
                        {event.count.toLocaleString("fr-FR")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Aucun événement tracké
                </p>
              )}
            </div>
          </>
        )}

        {/* Derniers contacts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaClock className="text-blue-500 mr-2" />
            Derniers contacts
          </h2>
          {stats && stats.recentContacts.length > 0 ? (
            <div className="space-y-3">
              {stats.recentContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-start border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="bg-primary-100 text-primary-600 p-2 rounded-lg mr-3 flex-shrink-0">
                    <FaEnvelope />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {serviceLabels[contact.service] || contact.service}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(contact.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucun contact récent
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/blog"
          className="block bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-2">
            <FaBlog size={32} />
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {stats?.blogPosts || 0}
            </span>
          </div>
          <h3 className="text-lg font-bold mb-1">Gérer le blog</h3>
          <p className="text-sm text-primary-100">
            Créer et modifier des articles
          </p>
        </Link>

        <Link
          href="/admin/images"
          className="block bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-2">
            <FaImage size={32} />
          </div>
          <h3 className="text-lg font-bold mb-1">Gérer les images</h3>
          <p className="text-sm text-purple-100">
            Télécharger et organiser les images
          </p>
        </Link>

        <Link
          href="/blog"
          className="block bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-2">
            <FaUsers size={32} />
          </div>
          <h3 className="text-lg font-bold mb-1">Voir le site</h3>
          <p className="text-sm text-green-100">
            Consulter la version publique
          </p>
        </Link>

        <button
          onClick={() => window.location.reload()}
          className="block w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between mb-2">
            <FaChartLine size={32} />
          </div>
          <h3 className="text-lg font-bold mb-1">Actualiser</h3>
          <p className="text-sm text-blue-100">Rafraîchir les statistiques</p>
        </button>
      </div>
    </div>
  );
}
