"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const isAdmin = useIsAdmin();
  const pathname = usePathname();

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

  const isActive = (path: string) => pathname === path;
  const getLinkClasses = (path: string, mobile = false) => {
    const baseClasses = mobile
      ? "text-lg font-black uppercase tracking-widest border-b border-white/5 pb-2 hover:text-gray-200"
      : "text-xs font-bold hover:text-primary transition-colors uppercase tracking-widest";

    const activeClasses = mobile
      ? "text-primary border-primary" // Mobile active
      : "text-primary"; // Desktop active

    const inactiveClasses = mobile
      ? "text-white"
      : "text-gray-300";

    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

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
              <Link href="/" className={getLinkClasses("/")}>
                Inicio
              </Link>
              <Link href="/nuestros-entrenadores" className={getLinkClasses("/nuestros-entrenadores")}>
                Entrenadores
              </Link>
              <Link href="/semblanza-master-francisco-ramirez" className={getLinkClasses("/semblanza-master-francisco-ramirez")}>
                Head Coach
              </Link>
              <Link href="/costos-y-horarios" className={getLinkClasses("/costos-y-horarios")}>
                Costos y Horarios
              </Link>
              <Link href="/reglamento" className={getLinkClasses("/reglamento")}>
                Reglamento
              </Link>


              {/* Auth Section */}
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/dashboard"
                    className={getLinkClasses("/dashboard")}
                  >
                    Mi Cuenta
                  </Link>
                  {isAdmin && (
                    <div className="relative group">
                      <Link
                        href="/admin"
                        className={`flex items-center gap-1 ${getLinkClasses(
                          "/admin"
                        )}`}
                      >
                        Admin
                        <ChevronDownIcon className="h-3 w-3" />
                      </Link>

                      {/* Dropdown menu */}
                      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50 min-w-[200px]">
                        <div className="bg-neutral-900 border border-white/10 rounded-lg shadow-xl overflow-hidden backdrop-blur-md">
                          <Link
                            href="/admin/users"
                            className="block px-4 py-3 text-xs font-bold text-gray-300 hover:text-primary hover:bg-white/5 transition-colors uppercase tracking-wider"
                          >
                            Gestión de Usuarios
                          </Link>
                          <Link
                            href="/admin/responsivas"
                            className="block px-4 py-3 text-xs font-bold text-gray-300 hover:text-primary hover:bg-white/5 transition-colors uppercase tracking-wider border-t border-white/5"
                          >
                            Gestión de Responsivas
                          </Link>
                          <Link
                            href="/admin/pagos"
                            className="block px-4 py-3 text-xs font-bold text-gray-300 hover:text-primary hover:bg-white/5 transition-colors uppercase tracking-wider border-t border-white/5"
                          >
                            Gestión de Pagos
                          </Link>
                        </div>
                      </div>
                    </div>
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
                  className={getLinkClasses("/auth/login")}
                >
                  Login
                </Link>
              )}
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
        className={`fixed top-0 bottom-0 right-0 w-1/2 bg-neutral-900 z-[101] shadow-2xl transform transition-transform duration-300 ease-out border-l-4 border-primary md:hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
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
            <Link href="/" onClick={() => setIsOpen(false)} className={getLinkClasses("/", true)}>
              Inicio
            </Link>
            <Link href="/nuestros-entrenadores" onClick={() => setIsOpen(false)} className={getLinkClasses("/nuestros-entrenadores", true)}>
              Entrenadores
            </Link>
            <Link href="/semblanza-master-francisco-ramirez" onClick={() => setIsOpen(false)} className={getLinkClasses("/semblanza-master-francisco-ramirez", true)}>
              Head Coach
            </Link>
            <Link href="/costos-y-horarios" onClick={() => setIsOpen(false)} className={getLinkClasses("/costos-y-horarios", true)}>
              Costos y Horarios
            </Link>
            <Link href="/reglamento" onClick={() => setIsOpen(false)} className={getLinkClasses("/reglamento", true)}>
              Reglamento
            </Link>

            <div className="pt-4">
              {user ? (
                <div className="flex flex-col space-y-4">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className={getLinkClasses("/dashboard", true)}>
                    Mi Cuenta
                  </Link>
                  {isAdmin && (
                    <div className="flex flex-col space-y-4">
                      <Link href="/admin" onClick={() => setIsOpen(false)} className={getLinkClasses("/admin", true)}>
                        Admin
                      </Link>
                      <div className="pl-4 flex flex-col space-y-4 border-l-2 border-white/10 ml-1">
                        <Link
                          href="/admin/users"
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-bold text-gray-400 hover:text-primary uppercase tracking-widest pl-4"
                        >
                          Gestión de Usuarios
                        </Link>
                        <Link
                          href="/admin/responsivas"
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-bold text-gray-400 hover:text-primary uppercase tracking-widest pl-4"
                        >
                          Gestión de Responsivas
                        </Link>
                        <Link
                          href="/admin/pagos"
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-bold text-gray-400 hover:text-primary uppercase tracking-widest pl-4"
                        >
                          Gestión de Pagos
                        </Link>
                      </div>
                    </div>
                  )}
                  <button onClick={handleSignOut} className="text-base font-bold text-white hover:text-gray-200 uppercase tracking-widest text-left mt-4 border-t border-white/10 pt-4">
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className={getLinkClasses("/auth/login", true)}>
                  Iniciar Sesión
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
