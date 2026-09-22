-- ─────────────────────────────────────────────────────────────────────────────
-- NovoRise — Migrations PostgreSQL
-- Exécutez ce fichier dans Supabase SQL Editor ou via psql
-- ─────────────────────────────────────────────────────────────────────────────

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Table users ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 VARCHAR(255) NOT NULL,
  email                VARCHAR(255) UNIQUE NOT NULL,
  password_hash        VARCHAR(255),                          -- NULL si connexion Google OAuth
  role                 VARCHAR(20)  NOT NULL DEFAULT 'candidat' CHECK (role IN ('candidat','recruteur','admin')),
  verified             BOOLEAN      NOT NULL DEFAULT FALSE,
  verification_token   UUID,
  reset_token          VARCHAR(255),
  reset_token_expires  TIMESTAMPTZ,
  google_id            VARCHAR(255) UNIQUE,
  avatar_url           TEXT,
  -- Profil candidat
  title                VARCHAR(255),
  phone                VARCHAR(50),
  location             VARCHAR(255),
  bio                  TEXT,
  skills               TEXT[],
  cv_filename          VARCHAR(255),
  -- Profil recruteur
  company_name         VARCHAR(255),
  company_website      TEXT,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── Table job_posts ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_posts (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id         UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title                VARCHAR(255) NOT NULL,
  company              VARCHAR(255) NOT NULL,
  category             VARCHAR(50)  NOT NULL CHECK (category IN ('Tech & IT','Marketing & Com','Vente & Business','Ingénierie & R&D')),
  contract             VARCHAR(20)  NOT NULL CHECK (contract IN ('CDI','CDD','Freelance','Stage')),
  workplace            VARCHAR(20)  NOT NULL CHECK (workplace IN ('Remote','Hybride','Présentiel')),
  location             VARCHAR(255),
  salary               VARCHAR(100),
  description          TEXT,
  tags                 TEXT[],
  status               VARCHAR(20)  NOT NULL DEFAULT 'Actif' CHECK (status IN ('Actif','Pause','Clôturé')),
  views_count          INTEGER      NOT NULL DEFAULT 0,
  applications_count   INTEGER      NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── Table applications ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id               UUID         NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
  candidate_id         UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_note           TEXT,
  cv_filename          VARCHAR(255),
  status               VARCHAR(30)  NOT NULL DEFAULT 'En attente' CHECK (status IN ('En attente','En cours d''examen','Entretien','Acceptée','Refusée')),
  applied_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (job_id, candidate_id)
);

-- ─── Triggers updated_at ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_users_updated_at') THEN
    CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_job_posts_updated_at') THEN
    CREATE TRIGGER set_job_posts_updated_at BEFORE UPDATE ON job_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_applications_updated_at') THEN
    CREATE TRIGGER set_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ─── Index ────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
CREATE INDEX IF NOT EXISTS idx_job_posts_recruiter ON job_posts(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);
