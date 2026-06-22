-- Migration: Add Edit My Profile extended fields to users table
-- Run this in Supabase SQL Editor to add the new columns to the existing users table.

ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS institution_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS institution_district TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS interested_domain TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS target_job_role TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS skills TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS language_proficiency TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS certifications TEXT;
