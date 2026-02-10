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
    <>
      <nav className="fixed top-0 w-full z-[100] bg-black/95 backdrop-blur-sm">
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
              <Link href="/reglamento" className="text-xs font-bold text-gray-300 hover:text-primary transition-colors uppercase tracking-widest">
                Reglamento
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
      </nav>

      {/* Mobile Navigation Overlay - Closes menu when clicked */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 bottom-0 right-0 w-1/2 bg-primary z-[101] shadow-2xl transform transition-transform duration-300 ease-out border-l-4 border-white/20 md:hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-end p-6 border-b border-white/10">
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors p-2"
            aria-label="Cerrar menú"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>
        </div>

        <div className="flex flex-col h-full px-8 py-8">
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-black text-white hover:text-gray-200 uppercase tracking-widest border-b border-white/5 pb-2">
              Inicio
            </Link>
            <Link href="/nuestros-entrenadores" onClick={() => setIsOpen(false)} className="text-lg font-black text-white hover:text-gray-200 uppercase tracking-widest border-b border-white/5 pb-2">
              Entrenadores
            </Link>
            <Link href="/semblanza-master-francisco-ramirez" onClick={() => setIsOpen(false)} className="text-lg font-black text-white hover:text-gray-200 uppercase tracking-widest border-b border-white/5 pb-2">
              Head Coach
            </Link>
            <Link href="/costos-y-horarios" onClick={() => setIsOpen(false)} className="text-lg font-black text-white hover:text-gray-200 uppercase tracking-widest border-b border-white/5 pb-2">
              Costos y Horarios
            </Link>
            <Link href="/reglamento" onClick={() => setIsOpen(false)} className="text-lg font-black text-white hover:text-gray-200 uppercase tracking-widest border-b border-white/5 pb-2">
              Reglamento
            </Link>

            <div className="pt-4">
              {user ? (
                <div className="flex flex-col space-y-4">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-base font-bold text-white hover:text-gray-200 uppercase tracking-widest">
                    Mi Cuenta
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setIsOpen(false)} className="text-base font-bold text-white hover:text-gray-200 uppercase tracking-widest">
                      Admin
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="text-base font-bold text-white hover:text-gray-200 uppercase tracking-widest text-left">
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="text-base font-bold text-white hover:text-gray-200 uppercase tracking-widest block">
                  Iniciar Sesión
                </Link>
              )}
            </div>

            <Link
              href="#contacto"
              onClick={() => setIsOpen(false)}
              className="bg-white text-primary text-center py-3 font-black uppercase tracking-widest text-lg mt-auto mb-8 rounded-sm hover:bg-gray-100 transition-colors"
            >
              Entrenar Ahora
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
