-- ────────────────────────────────────────────────────────────
-- RescueMind AI — RLS Policy Fix Migration
-- ────────────────────────────────────────────────────────────
-- Run this in your Supabase SQL Editor AFTER the main schema.
--
-- Fixes two workflow-breaking bugs:
--   1. Anonymous citizens CAN'T insert reports (RLS blocks NULL = NULL)
--   2. Admins CAN'T see other users' reports (RLS restricts to own user_id)
--
-- How to apply:
--   Supabase Dashboard → SQL Editor → Paste and run
-- ────────────────────────────────────────────────────────────

-- ── Step 1: Drop the overly restrictive policies ─────────

DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can insert their own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.reports;

-- ── Step 2: Create proper policies ────────────────────────

-- 2a. Anyone can insert a report (citizens don't need to log in)
--     This is safe because the API route validates input before reaching the DB.
CREATE POLICY "Anyone can submit reports"
  ON public.reports FOR INSERT
  WITH CHECK (true);

-- 2b. Users can view their own reports
--     Admins can view ALL reports (for the admin dashboard)
--     Using profiles.role check ensures only designated admins see everything
CREATE POLICY "Users can view reports"
  ON public.reports FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2c. Users can update their own reports (change status)
--     Admins can update ANY report (for the admin dashboard)
CREATE POLICY "Users can update reports"
  ON public.reports FOR UPDATE
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── Step 3: Verify the policies ──────────────────────────
-- Run: SELECT * FROM pg_policies WHERE tablename = 'reports';
-- Expected: 3 policies (INSERT, SELECT, UPDATE) with correct conditions

-- ── Step 4: Profiles table read policy for admin role check ──
-- The admin API needs to query profiles to check the user's role.
-- The existing policy "Users can view their own profile" already allows
-- authenticated users to see their own profile, which is sufficient.
-- No changes needed for profiles table.

-- ── End of Migration ──────────────────────────────────────
