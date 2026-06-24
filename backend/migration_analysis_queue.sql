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
