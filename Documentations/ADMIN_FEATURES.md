# Admin Portal Features Documentation

## Overview

The admin portal now includes comprehensive features for managing quotes, payments, orders, and archives with proper security layers and RBAC (Role-Based Access Control).

## New Features

### 1. Quote Content Editing ⭐

**Location:** Inquiries View → Edit Quote Button (Admin Only)

**Features:**
- **Admin-only editing** - Only users with `admin` role can edit quotes
- **Security Layers:**
  1. Role verification - Checks user role before allowing edit
  2. Confirmation dialog - Requires typing "CONFIRM" to save changes
  3. Change detection - Warns if closing with unsaved changes
  4. Audit trail - Tracks who edited and when (`lastEditedBy`, `lastEditedAt`)

**How to Use:**
1. Navigate to Inquiries view
2. Click the edit icon (✏️) next to any booking
3. Edit quote content and/or total amount
4. Preview changes before saving
5. Type "CONFIRM" in the confirmation dialog
6. Click "Confirm & Save"

**Custom Quote Content:**
- If `quoteContent` is set, it replaces the default quote display
- Supports multi-line text and formatting
- If empty, default quote format is used

### 2. Payment History Tracking 💰

**Location:** Sidebar → Payments

**Features:**
- Track all payments across all bookings
- Filter by booking ID
- View payment statistics (Total Revenue, Transactions, Active Bookings)
- Add new payments (Admin only)
- Payment types: Reservation, Downpayment, Partial, Full
- Payment methods: Cash, Bank Transfer, GCash, PayMaya, Check

**How to Use:**
1. Navigate to Payments view
2. View summary statistics at the top
3. Filter by booking ID if needed
4. Click "Add Payment" to record a new payment (Admin only)
5. View all payment details including transaction IDs and notes

**API Endpoint:** `/api/payments`
- `GET /api/payments` - Get all payments
- `GET /api/payments?bookingId=xxx` - Get payments for specific booking
- `POST /api/payments` - Create new payment record

### 3. Order History 📦

**Location:** Sidebar → Orders

**Features:**
- View all bookings/orders in one place
- Filter by status (Inquiry, QuoteSent, Confirmed, Cancelled)
- Search by client name, ID, email, or venue
- Statistics dashboard showing counts by status
- Excludes archived bookings

**How to Use:**
1. Navigate to Orders view
2. View statistics cards at the top
3. Use search bar to find specific orders
4. Filter by status using dropdown
5. View detailed order information in table

### 4. Archive Management 📁

**Location:** Sidebar → Archive

**Features:**
- Archive bookings to remove from active views
- Restore archived bookings
- View archive statistics
- Track who archived and when
- Admin-only archive/restore actions

**How to Use:**
1. Navigate to Archive view
2. View archived bookings in the table
3. To archive: Click "Archive" button next to active booking (Admin only)
4. To restore: Click "Restore" button next to archived booking (Admin only)
5. Search archived bookings using search bar

**Archive Fields:**
- `archived` - Boolean flag
- `archivedAt` - Timestamp when archived
- `archivedBy` - Username of admin who archived

## Security & RBAC

### Role-Based Access Control

**Roles:**
- **Admin** - Full access to all features including:
  - Quote editing
  - Payment recording
  - Archive/restore bookings
- **Staff** - Limited access (view only for most features)
- **Viewer** - Read-only access

### Security Layers for Quote Editing

1. **Frontend Role Check** - Component checks user role before rendering edit button
2. **Confirmation Dialog** - Requires typing "CONFIRM" to prevent accidental edits
3. **Change Detection** - Warns before closing with unsaved changes
4. **Audit Trail** - All edits tracked with `lastEditedBy` and `lastEditedAt`
5. **Backend Validation** - API endpoints log sensitive field updates (TODO: Implement JWT verification)

## Database Schema

### New Fields in `bookings` Table

