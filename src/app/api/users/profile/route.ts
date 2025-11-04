import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const body = await request.json();

    // Verificar autenticación
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { email, password, nombre } = body;

    // Actualizar email si se proporciona
    if (email && email !== authUser.email) {
      const { error: updateEmailError } = await supabase.auth.updateUser({
        email: email,
      });

      if (updateEmailError) {
        return NextResponse.json(
          { error: `Error al actualizar email: ${updateEmailError.message}` },
          { status: 400 }
        );
      }
    }

    // Actualizar contraseña si se proporciona
    if (password) {
      const { error: updatePasswordError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updatePasswordError) {
        return NextResponse.json(
          { error: `Error al actualizar contraseña: ${updatePasswordError.message}` },
          { status: 400 }
        );
      }
    }

    // Actualizar nombre en la tabla users (en profile_data)
    if (nombre !== undefined) {
      // Obtener datos actuales del usuario
      const { data: currentUser } = await supabase
        .from("users")
        .select("profile_data")
        .eq("id", authUser.id)
        .single();

      const profileData = currentUser?.profile_data || {};
      profileData.nombre = nombre;

      // Actualizar en la tabla users
      const { error: updateProfileError } = await supabase
        .from("users")
        .update({
          profile_data: profileData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", authUser.id);

      if (updateProfileError) {
        // Si no existe en users, crearlo
        const { error: insertError } = await supabase.from("users").insert({
          id: authUser.id,
          email: authUser.email || email,
          role: "student",
          is_active: true,
          profile_data: { nombre },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          return NextResponse.json(
            { error: `Error al actualizar nombre: ${insertError.message}` },
            { status: 400 }
          );
        }
      }
    }

    // Refrescar sesión si se cambió el email
    if (email && email !== authUser.email) {
      await supabase.auth.refreshSession();
    }

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

