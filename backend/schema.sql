-- SQL Migrations Script for Supabase PostgreSQL
-- Creates the users table to store profile mappings from LinkedIn OpenID Connect.

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    linkedin_id TEXT UNIQUE,
    email TEXT UNIQUE,
    full_name TEXT,
    profile_picture TEXT,
    role TEXT DEFAULT 'candidate',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexing for performant user lookups during authentication callbacks
CREATE INDEX IF NOT EXISTS idx_users_linkedin_id ON users(linkedin_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
