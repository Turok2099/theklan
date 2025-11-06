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
    
    // Preparar datos a actualizar
    const updateData: {
      role: string;
      updated_at: string;
      profile_data?: { nombre?: string };
    } = {
      role: role,
      updated_at: new Date().toISOString(),
    };

    // Si se proporciona nombre, actualizarlo en profile_data
    if (nombre !== undefined) {
      // Obtener datos actuales del usuario para no sobrescribir otros campos de profile_data
      const { data: currentUser } = await supabase
        .from("users")
        .select("profile_data")
        .eq("id", userId)
        .single();

      const profileData = (currentUser?.profile_data as { nombre?: string } | null) || {};
      profileData.nombre = nombre;
      updateData.profile_data = profileData;
    }

    const { error: usersError } = await supabase
      .from("users")
      .update(updateData)
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

export async function GET() {
  try {
    console.log("🔍 API /api/admin/users - Iniciando...");

    const supabase = createServiceClient();

    const PLAN_VALUE_TO_LABEL: Record<string, string> = {
      basic: "Basic",
      full: "Full Jiu Jitsu",
      unlimited: "Ilimitado",
    };

    const PLAN_VALUE_TO_AMOUNT: Record<string, number> = {
      basic: 145000,
      full: 165000,
      unlimited: 199000,
    };

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

    // Obtener pagos para obtener suscripciones
    console.log("📋 Obteniendo pagos para calcular suscripciones...");
    const { data: paymentsData, error: paymentsError } = await supabase
      .from("payments")
      .select("*")
      .eq("payment_type", "subscription")
      .eq("status", "succeeded")
      .order("paid_at", { ascending: false });

    if (paymentsError) {
      console.warn("⚠️ Error obteniendo pagos:", paymentsError.message);
      // No lanzar error, continuar sin datos de suscripción
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

    const getUserSubscriptionFromPayments = (userId: string) => {
      if (!paymentsData) return null;

      const now = new Date();

      const userPayments = paymentsData
        .filter((p) => p.user_id === userId && p.payment_type === "subscription")
        .sort((a, b) => {
          const dateA = a.paid_at || a.created_at;
          const dateB = b.paid_at || b.created_at;
          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

      if (userPayments.length === 0) return null;

      const latestPayment = userPayments[0];

      // Si el registro más reciente es una cancelación (monto 0), no hay suscripción
      if (latestPayment.amount === 0) {
        return null;
      }

      const planNames: Record<number, string> = {
        145000: "Basic",
        165000: "Full Jiu Jitsu",
        199000: "Ilimitado",
      };

      const activeSubscription = userPayments.find((p) => {
        if (p.amount === 0) return false;

        const paidDate = new Date(p.paid_at || p.created_at);
        const expirationDate = p.subscription_end_date
          ? new Date(p.subscription_end_date)
          : new Date(paidDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        return expirationDate > now;
      });

      if (activeSubscription) {
        const paidDate = new Date(activeSubscription.paid_at || activeSubscription.created_at);
        const expirationDate = activeSubscription.subscription_end_date
          ? new Date(activeSubscription.subscription_end_date)
          : new Date(paidDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        return {
          plan: planNames[activeSubscription.amount] || "Personalizado",
          amount: activeSubscription.amount,
          isActive: true,
          startDate: paidDate.toISOString(),
          endDate: expirationDate.toISOString(),
          paymentMethod: activeSubscription.payment_method || "stripe",
          source: "payments" as const,
        };
      }

      // Si no hay activa, tomar la más reciente (expirada)
      const paidDate = new Date(latestPayment.paid_at || latestPayment.created_at);
      const expirationDate = latestPayment.subscription_end_date
        ? new Date(latestPayment.subscription_end_date)
        : new Date(paidDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      return {
        plan: planNames[latestPayment.amount] || "Personalizado",
        amount: latestPayment.amount,
        isActive: false,
        startDate: paidDate.toISOString(),
        endDate: expirationDate.toISOString(),
        paymentMethod: latestPayment.payment_method || "stripe",
        source: "payments" as const,
      };
    };

    // Combinar datos de usuarios con información de auth, responsivas y suscripciones
    const usersWithDetails = usersData.map((user) => {
      // Buscar información de auth.users - usar la misma lógica que AuthContext
      const authUser = authUsers?.users.find((au) => au.id === user.id);

      // Buscar responsiva del usuario
      const userResponsiva = responsivasData.find(
        (r) => r.email === user.email
      );

      const now = new Date();
      let subscription = null;
      let subscriptionSource: "manual" | "payments" | "none" = "none";

      if (user.subscription_override_plan) {
        const planValue = user.subscription_override_plan as string;
        const planLabel = PLAN_VALUE_TO_LABEL[planValue] || planValue;
        const amount = PLAN_VALUE_TO_AMOUNT[planValue] || 0;
        const expiresAt = user.subscription_override_expires_at
          ? new Date(user.subscription_override_expires_at)
          : null;
        const startDate = expiresAt
          ? new Date(expiresAt.getTime() - 30 * 24 * 60 * 60 * 1000)
          : now;

        subscription = {
          plan: planLabel,
          amount,
          isActive: !expiresAt || expiresAt > now,
          startDate: startDate.toISOString(),
          endDate: expiresAt ? expiresAt.toISOString() : null,
          paymentMethod: "manual_override",
          source: "manual" as const,
        };
        subscriptionSource = "manual";
      } else {
        const paymentSubscription = getUserSubscriptionFromPayments(user.id);
        if (paymentSubscription) {
          subscription = paymentSubscription;
          subscriptionSource = "payments";
        }
      }

      // Usar la misma lógica de verificación que AuthContext
      const email_verified = !!authUser?.email_confirmed_at;

      console.log(`🔍 Usuario ${user.email}:`, {
        authUserFound: !!authUser,
        authUserId: authUser?.id,
        email_confirmed_at: authUser?.email_confirmed_at,
        confirmed_at: authUser?.confirmed_at,
        email_verified: email_verified,
        hasSubscription: !!subscription,
        subscriptionActive: subscription?.isActive,
        timestamp: new Date().toISOString(),
      });

      // Extraer nombre de profile_data (igual que en dashboard)
      const profileData = user.profile_data as { nombre?: string } | null;
      const nombre = profileData?.nombre || "";

      return {
        ...user,
        email_verified: email_verified,
        nombre: nombre,
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
        subscription,
        subscription_source: subscriptionSource,
        subscription_override: user.subscription_override_plan
          ? {
              plan_value: user.subscription_override_plan,
              plan_label:
                PLAN_VALUE_TO_LABEL[user.subscription_override_plan] ||
                user.subscription_override_plan,
              expires_at: user.subscription_override_expires_at,
              updated_by: user.subscription_override_updated_by,
            }
          : null,
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
