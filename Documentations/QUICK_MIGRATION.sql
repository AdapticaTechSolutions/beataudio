-- Quick Migration: Add Missing Columns
-- Run this in Supabase SQL Editor if you get "column not found" errors

-- Add missing columns (safe to run multiple times - uses IF NOT EXISTS)
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS quote_content TEXT,
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS archived_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_edited_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name IN ('quote_content', 'archived', 'archived_at', 'archived_by', 'last_edited_by', 'last_edited_at')
ORDER BY column_name;

