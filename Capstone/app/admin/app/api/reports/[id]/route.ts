// ── Admin API: Update Report Status & Notes ──────────────
// PATCH /api/reports/[tracking_id]
// Updates status (pending → in-progress → resolved) and/or appends internal notes.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface Note {
  text: string;
  author: string;
  created_at: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: trackingId } = await params;
    const cookieStore = await cookies();
    const body = await request.json();
    const { status, note } = body;

    // ── Validate ──────────────────────────────────────────

    if (!trackingId) {
      return NextResponse.json({ error: "Tracking ID is required" }, { status: 400 });
    }

    const validStatuses = ["pending", "in-progress", "resolved"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    if (!status && !note) {
      return NextResponse.json(
        { error: "Provide at least a status or a note to update" },
        { status: 400 }
      );
    }

    // ── Auth ──────────────────────────────────────────────

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() { /* read-only on cookies */ },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, email")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ── Get existing report ───────────────────────────────

    const { data: existing, error: fetchError } = await supabase
      .from("reports")
      .select("status, internal_notes")
      .eq("tracking_id", trackingId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // ── Build update payload ──────────────────────────────

    const update: Record<string, unknown> = {};

    if (status) {
      update.status = status;
    }

    if (note && note.trim()) {
      const existingNotes: Note[] = existing.internal_notes || [];
      const newNote: Note = {
        text: note.trim(),
        author: profile.full_name || profile.email || "Admin",
        created_at: new Date().toISOString(),
      };
      update.internal_notes = [...existingNotes, newNote];
    }

    // ── Execute update ────────────────────────────────────

    const { data: updated, error: updateError } = await supabase
      .from("reports")
      .update(update)
      .eq("tracking_id", trackingId)
      .select("id, tracking_id, status, internal_notes, updated_at")
      .single();

    if (updateError) {
      console.error("[Admin API] Update error:", updateError);
      return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
    }

    return NextResponse.json({ report: updated, success: true });
  } catch (err) {
    console.error("[Admin API] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
