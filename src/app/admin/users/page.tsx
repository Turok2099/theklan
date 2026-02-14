"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
  Users,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Shield,
  Mail,
  Calendar,
  FileText,
  CreditCard,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  email_verified?: boolean;
  nombre?: string;
  apellido_paterno?: string;
  responsiva_status?: {
    hasResponsiva: boolean;
    isCompleted: boolean;
    isSigned: boolean;
  };
  subscription?: {
    plan: string;
    amount: number;
    isActive: boolean;
    startDate: string;
    endDate: string;
    paymentMethod: string;
  } | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UsersPage() {
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

  const users: UserData[] = data?.users || [];
  const error = apiError ? (apiError instanceof Error ? apiError.message : "Error cargando datos") : null;
  const loading = isLoading;

  const [editingField, setEditingField] = useState<{
    userId: string;
    field: "nombre" | "email" | "role";
  } | null>(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    email: "",
    role: "",
  });

  const handleEditField = (
    userId: string,
    field: "nombre" | "email" | "role",
    currentValue: string
  ) => {
    setEditingField({ userId, field });

    setEditForm({
      nombre: field === "nombre" ? currentValue : "",
      email: field === "email" ? currentValue : "",
      role: field === "role" ? currentValue : "",
    });
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditForm({
      nombre: "",
      email: "",
      role: "",
    });
  };

  const handleSaveField = async (userId: string, userEmail: string) => {
    if (!editingField) return;

    try {
      console.log(
        `💾 Guardando ${editingField.field} para usuario: ${userEmail}`
      );

      const body: {
        userId: string;
        userEmail: string;
        role?: string;
        nombre?: string;
      } = {
        userId,
        userEmail,
      };

      if (editingField.field === "nombre") {
        body.nombre = editForm.nombre;
      } else if (editingField.field === "role") {
        body.role = editForm.role;
      }

      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Error ${response.status}: ${response.statusText}`
        );
      }

      console.log("✅ Usuario actualizado exitosamente");
      alert("Usuario actualizado exitosamente");

      mutate("/api/admin/users");
      handleCancelEdit();
    } catch (error) {
      console.error("❌ Error actualizando usuario:", error);
      alert(
        `Error al actualizar usuario: ${error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar al usuario ${userEmail}? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      console.log(`🗑️ Eliminando usuario: ${userEmail} (${userId})`);

      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, userEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Error ${response.status}: ${response.statusText}`
        );
      }

      console.log("✅ Usuario eliminado exitosamente");

      mutate("/api/admin/users");

      alert("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("❌ Error eliminando usuario:", error);
      alert(
        `Error al eliminar usuario: ${error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      case "coach":
        return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
      case "student":
        return "bg-green-500/20 text-green-300 border border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
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
          <p className="text-gray-400">Cargando usuarios...</p>
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
              <Users className="h-8 w-8 text-primary" />
              Gestión de Usuarios
            </h1>
            <p className="text-gray-400">
              Administra los usuarios, roles y estados de suscripción.
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

        {/* Users Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/20">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Usuarios Registrados
              <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full border border-primary/30">
                {users.length}
              </span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-black/40">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Suscripción
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Responsiva
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((userItem) => (
                  <tr
                    key={userItem.id}
                    className="hover:bg-white/5 transition-colors duration-150"
                  >

                    <td className="px-6 py-5 whitespace-nowrap">
                      {editingField?.userId === userItem.id &&
                        editingField?.field === "nombre" ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editForm.nombre}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                nombre: e.target.value,
                              })
                            }
                            className="px-3 py-2 border-2 border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full max-w-xs transition-all"
                            placeholder="Nombre completo"
                            autoFocus
                          />
                          <button
                            onClick={() =>
                              handleSaveField(userItem.id, userItem.email)
                            }
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                            title="Guardar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {(userItem.nombre || "SN").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white">
                              {userItem.nombre || "Sin nombre"}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleEditField(
                                userItem.id,
                                "nombre",
                                userItem.nombre || ""
                              )
                            }
                            className="text-gray-500 hover:text-primary transition-colors"
                            title="Editar nombre"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-400 truncate max-w-xs">
                          {userItem.email}
                        </div>
                        {userItem.email_verified ? (
                          <span title="Email verificado">
                            <svg
                              className="w-5 h-5 text-green-600 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        ) : (
                          <span title="Email no verificado">
                            <svg
                              className="w-5 h-5 text-red-600 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {editingField?.userId === userItem.id &&
                        editingField?.field === "role" ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editForm.role}
                            onChange={(e) =>
                              setEditForm({ ...editForm, role: e.target.value })
                            }
                            className="px-3 py-2 border-2 border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium transition-all"
                            autoFocus
                          >
                            <option value="student">Student</option>
                            <option value="coach">Coach</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() =>
                              handleSaveField(userItem.id, userItem.email)
                            }
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-green-300 bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            title="Guardar"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Cancelar"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg ${getRoleBadgeColor(
                              userItem.role
                            )}`}
                          >
                            {userItem.role === "admin" && "👑 "}
                            {userItem.role === "coach" && "🥋 "}
                            {userItem.role === "student" && "🎓 "}
                            {userItem.role.toUpperCase()}
                          </span>
                          <button
                            onClick={() =>
                              handleEditField(
                                userItem.id,
                                "role",
                                userItem.role
                              )
                            }
                            className="text-gray-500 hover:text-primary transition-colors"
                            title="Editar rol"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {userItem.subscription ? (
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg ${userItem.subscription.isActive
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                              }`}
                          >
                            {userItem.subscription.plan}
                          </span>
                          <span className="text-xs text-gray-500">
                            Expira: {new Date(userItem.subscription.endDate).toLocaleDateString("es-MX")}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-500/20 text-gray-400 border border-gray-500/30">
                          Sin suscripción
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg ${userItem.responsiva_status?.isCompleted
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          }`}
                      >
                        {userItem.responsiva_status?.isCompleted
                          ? "✓ Completada"
                          : "⏳ Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleDeleteUser(userItem.id, userItem.email)
                        }
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
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
