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

-- Workflow Refinement Updates
ALTER TABLE analysis_queue_jobs ALTER COLUMN schedule_preference SET DEFAULT 'Weekly';
ALTER TABLE analysis_queue_jobs ADD COLUMN IF NOT EXISTS personal_details_hash TEXT;

