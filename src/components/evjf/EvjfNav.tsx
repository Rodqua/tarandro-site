"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/lise/dashboard", label: "Accueil", icon: "🏠" },
  { href: "/lise/idees", label: "Idées", icon: "💡" },
  { href: "/lise/programme", label: "Programme", icon: "📅" },
  { href: "/lise/budget", label: "Budget", icon: "💰" },
  { href: "/lise/messages", label: "Messages", icon: "💬" },
];

export default function EvjfNav({ userName, role }: { userName: string; role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/evjf/auth/logout", { method: "POST" });
    router.push("/lise/login");
  }

  return (
    <>
      {/* Desktop sidebar / Mobile top bar */}
      <nav className="bg-white border-b border-pink-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/lise/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">💍</span>
              <span className="font-bold text-pink-600 hidden sm:block"
                    style={{ fontFamily: "var(--font-playfair)" }}>
                EVJF Lise
              </span>
            </Link>

            {/* Links desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith(l.href)
                      ? "bg-pink-100 text-pink-700"
                      : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                  }`}
                >
                  <span>{l.icon}</span>
                  {l.label}
                </Link>
              ))}
              {role === "ORGANIZER" && (
                <Link
                  href="/lise/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname.startsWith("/lise/admin")
                      ? "bg-fuchsia-100 text-fuchsia-700"
                      : "text-gray-600 hover:bg-fuchsia-50 hover:text-fuchsia-600"
                  }`}
                >
                  <span>⚙️</span> Admin
                </Link>
              )}
            </div>

            {/* User + logout */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:block">
                Salut <span className="font-semibold text-pink-600">{userName}</span> 👋
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
              >
                Déco
              </button>
              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-pink-50"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-pink-100 bg-white px-4 py-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith(l.href)
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:bg-pink-50"
                }`}
              >
                {l.icon} {l.label}
              </Link>
            ))}
            {role === "ORGANIZER" && (
              <Link href="/lise/admin" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-fuchsia-600 hover:bg-fuchsia-50">
                ⚙️ Admin
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
