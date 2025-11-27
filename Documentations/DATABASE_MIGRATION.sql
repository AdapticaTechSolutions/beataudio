-- Database Migration Script
-- Run this in Supabase SQL Editor to add new fields and tables

-- 1. Add new columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS quote_content TEXT,
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS archived_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_edited_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE;

-- 2. Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id VARCHAR(50) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('reservation', 'downpayment', 'full', 'partial')),
  payment_method VARCHAR(50) NOT NULL DEFAULT 'cash',
  transaction_id VARCHAR(255),
  notes TEXT,
  paid_by VARCHAR(255),
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON payments(paid_at);
CREATE INDEX IF NOT EXISTS idx_bookings_archived ON bookings(archived);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- 4. Create audit_logs table (optional, for tracking changes)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(255) NOT NULL,
  changes JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(45)
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- 5. Enable Row Level Security on new tables
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for payments (adjust based on your needs)
-- Allow admins to do everything
CREATE POLICY IF NOT EXISTS "Admins can manage payments" ON payments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow service role to do everything (for API access)
CREATE POLICY IF NOT EXISTS "Service role can manage payments" ON payments
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 7. Create RLS policies for audit_logs
CREATE POLICY IF NOT EXISTS "Admins can view audit logs" ON audit_logs
  FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Service role can manage audit logs" ON audit_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 8. Add comments for documentation
COMMENT ON COLUMN bookings.quote_content IS 'Custom quote content editable by admin';
COMMENT ON COLUMN bookings.archived IS 'Flag to mark bookings as archived';
COMMENT ON COLUMN bookings.archived_at IS 'Timestamp when booking was archived';
COMMENT ON COLUMN bookings.archived_by IS 'Username of admin who archived the booking';
COMMENT ON COLUMN bookings.last_edited_by IS 'Username of admin who last edited the quote';
COMMENT ON COLUMN bookings.last_edited_at IS 'Timestamp of last quote edit';

-- 9. Update existing bookings to set default values
UPDATE bookings 
SET archived = false 
WHERE archived IS NULL;

-- Done! Your database is now ready for the new features.

