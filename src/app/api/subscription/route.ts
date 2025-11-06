import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const PLAN_VALUE_TO_LABEL: Record<string, string> = {
  basic: "Basic",
  full: "Full Jiu Jitsu",
  unlimited: "Ilimitado",
};

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json({ manualSubscription: null });
    }

    const { data, error } = await supabase
      .from("users")
      .select(
        "subscription_override_plan, subscription_override_expires_at, subscription_override_updated_by, updated_at"
      )
      .eq("id", authUser.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("❌ API /api/subscription: Error obteniendo override", error);
      throw error;
    }

    let manualSubscription = null;

    if (data?.subscription_override_plan) {
      manualSubscription = {
        plan_value: data.subscription_override_plan,
        plan_label:
          PLAN_VALUE_TO_LABEL[data.subscription_override_plan] ||
          data.subscription_override_plan,
        expires_at: data.subscription_override_expires_at,
        updated_at: data.updated_at,
      };
    }

    return NextResponse.json({ manualSubscription });
  } catch (error) {
    console.error("❌ API /api/subscription GET:", error);
    return NextResponse.json(
      {
        manualSubscription: null,
        error: error instanceof Error ? error.message : "Error interno",
      },
      { status: 500 }
    );
  }
}
