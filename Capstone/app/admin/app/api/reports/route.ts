// ── Admin API: Get Reports from Supabase ─────────────────
// Used by the admin dashboard to fetch all classified reports.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // ── Admin Supabase client — uses service_role key to bypass RLS ──
    // The anon key + RLS would only return reports where user_id matches
    // the admin's own ID — rendering the dashboard useless.
    // The service_role key bypasses RLS entirely, which is safe here
    // because THIS route is already guarded by middleware + explicit role check.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() { /* read-only route */ },
        },
      }
    );

    // Auth check — protect API from unauthorized access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ reports: [], error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role (profiles table is still RLS-protected, but the
    // admin user can read their own profile, so this works with anon key too)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ reports: [], error: "Forbidden" }, { status: 403 });
    }

    // Optional: filter by single tracking_id (detail page)
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get("tracking_id");

    if (trackingId) {
      const { data: report, error } = await supabase
        .from("reports")
        .select("*")
        .eq("tracking_id", trackingId)
        .single();

      if (error) {
        return NextResponse.json({ report: null, error: "Not found" }, { status: 200 });
      }
      return NextResponse.json({ report });
    }

    const { data: reports, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[Admin API] Supabase error:", error);
      return NextResponse.json({ reports: [], error: error.message }, { status: 200 });
    }

    return NextResponse.json({ reports: reports ?? [] });
  } catch (err) {
    console.error("[Admin API] Unexpected error:", err);
    return NextResponse.json({ reports: [], error: "Internal server error" }, { status: 200 });
  }
}
