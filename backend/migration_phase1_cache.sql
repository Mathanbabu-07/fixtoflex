-- Phase 1.4, 1.5 Cache and Scheduler Additions
ALTER TABLE analysis_queue_jobs
ADD COLUMN IF NOT EXISTS schedule_preference TEXT DEFAULT 'Analyze Now',
ADD COLUMN IF NOT EXISTS last_analysis_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cached_linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS cached_github_url TEXT,
ADD COLUMN IF NOT EXISTS cached_portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS cached_resume_url TEXT;
