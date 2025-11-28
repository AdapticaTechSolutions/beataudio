// API route: GET /api/payments - Get all payments
// POST /api/payments - Create payment record

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPayments, createPayment } from '../../lib/api/payment-storage.js';

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

  if (req.method === 'GET') {
    try {
      const { bookingId } = req.query;
      const payments = await getPayments(bookingId as string | undefined);
      res.status(200).json({ success: true, data: payments });
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { 
        bookingId, 
        amount, 
        paymentType, 
        paymentMethod, 
        referenceNumber,
        transactionId, 
        notes, 
        paidBy,
        validatedBy 
      } = req.body;

      // Validation
      if (!bookingId || !amount || !paymentType || !paymentMethod) {
        res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: bookingId, amount, paymentType, paymentMethod' 
        });
        return;
      }

      const payment = await createPayment({
        bookingId,
        amount: parseFloat(amount),
        paymentType,
        paymentMethod,
        referenceNumber: referenceNumber || undefined,
        transactionId: transactionId || undefined,
        notes: notes || undefined,
        paidBy: paidBy || undefined,
        validatedBy: validatedBy || undefined,
        paidAt: new Date().toISOString(),
      });

      // Update booking status if full payment received
      if (paymentType === 'full') {
        const { updateBooking } = await import('../../lib/api/supabase-storage.js');
        try {
          await updateBooking(bookingId, { status: 'Confirmed' });
        } catch (updateError) {
          console.error('Error updating booking status:', updateError);
          // Don't fail the payment creation if booking update fails
        }
      }

      res.status(201).json({ success: true, data: payment });
    } catch (error: any) {
      console.error('Payment creation error:', {
        message: error.message,
        stack: error.stack,
        body: req.body,
      });
      
      // Return more detailed error for debugging
      const errorMessage = error.message || 'Failed to create payment';
      res.status(500).json({ 
        success: false, 
        error: errorMessage,
        // Include details in development
        ...(process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development' ? {
          details: error.details,
          hint: error.hint,
        } : {}),
      });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