```sql
quote_content TEXT              -- Custom quote content
archived BOOLEAN DEFAULT false   -- Archive flag
archived_at TIMESTAMP            -- Archive timestamp
archived_by VARCHAR(255)         -- Admin who archived
last_edited_by VARCHAR(255)      -- Admin who last edited
last_edited_at TIMESTAMP         -- Last edit timestamp
```

### New `payments` Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  booking_id VARCHAR(50) REFERENCES bookings(id),
  amount DECIMAL(10,2),
  payment_type VARCHAR(20),      -- reservation, downpayment, full, partial
  payment_method VARCHAR(50),     -- cash, bank_transfer, gcash, etc.
  transaction_id VARCHAR(255),
  notes TEXT,
  paid_by VARCHAR(255),
  paid_at TIMESTAMP,
  created_at TIMESTAMP
);
```

### New `audit_logs` Table (Optional)

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255),
  username VARCHAR(255),
  action VARCHAR(50),            -- create, update, delete, archive, etc.
  entity_type VARCHAR(50),        -- booking, quote, payment
  entity_id VARCHAR(255),
  changes JSONB,
  timestamp TIMESTAMP,
  ip_address VARCHAR(45)
);
```

## Setup Instructions

### 1. Run Database Migration

Execute the SQL script in `Documentations/DATABASE_MIGRATION.sql` in your Supabase SQL Editor:

```sql
-- This will add all new columns and tables
-- See DATABASE_MIGRATION.sql for full script
```

### 2. Verify Environment Variables

Ensure these are set in Vercel:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

### 3. Test Features

1. **Quote Editing:**
   - Login as admin
   - Go to Inquiries
   - Click edit icon on a booking
   - Edit and save quote content

2. **Payment Tracking:**
   - Go to Payments view
   - Click "Add Payment"
   - Fill form and submit
   - Verify payment appears in list

3. **Order History:**
   - Go to Orders view
   - Use search and filters
   - Verify all bookings appear

4. **Archive:**
   - Go to Archive view
   - Archive a booking
   - Verify it moves to archived section
   - Restore it back

## API Endpoints

### Payments API

**GET /api/payments**
- Returns all payments
- Query params: `?bookingId=xxx` to filter

**POST /api/payments**
- Creates new payment record
- Body: `{ bookingId, amount, paymentType, paymentMethod, transactionId?, notes?, paidBy? }`

### Bookings API (Updated)

**PUT /api/bookings/[id]**
- Now supports new fields: `quoteContent`, `archived`, `archivedAt`, `archivedBy`, `lastEditedBy`, `lastEditedAt`
- Sensitive field updates are logged (TODO: Add JWT verification)

## Client Quote Page

The client-facing quote page (`ClientQuotePage.tsx`) now:
- Displays custom `quoteContent` if set by admin
- Falls back to default format if `quoteContent` is empty
- Shows all booking details and payment information

## Best Practices

1. **Always verify admin role** before allowing sensitive operations
2. **Use confirmation dialogs** for destructive actions
3. **Track all changes** using audit fields
4. **Archive instead of delete** to maintain history
5. **Document payment transactions** with transaction IDs and notes

## Future Enhancements

- [ ] Implement JWT token verification in API endpoints
- [ ] Add email notifications for quote edits
- [ ] Export payment history to CSV/PDF
- [ ] Add bulk archive/restore operations
- [ ] Implement audit log viewing interface
- [ ] Add quote templates for common event types
- [ ] Add payment reminders and due date tracking

## Troubleshooting

### Quote Editor Not Showing
- Verify user role is `admin` in localStorage (`admin_user`)
- Check browser console for errors
- Ensure user is logged in

### Payments Not Saving
- Check database migration was run
- Verify `payments` table exists
- Check API endpoint logs

### Archive Not Working
- Verify `archived` column exists in `bookings` table
- Check user has admin role
- Verify booking ID is correct

## Support

For issues or questions:
1. Check browser console for errors
2. Verify database schema matches migration script
3. Check API endpoint responses
4. Review audit logs if available

