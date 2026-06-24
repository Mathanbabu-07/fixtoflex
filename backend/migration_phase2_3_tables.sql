-- Analysis Tables for Phase 2 (Portfolio) and Phase 3 (Resume)

CREATE TABLE IF NOT EXISTS portfolio_analysis_raw (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    portfolio_url TEXT NOT NULL,
    raw_html TEXT,
    normalized_json JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    portfolio_url TEXT NOT NULL,
    raw_id UUID REFERENCES portfolio_analysis_raw(id) ON DELETE SET NULL,
    gemini_summary JSONB,
    scores JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_analysis_raw_user_id ON portfolio_analysis_raw(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_analysis_results_user_id ON portfolio_analysis_results(user_id);


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
