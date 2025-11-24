// Supabase storage implementation
// This replaces the in-memory storage with Supabase PostgreSQL database

import { createClient } from '@supabase/supabase-js';
import type { Booking, User } from '../../types';

// Initialize Supabase client
// Use service_role key for server-side operations (full access, bypasses RLS)
// Use anon key for client-side operations (respects RLS policies)
// Note: In Vercel serverless functions, use process.env directly (not VITE_ prefix)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// Log which key is being used (for debugging)
if (process.env.VERCEL_ENV === 'development' || process.env.NODE_ENV === 'development') {
  console.log('Supabase config:', {
    hasUrl: !!supabaseUrl,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasAnonKey: !!process.env.VITE_SUPABASE_ANON_KEY,
    usingServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Check environment variables:', {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    VITE_SUPABASE_ANON_KEY: !!process.env.VITE_SUPABASE_ANON_KEY,
  });
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper to generate booking ID
function generateBookingId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `BA-${year}-${random}`;
}

// Map database row to Booking type
function mapRowToBooking(row: any): Booking {
  return {
    id: row.id,
    customerName: row.customer_name || row.full_name,
    contactNumber: row.contact_number || row.cel_number,
    email: row.email,
    eventDate: row.event_date,
    eventType: row.event_type,
    venue: row.venue || row.venue_address,
    ceremonyVenue: row.ceremony_venue,
    guestCount: row.guest_count || 0,
    services: row.services || [],
    bandRider: row.band_rider,
    totalAmount: row.total_amount ? parseFloat(row.total_amount) : undefined,
    status: row.status || 'Inquiry',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Additional fields
    fullName: row.full_name,
    celNumber: row.cel_number,
    venueAddress: row.venue_address,
    weddingSetup: row.wedding_setup,
    serviceLights: row.service_lights,
    serviceSounds: row.service_sounds,
    serviceLedWall: row.service_led_wall,
    serviceProjector: row.service_projector,
    serviceSmoke: row.service_smoke,
    hasBand: row.has_band,
    additionalNotes: row.additional_notes,
  };
}

// Map Booking type to database row
function mapBookingToRow(booking: Partial<Booking>): any {
  return {
    id: booking.id,
    customer_name: booking.customerName || booking.fullName,
    contact_number: booking.contactNumber || booking.celNumber,
    email: booking.email,
    event_date: booking.eventDate,
    event_type: booking.eventType,
    venue: booking.venue || booking.venueAddress,
    ceremony_venue: booking.ceremonyVenue,
    guest_count: booking.guestCount,
    services: booking.services || [],
    band_rider: booking.bandRider,
    total_amount: booking.totalAmount,
    status: booking.status || 'Inquiry',
    full_name: booking.fullName,
    cel_number: booking.celNumber,
    venue_address: booking.venueAddress,
    wedding_setup: booking.weddingSetup,
    service_lights: booking.serviceLights,
    service_sounds: booking.serviceSounds,
    service_led_wall: booking.serviceLedWall,
    service_projector: booking.serviceProjector,
    service_smoke: booking.serviceSmoke,
    has_band: booking.hasBand,
    additional_notes: booking.additionalNotes,
    updated_at: new Date().toISOString(),
  };
}

// Get all bookings
export async function getBookings(): Promise<Booking[]> {
  if (!supabase) {
    // Fallback to in-memory storage
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return (data || []).map(mapRowToBooking);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

// Get a single booking by ID
export async function getBookingById(id: string): Promise<Booking | null> {
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      return null;
    }

    return data ? mapRowToBooking(data) : null;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
}

// Create a new booking
export async function createBooking(
  booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Booking> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const bookingId = generateBookingId();
  const bookingRow = mapBookingToRow({
    ...booking,
    id: bookingId,
  });

  // Remove undefined values to avoid Supabase errors
  const cleanBookingRow = Object.fromEntries(
    Object.entries(bookingRow).filter(([_, v]) => v !== undefined)
  );

  const { data, error } = await supabase
    .from('bookings')
    .insert(cleanBookingRow)
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', {
      error,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      bookingRow: cleanBookingRow
    });
    // Create a more descriptive error
    const errorMessage = error.message || 'Failed to create booking';
    const errorWithDetails = new Error(errorMessage);
    (errorWithDetails as any).details = error.details;
    (errorWithDetails as any).hint = error.hint;
    (errorWithDetails as any).code = error.code;
    throw errorWithDetails;
  }

  if (!data) {
    throw new Error('No data returned from Supabase insert');
  }

  return mapRowToBooking(data);
}

// Update a booking
export async function updateBooking(
  id: string,
  updates: Partial<Booking>
): Promise<Booking | null> {
  if (!supabase) {
    return null;
  }

  const updateRow = mapBookingToRow(updates);
  delete updateRow.id; // Don't update the ID

  const { data, error } = await supabase
    .from('bookings')
    .update(updateRow)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    return null;
  }

  return data ? mapRowToBooking(data) : null;
}

