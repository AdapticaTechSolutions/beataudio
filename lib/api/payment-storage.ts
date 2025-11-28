// Payment storage functions for Supabase
// Handles all payment-related database operations

// Import the internal function - we'll access it through a helper
// Since getSupabaseClient is not exported, we need to use getSupabase() which is exported
import { getSupabase } from './supabase-storage.js';
import type { PaymentRecord } from '../../types';

// Helper to get Supabase client (throws if not configured)
function getSupabaseClient() {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase not configured');
  }
  return client;
}

/**
 * Map database row to PaymentRecord type
 */
function mapRowToPayment(row: any): PaymentRecord {
  return {
    id: row.id,
    bookingId: row.booking_id,
    amount: parseFloat(row.amount),
    paymentType: row.payment_type,
    paymentMethod: row.payment_method,
    referenceNumber: row.reference_number,
    transactionId: row.transaction_id,
    paidAt: row.paid_at,
    paidBy: row.paid_by,
    validatedBy: row.validated_by,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Map PaymentRecord to database row
 */
function mapPaymentToRow(payment: Partial<PaymentRecord>): any {
  return {
    booking_id: payment.bookingId,
    amount: payment.amount,
    payment_type: payment.paymentType,
    payment_method: payment.paymentMethod,
    // Convert empty strings to null for optional fields
    reference_number: payment.referenceNumber && payment.referenceNumber.trim() ? payment.referenceNumber.trim() : null,
    transaction_id: payment.transactionId && payment.transactionId.trim() ? payment.transactionId.trim() : null,
    paid_at: payment.paidAt || new Date().toISOString(),
    paid_by: payment.paidBy && payment.paidBy.trim() ? payment.paidBy.trim() : null,
    validated_by: payment.validatedBy && payment.validatedBy.trim() ? payment.validatedBy.trim() : null,
    notes: payment.notes && payment.notes.trim() ? payment.notes.trim() : null,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Get all payments, optionally filtered by booking ID
 */
export async function getPayments(bookingId?: string): Promise<PaymentRecord[]> {
  try {
    const supabase = getSupabaseClient(); // This is the internal function, not exported
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
      return [];
    }

    return (data || []).map(mapRowToPayment);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
}

/**
 * Create a new payment record
 */
export async function createPayment(
  payment: Omit<PaymentRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<PaymentRecord> {
  try {
    const supabase = getSupabaseClient();
    const paymentRow = mapPaymentToRow(payment);

    // Remove undefined values and ensure null for optional fields
    const cleanPaymentRow = Object.fromEntries(
      Object.entries(paymentRow).filter(([_, v]) => v !== undefined)
    );

    console.log('Creating payment with data:', {
      ...cleanPaymentRow,
      // Don't log sensitive data, but log structure
      reference_number_length: typeof cleanPaymentRow.reference_number === 'string' ? cleanPaymentRow.reference_number.length : 0,
      transaction_id_length: typeof cleanPaymentRow.transaction_id === 'string' ? cleanPaymentRow.transaction_id.length : 0,
    });

    const { data, error } = await supabase
      .from('payments')
      .insert(cleanPaymentRow)
      .select()
      .single();

    if (error) {
      console.error('Error creating payment:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: JSON.stringify(error, null, 2),
      });
      
      // Provide more helpful error messages
      if (error.message?.includes('pattern') || error.message?.includes('expected')) {
        throw new Error(`Invalid data format: ${error.message}. Please check reference number and transaction ID format.`);
      }
      
      throw new Error(`Failed to create payment: ${error.message || 'Unknown error'}`);
    }

    if (!data) {
      throw new Error('No data returned from payment insert');
    }

    return mapRowToPayment(data);
  } catch (error: any) {
    console.error('Error creating payment:', error);
    throw error;
  }
}

/**
 * Get payment by ID
 */
export async function getPaymentById(id: string): Promise<PaymentRecord | null> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching payment:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return mapRowToPayment(data);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return null;
  }
}

/**
 * Get total amount paid for a booking
 */
export async function getTotalPaidForBooking(bookingId: string): Promise<number> {
  try {
    const payments = await getPayments(bookingId);
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  } catch (error) {
    console.error('Error calculating total paid:', error);
    return 0;
  }
}

