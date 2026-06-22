-- Migration: Add Phase 1 MVP Analysis Tables
-- Run this script in your Supabase SQL Editor to create the required tables for the GitHub profile analysis feature.

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

-- Indexes for performant lookups by user_id
CREATE INDEX IF NOT EXISTS idx_github_analysis_raw_user_id ON github_analysis_raw(user_id);
CREATE INDEX IF NOT EXISTS idx_github_analysis_results_user_id ON github_analysis_results(user_id);
