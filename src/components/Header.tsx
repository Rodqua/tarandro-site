"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaBars, FaTimes, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Services", href: "/services" },
    { name: "À propos", href: "/a-propos" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 transition-all duration-300">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/logo.svg"
              alt="Tarandro - Qualité & Formation"
              width={180}
              height={50}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Contact Info Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <a href="tel:+33633289161" className="flex items-center text-gray-600 hover:text-primary-600 transition-colors">
              <FaPhone className="mr-2" />
              <span className="text-sm">06 33 28 91 61</span>
            </a>
            <Link
              href="/contact"
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Devis gratuit
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slideDown">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <a href="tel:+33633289161" className="flex items-center text-gray-600 hover:text-primary-600 transition-colors py-2">
                  <FaPhone className="mr-2" />
                  <span>06 33 28 91 61</span>
                </a>
                <Link
                  href="/contact"
                  className="block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium text-center mt-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Devis gratuit
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
