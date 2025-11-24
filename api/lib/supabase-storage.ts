// Supabase storage implementation
// This replaces the in-memory storage with Supabase PostgreSQL database

import { createClient } from '@supabase/supabase-js';
import type { Booking, User } from '../../types';

// Initialize Supabase client
// Use service_role key for server-side operations (full access)
// Use anon key for client-side operations (respects RLS policies)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found. Using in-memory storage.');
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

  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingRow)
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw error;
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
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
      passwordHash: data.password_hash,
      createdAt: data.created_at,
      lastLogin: data.last_login,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
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

