// Supabase storage implementation
// This replaces the in-memory storage with Supabase PostgreSQL database

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Booking, User } from '../../types';

// Lazy initialization pattern for Vercel serverless functions
// CRITICAL: Never throw errors at module level - this causes FUNCTION_INVOCATION_FAILED
// Instead, initialize the client lazily when functions are called

let supabaseClient: SupabaseClient | null = null;

/**
 * Get or initialize the Supabase client lazily
 * This prevents module-level errors that crash serverless functions
 */
function getSupabaseClient(): SupabaseClient {
  // If already initialized, return cached client
  if (supabaseClient) {
    return supabaseClient;
  }

  // Get credentials from environment variables
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  // Log config for debugging (but don't throw - let functions handle errors)
  if (process.env.VERCEL_ENV || process.env.NODE_ENV === 'development') {
    console.log('Supabase initialization:', {
      hasUrl: !!supabaseUrl,
      urlLength: supabaseUrl?.length || 0,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      serviceRoleKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) || 'none',
      hasAnonKey: !!process.env.VITE_SUPABASE_ANON_KEY,
      usingServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      env: process.env.VERCEL_ENV || process.env.NODE_ENV,
    });
  }

  // Validate credentials
  if (!supabaseUrl || !supabaseKey) {
    const errorMsg = 'Supabase credentials not found. Check environment variables:';
    console.error(errorMsg, {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      VITE_SUPABASE_ANON_KEY: !!process.env.VITE_SUPABASE_ANON_KEY,
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE')),
    });
    // Throw here - but only when function is called, not at module load
    // This allows API routes to catch and return proper HTTP errors
    throw new Error(`${errorMsg} SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set`);
  }

  // Create and cache the client
  // Wrap in try-catch to handle invalid credentials gracefully
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    return supabaseClient;
  } catch (error: any) {
    console.error('Failed to create Supabase client:', error);
    throw new Error(`Failed to initialize Supabase client: ${error.message || 'Invalid credentials'}`);
  }
}

/**
 * Check if Supabase is configured without throwing
 */
function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  return !!(supabaseUrl && supabaseKey);
}

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
    quoteContent: row.quote_content,
    status: row.status || 'Inquiry',
    archived: row.archived || false,
    archivedAt: row.archived_at,
    archivedBy: row.archived_by,
    lastEditedBy: row.last_edited_by,
    lastEditedAt: row.last_edited_at,
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
  const row: any = {};
  
  // Only include fields that are actually provided (not undefined)
  if (booking.id !== undefined) row.id = booking.id;
  if (booking.customerName !== undefined) row.customer_name = booking.customerName;
  if (booking.fullName !== undefined) row.full_name = booking.fullName;
  if (booking.contactNumber !== undefined) row.contact_number = booking.contactNumber;
  if (booking.celNumber !== undefined) row.cel_number = booking.celNumber;
  if (booking.email !== undefined) row.email = booking.email;
  if (booking.eventDate !== undefined) row.event_date = booking.eventDate;
  if (booking.eventType !== undefined) row.event_type = booking.eventType;
  if (booking.venue !== undefined) row.venue = booking.venue;
  if (booking.venueAddress !== undefined) row.venue_address = booking.venueAddress;
  if (booking.ceremonyVenue !== undefined) row.ceremony_venue = booking.ceremonyVenue;
  if (booking.guestCount !== undefined) row.guest_count = booking.guestCount;
  if (booking.services !== undefined) row.services = booking.services;
  if (booking.bandRider !== undefined) row.band_rider = booking.bandRider;
  if (booking.totalAmount !== undefined) row.total_amount = booking.totalAmount;
  if (booking.quoteContent !== undefined) row.quote_content = booking.quoteContent;
  if (booking.status !== undefined) row.status = booking.status;
  if (booking.archived !== undefined) row.archived = booking.archived;
  if (booking.archivedAt !== undefined) row.archived_at = booking.archivedAt;
  if (booking.archivedBy !== undefined) row.archived_by = booking.archivedBy;
  
  // Only include audit fields if they exist in the database (check via migration)
  // These fields may not exist if migration hasn't been run yet
  // We'll try to include them, but Supabase will ignore if column doesn't exist
  if (booking.lastEditedBy !== undefined) {
    try {
      row.last_edited_by = booking.lastEditedBy;
    } catch (e) {
      // Column doesn't exist, skip it
      console.warn('last_edited_by column not found, skipping');
    }
  }
  if (booking.lastEditedAt !== undefined) {
    try {
      row.last_edited_at = booking.lastEditedAt;
    } catch (e) {
      // Column doesn't exist, skip it
      console.warn('last_edited_at column not found, skipping');
    }
  }
  
  if (booking.weddingSetup !== undefined) row.wedding_setup = booking.weddingSetup;
  if (booking.serviceLights !== undefined) row.service_lights = booking.serviceLights;
  if (booking.serviceSounds !== undefined) row.service_sounds = booking.serviceSounds;
  if (booking.serviceLedWall !== undefined) row.service_led_wall = booking.serviceLedWall;
  if (booking.serviceProjector !== undefined) row.service_projector = booking.serviceProjector;
  if (booking.serviceSmoke !== undefined) row.service_smoke = booking.serviceSmoke;
  if (booking.hasBand !== undefined) row.has_band = booking.hasBand;
  if (booking.additionalNotes !== undefined) row.additional_notes = booking.additionalNotes;
  
  // Always update the updated_at timestamp
  row.updated_at = new Date().toISOString();
  
  return row;
}

