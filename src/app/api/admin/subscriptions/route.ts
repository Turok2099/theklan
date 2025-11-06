import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase-server";
import type { SupabaseClient } from "@supabase/supabase-js";

const PLAN_LABELS: Record<string, string> = {
  basic: "Basic",
  full: "Full Jiu Jitsu",
  unlimited: "Ilimitado",
};

const VALID_PLAN_VALUES = Object.keys(PLAN_LABELS);

async function ensureAdmin(supabase: SupabaseClient) {
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return { error: "No autorizado", status: 401 as const };
  }

  const { data: userData, error: roleError } = await supabase
    .from("users")
    .select("role")
    .eq("id", authUser.id)
    .single();

  if (roleError || userData?.role !== "admin") {
    return { error: "Acceso denegado. Se requiere rol de administrador.", status: 403 as const };
  }

  return { authUser };
}

export async function POST(request: Request) {
  try {
    const supabaseAuth = await createServerSupabaseClient();
    const authResult = await ensureAdmin(supabaseAuth);

    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { userId, plan } = await request.json();

    if (!userId || !plan) {
      return NextResponse.json(
        { error: "userId y plan son requeridos" },
        { status: 400 }
      );
    }

    if (!VALID_PLAN_VALUES.includes(plan)) {
      return NextResponse.json(
        { error: "Plan inválido" },
        { status: 400 }
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const service = createServiceClient();

    const { error: updateError } = await service
      .from("users")
      .update({
        subscription_override_plan: plan,
        subscription_override_expires_at: expiresAt.toISOString(),
        subscription_override_updated_by: authResult.authUser!.id,
      })
      .eq("id", userId);

    if (updateError) {
      console.error("❌ Error actualizando override de suscripción:", updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      subscription: {
        userId,
        plan,
        planLabel: PLAN_LABELS[plan],
        expiresAt: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ API /api/admin/subscriptions POST:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al actualizar la suscripción",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabaseAuth = await createServerSupabaseClient();
    const authResult = await ensureAdmin(supabaseAuth);

    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId es requerido" },
        { status: 400 }
      );
    }

    const service = createServiceClient();

    const { error: updateError } = await service
      .from("users")
      .update({
        subscription_override_plan: null,
        subscription_override_expires_at: null,
        subscription_override_updated_by: null,
      })
      .eq("id", userId);

    if (updateError) {
      console.error("❌ Error eliminando override de suscripción:", updateError);
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ API /api/admin/subscriptions DELETE:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al eliminar la suscripción",
      },
      { status: 500 }
    );
  }
}
