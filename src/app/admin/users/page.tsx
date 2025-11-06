"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

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

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{
    userId: string;
    field: "nombre" | "email" | "role";
  } | null>(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    email: "",
    role: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔍 Cargando usuarios...");

      const response = await fetch("/api/admin/users");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ Usuarios obtenidos:", data.totalUsers);

      setUsers(data.users || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user, fetchData]);

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

      await fetchData();
      handleCancelEdit();
    } catch (error) {
      console.error("❌ Error actualizando usuario:", error);
      alert(
        `Error al actualizar usuario: ${
          error instanceof Error ? error.message : "Error desconocido"
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

      await fetchData();

      alert("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("❌ Error eliminando usuario:", error);
      alert(
        `Error al eliminar usuario: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "coach":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      case "student":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  // Mostrar loading mientras el auth se está cargando
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Ahora sí verificar el rol después de que terminó de cargar
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Header con botón de regreso */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Gestión de Usuarios
            </h1>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap"
              style={{
                color: "#ffffff",
                backgroundColor: "#dc2626",
                border: "none",
                outline: "none",
              }}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ stroke: "#ffffff" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span style={{ color: "#ffffff" }}>Volver al Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Usuarios Registrados
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Suscripción
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Responsiva
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((userItem) => (
                  <tr
                    key={userItem.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
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
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {(userItem.nombre || "SN").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">
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
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Editar nombre"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-700 truncate max-w-xs">
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
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Editar rol"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {userItem.subscription ? (
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg ${
                              userItem.subscription.isActive
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-red-100 text-red-800 border border-red-300"
                            }`}
                          >
                            {userItem.subscription.plan}
                          </span>
                          <span className="text-xs text-gray-500">
                            Expira: {new Date(userItem.subscription.endDate).toLocaleDateString("es-MX")}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-600 border border-gray-300">
                          Sin suscripción
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg ${
                          userItem.responsiva_status?.isCompleted
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-300"
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
                        className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
                        style={{
                          color: "#ffffff",
                          backgroundColor: "#dc2626",
                          padding: "0.5rem 0.75rem",
                          border: "none",
                          outline: "none",
                          borderRadius: "0.5rem",
                          fontWeight: "600",
                        }}
                      >
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ stroke: "#ffffff" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span style={{ color: "#ffffff" }}>Eliminar</span>
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