// Get all bookings
export async function getBookings(): Promise<Booking[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - returning empty bookings array');
    return [];
  }

  try {
    const supabase = getSupabaseClient();
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
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - cannot fetch booking');
    return null;
  }

  try {
    const supabase = getSupabaseClient();
    // Use limit(1) instead of single() to avoid UUID validation issues
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .limit(1);

    if (error) {
      console.error('Error fetching booking:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return mapRowToBooking(data[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
}

// Create a new booking
export async function createBooking(
  booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Booking> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }

  try {
    const supabase = getSupabaseClient();
    const bookingId = generateBookingId();
    const bookingRow = mapBookingToRow({
      ...booking,
      id: bookingId,
    });

    // Remove undefined values to avoid Supabase errors
    const cleanBookingRow = Object.fromEntries(
      Object.entries(bookingRow).filter(([_, v]) => v !== undefined)
    );

    // Use limit(1) instead of single() to avoid UUID validation issues
    const { data, error } = await supabase
      .from('bookings')
      .insert(cleanBookingRow)
      .select()
      .limit(1);

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

    if (!data || data.length === 0) {
      throw new Error('No data returned from Supabase insert');
    }

    return mapRowToBooking(data[0]);
  } catch (error: any) {
    // Re-throw configuration errors with helpful message
    if (error.message?.includes('credentials not found') || error.message?.includes('must be set')) {
      throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables in Vercel dashboard.');
    }
    throw error;
  }
}

// Update a booking
export async function updateBooking(
  id: string,
  updates: Partial<Booking>
): Promise<Booking | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - cannot update booking');
    return null;
  }

  try {
    const supabase = getSupabaseClient();
    
    // First verify the booking exists
    const existingBooking = await getBookingById(id);
    if (!existingBooking) {
      console.error(`Booking not found: ${id}`);
      throw new Error(`Booking not found: ${id}`);
    }

    const updateRow = mapBookingToRow(updates);
    delete updateRow.id; // Don't update the ID
    
    // Remove undefined/null values to avoid issues (though mapBookingToRow should handle this now)
    const cleanUpdateRow = Object.fromEntries(
      Object.entries(updateRow).filter(([_, v]) => v !== undefined && v !== null)
    );

    // Remove audit fields if columns don't exist (graceful degradation)
    // Check if these columns might not exist and remove them if needed
    const columnsToSkipIfMissing = ['last_edited_by', 'last_edited_at', 'archived_at', 'archived_by', 'quote_content'];
    const safeUpdateRow: any = {};
    
    for (const [key, value] of Object.entries(cleanUpdateRow)) {
      // Include all fields - Supabase will error if column doesn't exist, we'll catch it
      safeUpdateRow[key] = value;
    }

    // Ensure we have something to update
    if (Object.keys(safeUpdateRow).length === 0) {
      console.warn('No fields to update');
      return existingBooking; // Return existing if nothing to update
    }

    // Log for debugging
    console.log('Updating booking:', { 
      id, 
      updateFields: Object.keys(safeUpdateRow),
      updateValues: safeUpdateRow
    });

    // Use limit(1) instead of single() to avoid UUID validation issues
    const { data, error } = await supabase
      .from('bookings')
      .update(safeUpdateRow)
      .eq('id', id)
      .select()
      .limit(1);

    if (error) {
      // Check if error is about missing column (common if migration hasn't been run)
      if (error.message?.includes('column') && (error.message?.includes('not found') || error.message?.includes('schema cache'))) {
        console.warn('Column not found error detected, retrying without optional audit fields');
        
        // Remove potentially missing columns and retry
        const retryUpdateRow = { ...safeUpdateRow };
        const optionalColumns = ['last_edited_by', 'last_edited_at', 'archived_at', 'archived_by', 'quote_content'];
        
        for (const col of optionalColumns) {
          if (retryUpdateRow[col] !== undefined) {
            delete retryUpdateRow[col];
            console.log(`Removed optional column: ${col}`);
          }
        }
        
        // Ensure we still have fields to update
        if (Object.keys(retryUpdateRow).length === 0) {
          console.warn('No fields remaining after removing optional columns');
          return existingBooking;
        }
        
        // Retry without optional audit fields
        const { data: retryData, error: retryError } = await supabase
          .from('bookings')
          .update(retryUpdateRow)
          .eq('id', id)
          .select()
          .limit(1);
        
        if (retryError) {
          console.error('Supabase update error (after retry):', {
            id,
            error: retryError.message,
            code: retryError.code,
            details: retryError.details,
            hint: retryError.hint
          });
          throw new Error(`Failed to update booking: ${retryError.message || 'Unknown error'}. ${retryError.details || ''} ${retryError.hint || ''}`);
        }
        
        if (!retryData || retryData.length === 0) {
          throw new Error(`Update completed but booking not found: ${id}`);
        }
        
        console.log('Update successful (without optional audit fields)');
        return mapRowToBooking(retryData[0]);
      }
      
      console.error('Supabase update error:', {
        id,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        updateRow: safeUpdateRow
      });
      throw new Error(`Failed to update booking: ${error.message || 'Unknown error'}. ${error.details || ''} ${error.hint || ''}`);
    }

    if (!data || data.length === 0) {
      console.error(`No data returned after update for booking: ${id}`);
      throw new Error(`Update completed but booking not found: ${id}`);
    }

    return mapRowToBooking(data[0]);
  } catch (error: any) {
    console.error('Error updating booking:', {
      id,
      error: error.message,
      stack: error.stack
    });
    throw error; // Re-throw to let API handle it
  }
}

// Delete a booking
export async function deleteBooking(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - cannot delete booking');
    return false;
  }

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting booking:', error);
    return false;
  }
}

// Get user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  // Validate input first
  if (!username || typeof username !== 'string' || username.trim() === '') {
    console.warn('Invalid username provided');
    return null;
  }

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured - cannot fetch user');
    throw new Error('Database not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }

  try {
    const supabase = getSupabaseClient();
    const trimmedUsername = username.trim();
    
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
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - returning empty users array');
    return [];
  }

  try {
    const supabase = getSupabaseClient();
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

// Export Supabase client getter for advanced usage (lazy initialization)
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    return getSupabaseClient();
  } catch {
    return null;
  }
}

