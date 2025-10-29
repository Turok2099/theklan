"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

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

export default function AdminDashboard() {
  const { user } = useAuth();
  const [responsivas, setResponsivas] = useState<ResponsivaData[]>([]);
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
      console.log("🔍 Iniciando carga de datos del admin dashboard...");

      // Usar la nueva API route que maneja la lógica del servidor
      const response = await fetch("/api/admin/users");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ Datos obtenidos de API:", {
        totalUsers: data.totalUsers,
        totalResponsivas: data.totalResponsivas,
      });

      setResponsivas(data.responsivas || []);
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

  const downloadResponsiva = async (responsivaId: string) => {
    try {
      console.log("📄 Descargando responsiva:", responsivaId);

      const response = await fetch(`/api/pdf?id=${responsivaId}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Crear blob y descargar
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

      // Recargar los datos
      await fetchData();

      // Cancelar edición
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

      // Recargar los datos
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "coach":
        return "bg-purple-100 text-purple-800";
      case "student":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
          <p className="text-gray-600">Cargando datos...</p>
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
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Administración
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Gestiona usuarios y responsivas del sistema
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-3 md:ml-4 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                  Total Usuarios
                </p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-3 md:ml-4 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                  Emails Verificados
                </p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">
                  {users.filter((u) => u.email_verified).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-3 md:ml-4 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                  Responsivas Completadas
                </p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">
                  {users.filter((u) => u.responsiva_status?.isCompleted).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3 md:ml-4 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                  Responsivas Firmadas
                </p>
                <p className="text-xl md:text-2xl font-semibold text-gray-900">
                  {users.filter((u) => u.responsiva_status?.isSigned).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Usuarios Registrados
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verificación
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem.id}>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      {editingUser === userItem.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xs"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#374151",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            borderRadius: "0.375rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem 0.5rem",
                          }}
                          placeholder="Nombre completo"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {userItem.nombre || "Sin nombre"}
                        </div>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 truncate max-w-xs">
                        {userItem.email}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      {editingUser === userItem.id ? (
                        <select
                          value={editingRole}
                          onChange={(e) => setEditingRole(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-24"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#374151",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            borderRadius: "0.375rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem 0.5rem",
                          }}
                        >
                          <option value="student">Student</option>
                          <option value="coach">Coach</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                            userItem.role
                          )}`}
                        >
                          {userItem.role}
                        </span>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
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
                          className="px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-32"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#374151",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            borderRadius: "0.375rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem 0.5rem",
                          }}
                        >
                          <option value="not-verified">No Verificado</option>
                          <option value="verified">Verificado</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            userItem.email_verified
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {userItem.email_verified
                            ? "Verificado"
                            : "No Verificado"}
                        </span>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      {userItem.id !== user?.id && (
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          {editingUser === userItem.id ? (
                            <>
                              <button
                                onClick={() =>
                                  handleSaveUser(userItem.id, userItem.email)
                                }
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                style={{
                                  backgroundColor: "#10b981",
                                  color: "#ffffff",
                                  padding: "0.25rem 0.5rem",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                  borderRadius: "0.375rem",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#059669";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#10b981";
                                }}
                              >
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Guardar
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                style={{
                                  backgroundColor: "#6b7280",
                                  color: "#ffffff",
                                  padding: "0.25rem 0.5rem",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                  borderRadius: "0.375rem",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#4b5563";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#6b7280";
                                }}
                              >
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                Cancelar
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
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                style={{
                                  backgroundColor: "#3b82f6",
                                  color: "#ffffff",
                                  padding: "0.25rem 0.5rem",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                  borderRadius: "0.375rem",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#2563eb";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#3b82f6";
                                }}
                              >
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Editar
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteUser(userItem.id, userItem.email)
                                }
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                style={{
                                  backgroundColor: "#dc2626",
                                  color: "#ffffff",
                                  padding: "0.25rem 0.5rem",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                  borderRadius: "0.375rem",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#b91c1c";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#dc2626";
                                }}
                              >
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Responsivas Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Responsivas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responsivas.map((responsiva) => (
                  <tr key={responsiva.id}>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {responsiva.nombre} {responsiva.apellido_paterno}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="truncate max-w-xs">
                        {responsiva.email}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {responsiva.telefono}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          responsiva.acepta_terminos &&
                          responsiva.acepta_aviso_privacidad
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {responsiva.acepta_terminos &&
                        responsiva.acepta_aviso_privacidad
                          ? "Completada"
                          : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(responsiva.created_at)}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => downloadResponsiva(responsiva.id)}
                        className="text-blue-600 hover:text-blue-900 transition-colors text-xs md:text-sm"
                      >
                        📄 Descargar PDF
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
