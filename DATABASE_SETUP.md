# Database Setup Guide

This project uses Vercel Serverless Functions with an in-memory storage system that can be easily migrated to Vercel Postgres or Supabase.

## Current Setup

### Storage System
- **Current**: In-memory storage (works for development and small deployments)
- **Recommended for Production**: Vercel Postgres or Supabase

### API Routes
All API routes are located in the `/api` directory:
- `/api/bookings` - CRUD operations for bookings
- `/api/bookings/[id]` - Get, update, or delete a specific booking
- `/api/auth/login` - User authentication

## Features Implemented

### ✅ Booking Management
- Create new bookings from the booking modal
- View all bookings in admin portal
- Update booking status (Inquiry → QuoteSent → Confirmed)
- Delete bookings
- Calendar shows confirmed bookings

### ✅ Authentication & RBAC
- Login system with role-based access control
- User roles: `admin`, `staff`, `viewer`
- Token-based authentication
- Session management via localStorage

### ✅ Admin Portal
- Schedule view showing all bookings
- Inquiries view for pending bookings
- Generate quotes and update booking status
- Real-time booking updates

## Default Credentials

```
Username: admin
Password: password
Role: admin

Username: staff
Password: password
Role: staff
```

**⚠️ IMPORTANT**: Change these passwords in production!

## Environment Variables

For Vercel deployment, set these in your Vercel dashboard:

```bash
# Optional: Custom API URL (defaults to /api)
VITE_API_URL=/api

# For Edge Config (if using)
EDGE_CONFIG=1349c822-1cbf-4259-bb2a-a41433a1f5f5
```

## Testing the API

### Test Bookings API
```bash
# Get all bookings
curl https://beataudio.vercel.app/api/bookings

# Create a booking
curl -X POST https://beataudio.vercel.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "email": "test@example.com",
    "eventDate": "2025-12-25",
    "eventType": "Wedding",
    "venue": "Test Venue",
    "guestCount": 100,
    "services": ["Lights", "Sounds"],
    "status": "Inquiry"
  }'
```

### Test Authentication
```bash
curl -X POST https://beataudio.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

## Migrating to Vercel Postgres

1. **Create a Postgres database** in Vercel Dashboard
2. **Update `/api/lib/storage.ts`** to use `@vercel/postgres`:

```typescript
import { sql } from '@vercel/postgres';

export async function getBookings(): Promise<Booking[]> {
  const { rows } = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
  return rows;
}

export async function createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
  const { rows } = await sql`
    INSERT INTO bookings (customer_name, email, event_date, ...)
    VALUES (${booking.customerName}, ${booking.email}, ...)
    RETURNING *
  `;
  return rows[0];
}
```

3. **Create database schema**:

```sql
CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20),
  event_date DATE NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  guest_count INTEGER,
  services TEXT[],
  status VARCHAR(20) DEFAULT 'Inquiry',
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

## Migrating to Supabase

**See `SUPABASE_GUIDE.md` for detailed instructions!**

Quick steps:
1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Install Supabase client**: `npm install @supabase/supabase-js` (already installed)
3. **Get your credentials** from Supabase Dashboard → Settings → API
4. **Set environment variables** in Vercel:
   ```bash
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (server-side only)
   ```
5. **Create tables** using SQL in Supabase Dashboard → SQL Editor (see `SUPABASE_GUIDE.md`)
6. **Switch storage**: Update `/api/lib/storage.ts`:
   ```typescript
   // Replace the in-memory storage with:
   export * from './supabase-storage';
   ```

The Supabase implementation is ready in `/api/lib/supabase-storage.ts` - just switch the import!

## Edge Config Usage

Edge Config is available but **not recommended** for booking data (it's for feature flags, redirects, etc.).

To test Edge Config:
1. Go to Vercel Dashboard > Edge Config
2. Create a config and add a key-value pair
3. Visit `/api/test-edge-config` to test

## Deployment Checklist

- [ ] Set up Vercel Postgres or Supabase database
- [ ] Update storage.ts to use database
- [ ] Change default admin passwords
- [ ] Set up environment variables
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Verify bookings are saved correctly
- [ ] Test calendar booking display

## Support

For issues or questions:
1. Check API routes in `/api` directory
2. Check browser console for errors
3. Verify environment variables are set
4. Check Vercel function logs in dashboard

