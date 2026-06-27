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
