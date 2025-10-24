import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function PUT(request: NextRequest) {
  try {
    console.log("💾 API /api/admin/users PUT - Iniciando...");

    const supabase = createServiceClient();
    const { userId, userEmail, role, email_verified, nombre } =
      await request.json();

    if (!userId || !userEmail || !role) {
      return NextResponse.json(
        { error: "userId, userEmail y role son requeridos" },
        { status: 400 }
      );
    }

    console.log(`💾 Actualizando usuario: ${userEmail} (${userId})`);
    console.log(`📊 Nuevos valores:`, { role, email_verified, nombre });

    // 1. Actualizar en la tabla users
    console.log("📋 Actualizando tabla users...");
    const { error: usersError } = await supabase
      .from("users")
      .update({
        role: role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (usersError) {
      console.error("❌ Error actualizando tabla users:", usersError.message);
      throw new Error(`Error actualizando tabla users: ${usersError.message}`);
    }

    // 2. Actualizar estado de verificación en auth.users usando admin API
    console.log("📋 Actualizando estado de verificación en auth.users...");
    if (email_verified !== undefined) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        {
          email_confirm: email_verified,
        }
      );

      if (authError) {
        console.error("❌ Error actualizando auth.users:", authError.message);
        // No lanzar error aquí, solo loggear, ya que el usuario ya fue actualizado en la tabla users
        console.warn(
          "⚠️ Estado de verificación no actualizado en auth.users, pero usuario actualizado en tabla users"
        );
      }
    }

    console.log("✅ Usuario actualizado exitosamente");

    return NextResponse.json({
      success: true,
      message: "Usuario actualizado exitosamente",
      updatedUserId: userId,
      updatedUserEmail: userEmail,
      newRole: role,
      newEmailVerified: email_verified,
      newNombre: nombre,
    });
  } catch (error) {
    console.error("❌ Error en API /api/admin/users PUT:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ API /api/admin/users DELETE - Iniciando...");

    const supabase = createServiceClient();
    const { userId, userEmail } = await request.json();

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "userId y userEmail son requeridos" },
        { status: 400 }
      );
    }

    console.log(`🗑️ Eliminando usuario: ${userEmail} (${userId})`);

    // 1. Eliminar de la tabla users
    console.log("📋 Eliminando de tabla users...");
    const { error: usersError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (usersError) {
      console.error("❌ Error eliminando de tabla users:", usersError.message);
      throw new Error(`Error eliminando de tabla users: ${usersError.message}`);
    }

    // 2. Eliminar responsivas relacionadas
    console.log("📋 Eliminando responsivas relacionadas...");
    const { error: responsivasError } = await supabase
      .from("responsivas")
      .delete()
      .eq("email", userEmail);

    if (responsivasError) {
      console.error(
        "❌ Error eliminando responsivas:",
        responsivasError.message
      );
      // No lanzar error aquí, solo loggear, ya que el usuario ya fue eliminado
      console.warn("⚠️ Responsivas no eliminadas, pero usuario eliminado");
    }

    // 3. Eliminar de auth.users usando admin API
    console.log("📋 Eliminando de auth.users...");
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error("❌ Error eliminando de auth.users:", authError.message);
      // No lanzar error aquí, solo loggear, ya que el usuario ya fue eliminado de la tabla users
      console.warn(
        "⚠️ Usuario no eliminado de auth.users, pero eliminado de tabla users"
      );
    }

    console.log("✅ Usuario eliminado exitosamente");

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado exitosamente",
      deletedUserId: userId,
      deletedUserEmail: userEmail,
    });
  } catch (error) {
    console.error("❌ Error en API /api/admin/users DELETE:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 API /api/admin/users - Iniciando...");

    const supabase = createServiceClient();

    // Obtener usuarios de la tabla users
    console.log("📋 Obteniendo usuarios de tabla users...");
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (usersError) {
      console.error("❌ Error obteniendo usuarios:", usersError.message);
      throw new Error(`Error obteniendo usuarios: ${usersError.message}`);
    }

    // Obtener responsivas
    console.log("📋 Obteniendo responsivas...");
    const { data: responsivasData, error: responsivasError } = await supabase
      .from("responsivas")
      .select("*");

    if (responsivasError) {
      console.error(
        "❌ Error obteniendo responsivas:",
        responsivasError.message
      );
      throw new Error(
        `Error obteniendo responsivas: ${responsivasError.message}`
      );
    }

    // Obtener información de verificación de email desde auth.users
    console.log("🔍 Obteniendo usuarios de auth.users...");
    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError) {
      console.warn("Error obteniendo usuarios de auth:", authError.message);
    } else {
      console.log(
        `✅ Usuarios de auth obtenidos: ${authUsers?.users.length || 0}`
      );
    }

    // Combinar datos de usuarios con información de auth y responsivas
    const usersWithDetails = usersData.map((user) => {
      // Buscar información de auth.users - usar la misma lógica que AuthContext
      const authUser = authUsers?.users.find((au) => au.id === user.id);

      // Buscar responsiva del usuario
      const userResponsiva = responsivasData.find(
        (r) => r.email === user.email
      );

      // Usar la misma lógica de verificación que AuthContext
      const email_verified = !!authUser?.email_confirmed_at;

      console.log(`🔍 Usuario ${user.email}:`, {
        authUserFound: !!authUser,
        authUserId: authUser?.id,
        email_confirmed_at: authUser?.email_confirmed_at,
        confirmed_at: authUser?.confirmed_at,
        email_verified: email_verified,
        timestamp: new Date().toISOString(),
      });

      return {
        ...user,
        email_verified: email_verified,
        nombre: user.nombre || "",
        apellido_paterno: userResponsiva?.apellido_paterno || "",
        responsiva_status: {
          hasResponsiva: !!userResponsiva,
          isCompleted: userResponsiva
            ? userResponsiva.acepta_terminos &&
              userResponsiva.acepta_aviso_privacidad
            : false,
          isSigned: !!(
            userResponsiva?.firma_digital && userResponsiva?.fecha_firma
          ),
        },
      };
    });

    // Ordenar usuarios por rol: Admin → Coach → Student
    const sortedUsers = usersWithDetails.sort((a, b) => {
      const roleOrder = { admin: 0, coach: 1, student: 2 };
      const aOrder = roleOrder[a.role as keyof typeof roleOrder] ?? 999;
      const bOrder = roleOrder[b.role as keyof typeof roleOrder] ?? 999;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      // Si tienen el mismo rol, ordenar por fecha de creación (más recientes primero)
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    console.log(
      `✅ API /api/admin/users - Completado: ${sortedUsers.length} usuarios procesados`
    );

    return NextResponse.json({
      users: sortedUsers,
      responsivas: responsivasData || [],
      totalUsers: sortedUsers.length,
      totalResponsivas: responsivasData?.length || 0,
    });
  } catch (error) {
    console.error("❌ Error en API /api/admin/users:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
