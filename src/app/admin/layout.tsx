"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaBlog, FaHome, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";

export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Si pas de session et pas en chargement, rediriger vers login
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session && pathname !== "/admin/login") {
    router.push("/admin/login");
    return null;
  }

  const navigation = [
    { name: "Tableau de bord", href: "/admin", icon: FaChartBar },
    { name: "Blog", href: "/admin/blog", icon: FaBlog },
    { name: "Paramètres", href: "/admin/settings", icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-xl font-bold hover:text-primary-400 transition-colors">
                Tarandro Admin
              </Link>
              {session && (
                <span className="text-sm text-gray-400">
                  Bienvenue, {session.user?.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center text-sm"
              >
                <FaHome className="mr-2" />
                Voir le site
              </Link>
              {session && (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center text-sm"
                >
                  <FaSignOutAlt className="mr-2" />
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      {session && (
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-4 text-sm font-medium transition-colors inline-flex items-center border-b-2 ${
                      isActive
                        ? "border-primary-600 text-primary-600"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer Notice */}
      <footer className="bg-gray-800 text-gray-400 py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>🔒 Section administration - Accès réservé</p>
        </div>
      </footer>
    </div>
  );
}
