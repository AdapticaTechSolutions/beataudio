# Payment System Setup Guide

## Overview

The payment system tracks all payments received after bookings are confirmed. When admins validate payments from Messenger screenshots, payment records are automatically saved to the database.

## Database Setup

### Step 1: Create Payments Table

Run the SQL script in Supabase SQL Editor:

**File:** `CREATE_PAYMENTS_TABLE.sql`

This creates a `payments` table with:
- `id` - UUID primary key
- `booking_id` - References bookings table
- `amount` - Payment amount (DECIMAL)
- `payment_type` - reservation, downpayment, full, or partial
- `payment_method` - GCash, Maya, Bank Transfer, Cash, etc.
- `reference_number` - Reference number from payment screenshot
- `transaction_id` - Transaction ID from payment gateway (optional)
- `notes` - Additional notes
- `paid_by` - Name of person who made payment
- `validated_by` - Admin who validated the payment
- `paid_at` - When payment was made
- `created_at` - When record was created
- `updated_at` - When record was last updated

### Step 2: Verify Table Creation

Check in Supabase Dashboard → Table Editor → `payments` table

## Workflow

### Payment Validation Process

1. **New Inquiry Arrives**
   - Customer submits booking form
   - Status: `Inquiry`
   - Appears in "Pending Payment Validation" section

2. **Customer Sends Payment**
   - Customer sends payment screenshot via Messenger
   - Screenshot includes reference number and payment details

3. **Admin Validates Payment**
   - Admin opens "Validate Payment" modal
   - Enters reference number (cross-matches with screenshot)
   - Enters payment amount
   - Selects payment method
   - Adds optional notes
   - Clicks "Validate & Confirm Booking"

4. **System Actions**
   - ✅ Creates payment record in `payments` table
   - ✅ Updates booking status to `Confirmed`
   - ✅ Records who validated the payment
   - ✅ Stores reference number for tracking

5. **Payment Recorded**
   - Payment appears in Payment History view
   - Can be filtered by booking ID
   - Shows all payment details including reference number

## API Endpoints

### GET /api/payments
Get all payments or filter by booking ID

**Query Parameters:**
- `bookingId` (optional) - Filter payments for specific booking

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "bookingId": "BA-2025-1001",
      "amount": 1000,
      "paymentType": "reservation",
      "paymentMethod": "gcash",
      "referenceNumber": "REF123456",
      "transactionId": null,
      "paidAt": "2025-11-24T10:00:00Z",
      "paidBy": "John Doe",
      "validatedBy": "admin",
      "notes": "Payment validated from Messenger screenshot",
      "createdAt": "2025-11-24T10:00:00Z"
    }
  ]
}
```

### POST /api/payments
Create a new payment record

**Request Body:**
```json
{
  "bookingId": "BA-2025-1001",
  "amount": 1000,
  "paymentType": "reservation",
  "paymentMethod": "gcash",
  "referenceNumber": "REF123456",
  "transactionId": "TXN789",
  "notes": "Payment validated",
  "paidBy": "John Doe",
  "validatedBy": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "bookingId": "BA-2025-1001",
    ...
  }
}
```

## Payment Types

- **reservation** - ₱1,000 reservation fee
- **downpayment** - Downpayment (typically 50% of total)
- **partial** - Partial payment
- **full** - Full payment (automatically confirms booking)

## Payment Methods

- GCash
- Maya
- Bank Transfer
- Cash
- Other

## Features

### Payment History View
- View all payments across all bookings
- Filter by booking ID
- See payment statistics (Total Revenue, Transactions, Active Bookings)
- View reference numbers for cross-referencing
- See who validated each payment

### Automatic Payment Recording
- When admin validates payment, it's automatically saved
- Reference number is stored for tracking
- Admin who validated is recorded
- Payment type is automatically determined (reservation vs downpayment)

### Payment Tracking
- All payments are linked to bookings
- Can calculate total paid per booking
- Payment history is preserved for records
- Reference numbers enable cross-matching with screenshots

## Database Schema

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  booking_id VARCHAR(50) REFERENCES bookings(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_type VARCHAR(20) CHECK (payment_type IN ('reservation', 'downpayment', 'full', 'partial')),
  payment_method VARCHAR(50) NOT NULL,
  reference_number VARCHAR(255),
  transaction_id VARCHAR(255),
  notes TEXT,
  paid_by VARCHAR(255),
  validated_by VARCHAR(255),
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Testing

### Test Payment Creation
```bash
curl -X POST https://your-app.vercel.app/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "BA-2025-1001",
    "amount": 1000,
    "paymentType": "reservation",
    "paymentMethod": "gcash",
    "referenceNumber": "TEST123",
    "validatedBy": "admin"
  }'
```

### Test Payment Retrieval
```bash
# Get all payments
curl https://your-app.vercel.app/api/payments

# Get payments for specific booking
curl https://your-app.vercel.app/api/payments?bookingId=BA-2025-1001
```

## Integration Points

1. **PaymentValidationModal** - Creates payment when validating
2. **AdminPortal.handleValidatePayment** - Saves payment via API
3. **PaymentHistoryView** - Displays all payments
4. **Payment API** - Handles payment CRUD operations
5. **Payment Storage** - Database operations for payments

## Next Steps

1. Run `CREATE_PAYMENTS_TABLE.sql` in Supabase SQL Editor
2. Verify table creation
3. Test payment validation workflow
4. Check Payment History view to see recorded payments

