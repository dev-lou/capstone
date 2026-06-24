// ────────────────────────────────────────────────────────────
// Supabase Browser Client (for Client Components)
// Uses @supabase/ssr to manage cookies via the browser
// ────────────────────────────────────────────────────────────

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
  );
}
