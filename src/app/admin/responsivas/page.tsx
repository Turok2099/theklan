"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { FileText, Download, ArrowLeft, Loader2, Shield, X } from "lucide-react";

interface ResponsivaData {
  id: string;
  email: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  fecha_nacimiento: string;
  telefono: string;
  contacto_emergencia_nombre: string;
  contacto_emergencia_telefono: string;
  acepta_terminos: boolean;
  acepta_aviso_privacidad: boolean;
  firma_digital?: string;
  fecha_firma?: string;
  created_at: string;
  user_id?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ResponsivasPage() {
  const { user, loading: authLoading } = useAuth();

  const { data, error: apiError, isLoading } = useSWR(
    user?.role === "admin" ? "/api/admin/users" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  const responsivas: ResponsivaData[] = data?.responsivas || [];
  const error = apiError ? (apiError instanceof Error ? apiError.message : "Error cargando datos") : null;
  const loading = isLoading;

  const downloadResponsiva = async (responsivaId: string) => {
    try {
      console.log("📄 Descargando responsiva:", responsivaId);

      const response = await fetch(`/api/pdf?id=${responsivaId}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `responsiva-${responsivaId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log("✅ PDF descargado exitosamente");
    } catch (error) {
      console.error("❌ Error descargando PDF:", error);
      alert("Error al descargar el PDF. Por favor, intenta de nuevo.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Mostrar loading mientras el auth se está cargando
  if (authLoading) {
    return (
      <div className="min-h-screen bg-pure-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Ahora sí verificar el rol después de que terminó de cargar
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-pure-black flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-400">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pure-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando responsivas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pure-black flex items-center justify-center">
        <div className="text-center">
          <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => mutate("/api/admin/users")}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pure-black text-gray-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con botón de regreso */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Gestión de Responsivas
            </h1>
            <p className="text-gray-400">
              Administra y descarga las cartas responsivas de los usuarios.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al Dashboard
          </Link>
        </div>

        {/* Responsivas Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/20">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Responsivas Registradas
              <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full border border-primary/30">
                {responsivas.length}
              </span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-black/40">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {responsivas.map((responsiva) => (
                  <tr key={responsiva.id} className="hover:bg-white/5 transition-colors duration-150">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-white truncate max-w-xs">
                        {responsiva.nombre} {responsiva.apellido_paterno}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                      <div className="truncate max-w-xs">{responsiva.email}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                      {responsiva.telefono}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg ${responsiva.acepta_terminos &&
                            responsiva.acepta_aviso_privacidad
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          }`}
                      >
                        {responsiva.acepta_terminos &&
                          responsiva.acepta_aviso_privacidad
                          ? "Completada"
                          : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(responsiva.created_at)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => downloadResponsiva(responsiva.id)}
                        className="inline-flex items-center text-primary hover:text-red-400 transition-colors gap-2 font-bold"
                      >
                        <Download className="w-4 h-4" />
                        Descargar PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

