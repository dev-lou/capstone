-- ────────────────────────────────────────────────────────────
-- RescueMind AI — Supabase Database Schema
-- Run this in your Supabase SQL Editor after creating a project
-- ────────────────────────────────────────────────────────────

-- ── Reports Table ────────────────────────────────────────
-- Stores classified citizen reports persistently in the cloud
-- so all barangay officials can access them (not just localStorage)

CREATE TABLE IF NOT EXISTS public.reports (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tracking_id   TEXT UNIQUE NOT NULL,
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  text          TEXT NOT NULL,
  category      TEXT NOT NULL,
  confidence    NUMERIC(5,2) NOT NULL,
  needs_human_review BOOLEAN DEFAULT FALSE,
  urgency       TEXT NOT NULL CHECK (urgency IN ('high', 'medium', 'low')),
  office        TEXT NOT NULL,
  explanation   TEXT,
  offline       BOOLEAN DEFAULT FALSE,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved')),
  -- Location
  lat           NUMERIC(10,7),
  lng           NUMERIC(10,7),
  region        TEXT,
  province      TEXT,
  city          TEXT,
  barangay      TEXT,
  -- Metadata
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_reports_tracking_id ON public.reports(tracking_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_urgency ON public.reports(urgency);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

-- ── Row Level Security ──────────────────────────────────

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Users can read their own reports
CREATE POLICY "Users can view their own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own reports
CREATE POLICY "Users can insert their own reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports (e.g., change status)
CREATE POLICY "Users can update their own reports"
  ON public.reports FOR UPDATE
  USING (auth.uid() = user_id);

-- ── Auto-update `updated_at` ─────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ── User Profiles (optional, for role management) ────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  full_name     TEXT,
  role          TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'barangay_staff', 'barangay_captain', 'lgu_officer', 'admin')),
  barangay      TEXT,
  city          TEXT,
  province      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
