-- FixToFlex Consolidated Production Database Schema
-- Run this script in your Supabase SQL Editor to prepare all required tables for the platform.
-- Order of execution ensures dependencies are created correctly.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Main Users Table
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

CREATE INDEX IF NOT EXISTS idx_users_linkedin_id ON users(linkedin_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);


-- 2. GitHub Profile Analysis Tables (Phase 1 MVP)
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


-- 3. Resume Analysis Tables (Phase 3)
CREATE TABLE IF NOT EXISTS resume_analysis_raw (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    raw_text TEXT,
    normalized_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resume_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    raw_id UUID REFERENCES resume_analysis_raw(id) ON DELETE SET NULL,
    gemini_summary JSONB,
    scores JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resume_analysis_raw_user_id ON resume_analysis_raw(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analysis_results_user_id ON resume_analysis_results(user_id);


-- 4. Portfolio Summary & Analysis Tables (Phase 2 - Jina AI + Gemini 3.1 Flash Lite)
CREATE TABLE IF NOT EXISTS portfolio_raw_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    portfolio_url TEXT NOT NULL,
    raw_markdown TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_normalized_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    raw_data_id UUID REFERENCES portfolio_raw_data(id) ON DELETE SET NULL,
    normalized_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    summary_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scores_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    portfolio_url TEXT NOT NULL,
    raw_data_id UUID REFERENCES portfolio_raw_data(id) ON DELETE SET NULL,
    normalized_data_id UUID REFERENCES portfolio_normalized_data(id) ON DELETE SET NULL,
    summary_id UUID REFERENCES portfolio_summary(id) ON DELETE SET NULL,
    scores_id UUID REFERENCES portfolio_scores(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_analysis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES portfolio_analysis(id) ON DELETE SET NULL,
    portfolio_url TEXT NOT NULL,
    summary_json JSONB,
    scores_json JSONB,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_raw_data_user ON portfolio_raw_data(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_normalized_data_user ON portfolio_normalized_data(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_summary_user ON portfolio_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_scores_user ON portfolio_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_analysis_user ON portfolio_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_analysis_history_user ON portfolio_analysis_history(user_id);


-- 5. LinkedIn Career Intelligence Analysis Tables (Jina AI + Scrape.do + Gemini 3.1 Flash Lite)
CREATE TABLE IF NOT EXISTS linkedin_raw_jina (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    linkedin_url TEXT NOT NULL,
    raw_markdown TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS linkedin_raw_scrapedo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    linkedin_url TEXT NOT NULL,
    raw_html TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS linkedin_normalized_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    normalized_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS linkedin_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    summary_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS linkedin_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scores_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS linkedin_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    linkedin_url TEXT NOT NULL,
    raw_jina_id UUID REFERENCES linkedin_raw_jina(id) ON DELETE SET NULL,
    raw_scrapedo_id UUID REFERENCES linkedin_raw_scrapedo(id) ON DELETE SET NULL,
    normalized_data_id UUID REFERENCES linkedin_normalized_data(id) ON DELETE SET NULL,
    summary_id UUID REFERENCES linkedin_summary(id) ON DELETE SET NULL,
    scores_id UUID REFERENCES linkedin_scores(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS linkedin_analysis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES linkedin_analysis(id) ON DELETE SET NULL,
    linkedin_url TEXT NOT NULL,
    summary_json JSONB,
    scores_json JSONB,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_linkedin_raw_jina_user ON linkedin_raw_jina(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_raw_scrapedo_user ON linkedin_raw_scrapedo(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_normalized_data_user ON linkedin_normalized_data(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_summary_user ON linkedin_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_scores_user ON linkedin_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_analysis_user ON linkedin_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_analysis_history_user ON linkedin_analysis_history(user_id);
CREATE TABLE IF NOT EXISTS analysis_queue_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    linkedin_status TEXT DEFAULT 'Pending',
    github_status TEXT DEFAULT 'Pending',
    portfolio_status TEXT DEFAULT 'Pending',
    resume_status TEXT DEFAULT 'Pending',
    overall_status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analysis_queue_jobs_user_id ON analysis_queue_jobs(user_id);
-- Phase 1.4, 1.5 Cache and Scheduler Additions
ALTER TABLE analysis_queue_jobs
ADD COLUMN IF NOT EXISTS schedule_preference TEXT DEFAULT 'Analyze Now',
ADD COLUMN IF NOT EXISTS last_analysis_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cached_linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS cached_github_url TEXT,
ADD COLUMN IF NOT EXISTS cached_portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS cached_resume_url TEXT;
-- Phase 2: Career Intelligence Engine Tables

CREATE TABLE IF NOT EXISTS career_intelligence_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    unified_context_hash TEXT NOT NULL,
    report_json JSONB NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_career_intel_reports_user ON career_intelligence_reports(user_id);

CREATE TABLE IF NOT EXISTS career_intelligence_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    report_id UUID REFERENCES career_intelligence_reports(id) ON DELETE SET NULL,
    unified_context_hash TEXT NOT NULL,
    report_json JSONB NOT NULL,
    version INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_career_intel_history_user ON career_intelligence_history(user_id);

-- Phase 4: AI Voice Interview Simulator
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    difficulty TEXT,
    total_questions INTEGER,
    overall_score INTEGER,
    final_report_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user ON interview_sessions(user_id);

CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_text TEXT,
    transcript TEXT,
    evaluation_score INTEGER,
    feedback_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interview_questions_session ON interview_questions(session_id);
