-- SQL Migrations Script for LinkedIn Hybrid Jina & Scrape.do Analysis Pipeline
-- Run this in your Supabase SQL Editor to prepare the required tables.

-- 1. Raw Jina AI Reader Data (Markdown)
CREATE TABLE IF NOT EXISTS linkedin_raw_jina (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    linkedin_url TEXT NOT NULL,
    raw_markdown TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Raw Scrape.do Data (HTML)
CREATE TABLE IF NOT EXISTS linkedin_raw_scrapedo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    linkedin_url TEXT NOT NULL,
    raw_html TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Normalized Profile JSON Data
CREATE TABLE IF NOT EXISTS linkedin_normalized_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    normalized_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Gemini Analysis Summary JSON
CREATE TABLE IF NOT EXISTS linkedin_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    summary_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Gemini Scores JSON
CREATE TABLE IF NOT EXISTS linkedin_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scores_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Main unified LinkedIn Analysis Mapping
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

-- 7. Analysis Run History with Versioning
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_linkedin_raw_jina_user ON linkedin_raw_jina(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_raw_scrapedo_user ON linkedin_raw_scrapedo(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_normalized_data_user ON linkedin_normalized_data(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_summary_user ON linkedin_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_scores_user ON linkedin_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_analysis_user ON linkedin_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_analysis_history_user ON linkedin_analysis_history(user_id);
