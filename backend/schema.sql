-- SQL Migrations Script for Supabase PostgreSQL
-- Creates the users table to store profile mappings from LinkedIn OpenID Connect.

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    linkedin_id TEXT UNIQUE,
    email TEXT UNIQUE,
    full_name TEXT,
    profile_picture TEXT,
    role TEXT DEFAULT 'candidate',
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    resume_url TEXT,
    headline TEXT,
    date_of_birth TEXT,
    gender TEXT,
    mobile_number TEXT,
    state TEXT,
    district TEXT,
    institution_name TEXT,
    institution_district TEXT,
    interested_domain TEXT,
    target_job_role TEXT,
    experience TEXT,
    skills TEXT,
    language_proficiency TEXT,
    certifications TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexing for performant user lookups during authentication callbacks
CREATE INDEX IF NOT EXISTS idx_users_linkedin_id ON users(linkedin_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Analysis Tables for Phase 1 MVP

CREATE TABLE IF NOT EXISTS github_analysis_raw (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    github_url TEXT NOT NULL,
    raw_html TEXT,
    normalized_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS github_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    github_url TEXT NOT NULL,
    raw_id UUID REFERENCES github_analysis_raw(id) ON DELETE SET NULL,
    gemini_summary JSONB,
    scores JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_github_analysis_raw_user_id ON github_analysis_raw(user_id);
CREATE INDEX IF NOT EXISTS idx_github_analysis_results_user_id ON github_analysis_results(user_id);
