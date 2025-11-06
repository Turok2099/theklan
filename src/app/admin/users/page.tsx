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
}

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string>("");
  const [editingVerification, setEditingVerification] =
    useState<boolean>(false);
  const [editingName, setEditingName] = useState<string>("");

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

  const handleEditUser = (
    userId: string,
    currentRole: string,
    currentVerification: boolean,
    currentName: string
  ) => {
    setEditingUser(userId);
    setEditingRole(currentRole);
    setEditingVerification(currentVerification);
    setEditingName(currentName);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditingRole("");
    setEditingVerification(false);
    setEditingName("");
  };

  const handleSaveUser = async (userId: string, userEmail: string) => {
    try {
      console.log(`💾 Guardando cambios para usuario: ${userEmail}`);

      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          userEmail,
          role: editingRole,
          email_verified: editingVerification,
          nombre: editingName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Error ${response.status}: ${response.statusText}`
        );
      }

      console.log("✅ Usuario actualizado exitosamente");

      await fetchData();
      handleCancelEdit();

      alert("Usuario actualizado exitosamente");
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
          <Link
            href="/admin"
            className="inline-flex items-center text-red-600 hover:text-red-700 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Total de usuarios registrados: <strong>{users.length}</strong>
          </p>
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
                    Verificación
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
                      {editingUser === userItem.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="px-3 py-2 border-2 border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full max-w-xs transition-all"
                          placeholder="Nombre completo"
                        />
                      ) : (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {(userItem.nombre || "SN").charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {userItem.nombre || "Sin nombre"}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-700 truncate max-w-xs">
                        {userItem.email}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {editingUser === userItem.id ? (
                        <select
                          value={editingRole}
                          onChange={(e) => setEditingRole(e.target.value)}
                          className="px-3 py-2 border-2 border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium transition-all"
                        >
                          <option value="student">Student</option>
                          <option value="coach">Coach</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
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
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {editingUser === userItem.id ? (
                        <select
                          value={
                            editingVerification ? "verified" : "not-verified"
                          }
                          onChange={(e) =>
                            setEditingVerification(
                              e.target.value === "verified"
                            )
                          }
                          className="px-3 py-2 border-2 border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium transition-all"
                        >
                          <option value="not-verified">No Verificado</option>
                          <option value="verified">Verificado</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg ${
                            userItem.email_verified
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-red-100 text-red-800 border border-red-300"
                          }`}
                        >
                          {userItem.email_verified
                            ? "✓ Verificado"
                            : "✕ No Verificado"}
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
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        {editingUser === userItem.id ? (
                          <>
                            <button
                              onClick={() =>
                                handleSaveUser(userItem.id, userItem.email)
                              }
                              className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
                              style={{
                                color: "#ffffff",
                                backgroundColor: "#16a34a",
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span style={{ color: "#ffffff" }}>Guardar</span>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors shadow-sm"
                              style={{
                                color: "#ffffff",
                                backgroundColor: "#4b5563",
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              <span style={{ color: "#ffffff" }}>Cancelar</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                handleEditUser(
                                  userItem.id,
                                  userItem.role,
                                  userItem.email_verified || false,
                                  userItem.nombre || ""
                                )
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              <span style={{ color: "#ffffff" }}>Editar</span>
                            </button>
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
                          </>
                        )}
                      </div>
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
