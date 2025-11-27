// API route: GET /api/payments - Get all payments
// POST /api/payments - Create payment record

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabase } from '../../lib/api/supabase-storage.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabase = getSupabase();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Database not configured' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const { bookingId } = req.query;

      let query = supabase
        .from('payments')
        .select('*')
        .order('paid_at', { ascending: false });

      if (bookingId) {
        query = query.eq('booking_id', bookingId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ success: false, error: error.message });
        return;
      }

      res.status(200).json({ success: true, data: data || [] });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { bookingId, amount, paymentType, paymentMethod, transactionId, notes, paidBy } = req.body;

      // Validation
      if (!bookingId || !amount || !paymentType || !paymentMethod) {
        res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: bookingId, amount, paymentType, paymentMethod' 
        });
        return;
      }

      const paymentData = {
        booking_id: bookingId,
        amount: parseFloat(amount),
        payment_type: paymentType,
        payment_method: paymentMethod,
        transaction_id: transactionId || null,
        notes: notes || null,
        paid_by: paidBy || null,
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();

      if (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ success: false, error: error.message });
        return;
      }

      // Update booking status if full payment received
      if (paymentType === 'full') {
        await supabase
          .from('bookings')
          .update({ status: 'Confirmed' })
          .eq('id', bookingId);
      }

      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

