// API route: DELETE /api/payments/[id] - Delete a payment record (for refund/remove payment)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from '../../lib/api/supabase-storage.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        res.status(400).json({ 
          success: false, 
          error: 'Payment ID is required' 
        });
        return;
      }

      const supabase = getSupabase();
      if (!supabase) {
        res.status(500).json({ success: false, error: 'Database not configured' });
        return;
      }

      // First, get the payment to get booking_id
      const { data: payment, error: fetchError } = await supabase
        .from('payments')
        .select('booking_id')
        .eq('id', id)
        .single();

      if (fetchError || !payment) {
        res.status(404).json({ 
          success: false, 
          error: 'Payment not found' 
        });
        return;
      }

      // Delete the payment
      const { error: deleteError } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting payment:', deleteError);
        res.status(500).json({ 
          success: false, 
          error: deleteError.message || 'Failed to delete payment' 
        });
        return;
      }

      res.status(200).json({ 
        success: true, 
        message: 'Payment deleted successfully',
        bookingId: payment.booking_id,
      });
    } catch (error: any) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to delete payment' 
      });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

