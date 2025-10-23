"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const navLinks = [
    { href: "/", label: "INICIO" },
    { href: "/nuestros-entrenadores", label: "ENTRENADORES" },
    {
      href: "/semblanza-master-francisco-ramirez",
      label: "MASTER FRANCISCO",
    },
    { href: "/costos-y-horarios", label: "COSTOS Y HORARIOS" },
  ];

  const handleSignOut = async () => {
    try {
      console.log("🚪 Iniciando proceso de logout...");
      await signOut();
      console.log("✅ Logout completado");
      setIsOpen(false);
      // Redirigir al home después del logout
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Error durante logout:", error);
    }
  };

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-bold text-red-600">
              THE KLAN
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-red-600 transition-colors duration-200 font-semibold text-sm"
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Section */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/20">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/dashboard"
                    className="text-white hover:text-red-600 transition-colors duration-200 font-semibold text-sm"
                  >
                    MI CUENTA
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-white hover:text-red-600 transition-colors duration-200 font-semibold text-sm"
                  >
                    SALIR
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-white hover:text-red-600 transition-colors duration-200 font-semibold text-sm"
                >
                  INICIAR SESIÓN
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-red-600 transition-colors relative z-[60]"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay con blur (fondo) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Navigation - Slide from right */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-red-600 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-black transition-colors duration-200 font-bold text-base py-4 border-b border-white/20"
              style={{
                animation: isOpen
                  ? `slideInRight 0.3s ease-out ${index * 0.1}s both`
                  : "none",
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Auth Section Mobile */}
          <div className="mt-6 pt-6 border-t border-white/20">
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            ) : user ? (
              <div className="space-y-4">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-white hover:text-black transition-colors duration-200 font-bold text-base py-4 border-b border-white/20"
                  style={{
                    animation: isOpen
                      ? `slideInRight 0.3s ease-out ${
                          navLinks.length * 0.1
                        }s both`
                      : "none",
                  }}
                >
                  MI CUENTA
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-white hover:text-black transition-colors duration-200 font-bold text-base py-4"
                  style={{
                    animation: isOpen
                      ? `slideInRight 0.3s ease-out ${
                          (navLinks.length + 1) * 0.1
                        }s both`
                      : "none",
                  }}
                >
                  SALIR
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="block text-white hover:text-black transition-colors duration-200 font-bold text-base py-4"
                style={{
                  animation: isOpen
                    ? `slideInRight 0.3s ease-out ${
                        navLinks.length * 0.1
                      }s both`
                    : "none",
                }}
              >
                INICIAR SESIÓN
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Animación CSS */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
};
