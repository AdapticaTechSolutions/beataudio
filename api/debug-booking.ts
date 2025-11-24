// Debug endpoint to test booking creation
// Access at: /api/debug-booking

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  const debugInfo = {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlLength: supabaseUrl.length,
    keyLength: supabaseKey.length,
    envVars: {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      VITE_SUPABASE_ANON_KEY: !!process.env.VITE_SUPABASE_ANON_KEY,
    },
  };

  if (!supabaseUrl || !supabaseKey) {
    res.status(200).json({
      success: false,
      error: 'Supabase credentials not configured',
      debug: debugInfo,
      instructions: 'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY) in Vercel environment variables',
    });
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test connection
    const { data, error } = await supabase
      .from('bookings')
      .select('count')
      .limit(1);

    if (error) {
      res.status(200).json({
        success: false,
        error: 'Database connection failed',
        errorDetails: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        debug: debugInfo,
      });
      return;
    }

    // Test insert with minimal data
    const testBooking = {
      id: `DEBUG-${Date.now()}`,
      customer_name: 'Debug Test',
      email: 'debug@test.com',
      event_date: new Date().toISOString().split('T')[0],
      event_type: 'Test',
      venue: 'Test Venue',
      guest_count: 1,
      services: ['Test'],
      status: 'Inquiry',
    };

    const { data: inserted, error: insertError } = await supabase
      .from('bookings')
      .insert(testBooking)
      .select()
      .single();

    if (insertError) {
      res.status(200).json({
        success: false,
        error: 'Insert test failed',
        errorDetails: {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
        },
        testBooking,
        debug: debugInfo,
        suggestion: insertError.code === '42501' 
          ? 'Check Row Level Security (RLS) policies in Supabase Dashboard'
          : 'Check table schema matches the test booking structure',
      });
      return;
    }

    // Clean up test booking
    await supabase.from('bookings').delete().eq('id', testBooking.id);

    res.status(200).json({
      success: true,
      message: 'All tests passed! Supabase is working correctly.',
      debug: debugInfo,
      testResult: 'Insert and delete operations successful',
    });
  } catch (error: any) {
    res.status(200).json({
      success: false,
      error: 'Unexpected error',
      errorMessage: error.message,
      stack: error.stack,
      debug: debugInfo,
    });
  }
}

