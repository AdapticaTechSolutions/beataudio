// API route: GET /api/bookings - Get all bookings
// POST /api/bookings - Create a new booking

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBookings, createBooking } from '../../lib/api/storage';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const bookings = await getBookings();
      res.status(200).json({ success: true, data: bookings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      console.log('Creating booking, environment check:', {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      });
      const bookingData = req.body;
      
      // Validate required fields
      if (!bookingData.email || !bookingData.eventDate || !bookingData.eventType) {
        res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: email, eventDate, and eventType are required' 
        });
        return;
      }
      
      const newBooking = await createBooking({
        ...bookingData,
        status: 'Inquiry',
      });
      res.status(201).json({ success: true, data: newBooking });
    } catch (error: any) {
      console.error('Error creating booking:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      });
      // Return more detailed error information
      const errorMessage = error.message || 'Failed to create booking';
      const errorDetails = error.details || error.hint || '';
      res.status(500).json({ 
        success: false, 
        error: errorMessage,
        details: errorDetails,
        code: error.code,
        // Include more info in development
        ...(process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development' ? {
          stack: error.stack,
          fullError: error.toString(),
        } : {}),
      });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

