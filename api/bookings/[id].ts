// API route: GET /api/bookings/[id] - Get single booking
// PUT /api/bookings/[id] - Update booking
// DELETE /api/bookings/[id] - Delete booking

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getBookingById, updateBooking, deleteBooking } from '../../lib/api/storage.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const booking = await getBookingById(id as string);
      if (!booking) {
        res.status(404).json({ success: false, error: 'Booking not found' });
        return;
      }
      res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const updateData = req.body;
      
      // Security: Check if sensitive fields are being updated
      const sensitiveFields = ['quoteContent', 'archived', 'archivedAt', 'archivedBy', 'lastEditedBy', 'lastEditedAt'];
      const hasSensitiveFields = Object.keys(updateData).some(key => sensitiveFields.includes(key));
      
      if (hasSensitiveFields) {
        // In production, verify admin token here
        // For now, we'll allow but log a warning
        console.warn('⚠️ Sensitive field update detected - implement proper admin auth in production');
      }
      
      const updatedBooking = await updateBooking(id as string, updateData);
      if (!updatedBooking) {
        res.status(404).json({ success: false, error: 'Booking not found' });
        return;
      }
      res.status(200).json({ success: true, data: updatedBooking });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleted = await deleteBooking(id as string);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Booking not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Booking deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

