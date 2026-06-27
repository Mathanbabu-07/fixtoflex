-- FixToFlex Internship Tracker Migration

CREATE TABLE IF NOT EXISTS internship_tracker_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cache_hash TEXT NOT NULL,
    internships_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, cache_hash)
);

CREATE INDEX IF NOT EXISTS idx_internship_tracker_cache_user ON internship_tracker_cache(user_id);
