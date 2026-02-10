"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const isAdmin = useIsAdmin();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
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
    <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter text-white">
              THE <span className="text-primary">KLAN</span> BJJ
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-xs font-bold text-gray-300 hover:text-primary transition-colors uppercase tracking-widest">
              Inicio
            </Link>
            <Link href="/nuestros-entrenadores" className="text-xs font-bold text-gray-300 hover:text-primary transition-colors uppercase tracking-widest">
              Entrenadores
            </Link>
            <Link href="/semblanza-master-francisco-ramirez" className="text-xs font-bold text-gray-300 hover:text-primary transition-colors uppercase tracking-widest">
              Head Coach
            </Link>
            <Link href="/costos-y-horarios" className="text-xs font-bold text-gray-300 hover:text-primary transition-colors uppercase tracking-widest">
              Costos y Horarios
            </Link>


            {/* Auth Section */}
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-xs font-bold text-gray-300 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Mi Cuenta
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-xs font-bold text-gray-300 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-xs font-bold text-gray-300 hover:text-primary transition-colors uppercase tracking-widest"
              >
                Login
              </Link>
            )}

            <Link
              href="#contacto"
              className="bg-primary hover:bg-red-700 text-white px-6 py-2 font-black uppercase tracking-widest transition-all clip-path-slant"
            >
              Entrenar Ahora
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-8 w-8" />
              ) : (
                <Bars3Icon className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-20 bg-black z-40 md:hidden flex flex-col p-8 space-y-6">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-xl font-black text-white hover:text-primary uppercase tracking-widest">
            Inicio
          </Link>
          <Link href="/nuestros-entrenadores" onClick={() => setIsOpen(false)} className="text-xl font-black text-white hover:text-primary uppercase tracking-widest">
            Entrenadores
          </Link>
          <Link href="/semblanza-master-francisco-ramirez" onClick={() => setIsOpen(false)} className="text-xl font-black text-white hover:text-primary uppercase tracking-widest">
            Head Coach
          </Link>
          <Link href="/costos-y-horarios" onClick={() => setIsOpen(false)} className="text-xl font-black text-white hover:text-primary uppercase tracking-widest">
            Costos y Horarios
          </Link>


          <div className="h-px bg-white/10 my-4" />

          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-300 hover:text-primary uppercase tracking-widest">
                Mi Cuenta
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="text-lg font-bold text-primary hover:text-white uppercase tracking-widest">
                  Admin
                </Link>
              )}
              <button onClick={handleSignOut} className="text-lg font-bold text-gray-300 hover:text-primary uppercase tracking-widest text-left">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link href="/auth/login" onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-300 hover:text-primary uppercase tracking-widest">
              Iniciar Sesión
            </Link>
          )}

          <Link
            href="#contacto"
            onClick={() => setIsOpen(false)}
            className="bg-primary text-white text-center py-4 font-black uppercase tracking-widest text-xl mt-4"
          >
            Entrenar Ahora
          </Link>
        </div>
      )}
    </nav>
  );
};