// Delete a booking
export async function deleteBooking(id: string): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting booking:', error);
    return false;
  }

  return true;
}

// Get user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  if (!supabase) {
    console.warn('Supabase not configured - cannot fetch user');
    return null;
  }

  if (!username || typeof username !== 'string' || username.trim() === '') {
    console.warn('Invalid username provided');
    return null;
  }

  try {
    const trimmedUsername = username.trim();
    
    if (!supabase) {
      console.error('Supabase client not initialized');
      throw new Error('Database not configured');
    }
    
    // Use a simpler query approach - select all columns and filter
    // Avoid using .single() which can cause UUID validation issues
    // Use RPC or direct query to bypass potential RLS issues
    let allData: any[] | null = null;
    let listError: any = null;
    
    try {
      // Try the query with explicit error handling
      const result = await supabase
        .from('users')
        .select('*')
        .eq('username', trimmedUsername)
        .limit(1);
      
      allData = result.data;
      listError = result.error;
      
      // Log the result for debugging
      if (process.env.VERCEL_ENV === 'development' || process.env.NODE_ENV === 'development') {
        console.log('Query result:', {
          hasData: !!allData,
          dataLength: allData?.length || 0,
          hasError: !!listError,
          errorMessage: listError?.message,
        });
      }
    } catch (queryError: any) {
      console.error('Query execution error:', {
        message: queryError.message,
        stack: queryError.stack,
        name: queryError.name,
      });
      listError = queryError;
    }
    
    if (listError) {
      console.error('Error fetching user from database:', {
        username: trimmedUsername,
        error: listError.message,
        code: listError.code,
        details: listError.details,
        hint: listError.hint,
        fullError: JSON.stringify(listError, null, 2),
      });
      
      // Provide more specific error messages
      if (listError.message?.includes('pattern') || listError.message?.includes('expected')) {
        throw new Error('Database schema error: Invalid UUID format in users table. Please check your database.');
      }
      if (listError.code === '42501') {
        throw new Error('Row Level Security (RLS) is blocking access. Ensure SERVICE_ROLE_KEY is set.');
      }
      
      throw new Error(listError.message || 'Database error fetching user');
    }
    
    // If no users found, return null
    if (!allData || allData.length === 0) {
      console.log(`User not found: ${trimmedUsername}`);
      return null;
    }
    
    // Use the first result
    const data = allData[0];

    // Data is already extracted above, no need to check error here

    // Validate and convert data
    try {
      // Ensure ID is a string (UUIDs from Supabase should be strings)
      let userId: string;
      if (data.id === null || data.id === undefined) {
        console.error('User data missing ID field:', data);
        return null;
      }
      
      userId = typeof data.id === 'string' ? data.id : String(data.id);
      
      // Validate UUID format (but don't fail if it's not UUID - just log)
      if (userId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
        console.warn(`User ID is not a valid UUID format: ${userId} (but continuing anyway)`);
      }

      // Validate role is one of the allowed values
      const validRoles = ['admin', 'staff', 'viewer'] as const;
      const userRole = validRoles.includes(data.role as any) 
        ? (data.role as 'admin' | 'staff' | 'viewer')
        : 'staff';

      // Ensure password_hash exists
      if (!data.password_hash) {
        console.warn(`User ${data.username} is missing password_hash`);
        // Don't fail - return user but log warning
      }

      // Build user object with all required fields
      const user: User = {
        id: userId,
        username: String(data.username || ''),
        email: String(data.email || ''),
        role: userRole,
        passwordHash: String(data.password_hash || ''),
        createdAt: data.created_at 
          ? (typeof data.created_at === 'string' ? data.created_at : new Date(data.created_at).toISOString())
          : new Date().toISOString(),
        lastLogin: data.last_login 
          ? (typeof data.last_login === 'string' ? data.last_login : new Date(data.last_login).toISOString())
          : undefined,
      };

      // Final validation
      if (!user.id || !user.username || !user.email) {
        console.error('User object missing required fields:', {
          hasId: !!user.id,
          hasUsername: !!user.username,
          hasEmail: !!user.email,
          user,
        });
        return null;
      }

      return user;
    } catch (parseError: any) {
      console.error('Error parsing user data:', {
        error: parseError.message,
        stack: parseError.stack,
        data: data,
      });
      return null;
    }
  } catch (error: any) {
    console.error('Error fetching user:', {
      username,
      error: error.message,
      stack: error.stack,
      errorName: error.name,
      errorCode: error.code,
    });
    // Re-throw the error so it can be properly handled upstream
    throw error;
  }
}

// Get all users (without passwords)
export async function getAllUsers(): Promise<Omit<User, 'passwordHash'>[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, created_at, last_login');

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      username: row.username,
      email: row.email,
      role: row.role,
      createdAt: row.created_at,
      lastLogin: row.last_login,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// Export Supabase client for advanced usage
export { supabase };

