-- ────────────────────────────────────────────────────────────
-- RescueMind AI — Internal Notes Migration
-- ────────────────────────────────────────────────────────────
-- Adds an `internal_notes` column to the reports table so
-- admins can document actions, updates, and resolutions.
--
-- How to apply:
--   Supabase Dashboard → SQL Editor → Paste and run
-- ────────────────────────────────────────────────────────────

-- Add JSONB column for structured notes (stored as array of objects)
ALTER TABLE public.reports
ADD COLUMN IF NOT EXISTS internal_notes JSONB DEFAULT '[]'::jsonb;

-- Each note object: { text: string, author: string, created_at: string }

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'reports' AND column_name = 'internal_notes';
