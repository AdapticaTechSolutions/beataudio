-- Create Payments Table for Beat Audio & Lights
-- Run this in Supabase SQL Editor

-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id VARCHAR(50) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('reservation', 'downpayment', 'full', 'partial')),
  payment_method VARCHAR(50) NOT NULL DEFAULT 'cash',
  reference_number VARCHAR(255), -- Reference number from payment screenshot
  transaction_id VARCHAR(255), -- Transaction ID from payment gateway (if available)
  notes TEXT,
  paid_by VARCHAR(255), -- Name of person who made payment
  validated_by VARCHAR(255), -- Admin who validated the payment
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON payments(paid_at);
CREATE INDEX IF NOT EXISTS idx_payments_reference_number ON payments(reference_number);
CREATE INDEX IF NOT EXISTS idx_payments_payment_type ON payments(payment_type);

-- Add comment to table
COMMENT ON TABLE payments IS 'Stores all payment records for bookings. Payments are validated by admins after receiving payment screenshots via Messenger.';

-- Add comments to important columns
COMMENT ON COLUMN payments.reference_number IS 'Reference number from payment screenshot sent via Messenger';
COMMENT ON COLUMN payments.validated_by IS 'Admin username who validated this payment';
COMMENT ON COLUMN payments.payment_type IS 'Type of payment: reservation (₱1,000), downpayment, partial, or full';

