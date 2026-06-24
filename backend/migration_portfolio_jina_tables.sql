-- SQL Migrations Script for Portfolio Jina & Gemini Analysis Pipeline
-- Run this in your Supabase SQL Editor to prepare the required tables.

-- 1. Raw Markdown Data
CREATE TABLE IF NOT EXISTS portfolio_raw_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    portfolio_url TEXT NOT NULL,
    raw_markdown TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Normalized Profile JSON Data
CREATE TABLE IF NOT EXISTS portfolio_normalized_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    raw_data_id UUID REFERENCES portfolio_raw_data(id) ON DELETE SET NULL,
    normalized_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Gemini Analysis Summary JSON
CREATE TABLE IF NOT EXISTS portfolio_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    summary_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Gemini Scores JSON
CREATE TABLE IF NOT EXISTS portfolio_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scores_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Main unified Portfolio Analysis Mapping
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

-- 6. Analysis Run History with Versioning
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolio_raw_data_user ON portfolio_raw_data(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_normalized_data_user ON portfolio_normalized_data(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_summary_user ON portfolio_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_scores_user ON portfolio_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_analysis_user ON portfolio_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_analysis_history_user ON portfolio_analysis_history(user_id);
