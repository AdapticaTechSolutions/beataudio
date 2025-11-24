// Test endpoint for Supabase connection
// Access at: /api/test-supabase

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {
      passed: 0,
      failed: 0,
      total: 0,
    },
  };

  // Test 1: Check environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  results.tests.push({
    name: 'Environment Variables Check',
    status: supabaseUrl && (supabaseAnonKey || supabaseServiceKey) ? 'PASS' : 'FAIL',
    details: {
      url: supabaseUrl ? '✅ Set' : '❌ Missing',
      anonKey: supabaseAnonKey ? '✅ Set' : '❌ Missing',
      serviceKey: supabaseServiceKey ? '✅ Set' : '⚠️ Not set (using anon key)',
    },
  });

  if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceKey)) {
    results.summary.failed++;
    results.summary.total++;
    res.status(200).json({
      success: false,
      error: 'Supabase credentials not configured',
      results,
      instructions: [
        '1. Go to Supabase Dashboard → Settings → API',
        '2. Copy your Project URL and API keys',
        '3. Add them to Vercel Dashboard → Settings → Environment Variables:',
        '   - VITE_SUPABASE_URL',
        '   - VITE_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY)',
      ],
    });
    return;
  }

  results.summary.passed++;
  results.summary.total++;

  // Test 2: Initialize Supabase client
  let supabase;
  try {
    const key = supabaseServiceKey || supabaseAnonKey!;
    supabase = createClient(supabaseUrl, key);
    results.tests.push({
      name: 'Supabase Client Initialization',
      status: 'PASS',
      details: 'Client created successfully',
    });
    results.summary.passed++;
    results.summary.total++;
  } catch (error: any) {
    results.tests.push({
      name: 'Supabase Client Initialization',
      status: 'FAIL',
      details: error.message,
    });
    results.summary.failed++;
    results.summary.total++;
    res.status(200).json({
      success: false,
      error: 'Failed to initialize Supabase client',
      results,
    });
    return;
  }

  // Test 3: Check database connection (test bookings table)
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('count')
      .limit(1);

    if (error) {
      // Check if it's a "relation does not exist" error
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        results.tests.push({
          name: 'Database Connection',
          status: 'FAIL',
          details: 'Bookings table does not exist. Create it using the SQL in SUPABASE_GUIDE.md',
        });
        results.summary.failed++;
        results.summary.total++;
      } else {
        results.tests.push({
          name: 'Database Connection',
          status: 'FAIL',
          details: error.message,
          errorCode: error.code,
        });
        results.summary.failed++;
        results.summary.total++;
      }
    } else {
      results.tests.push({
        name: 'Database Connection',
        status: 'PASS',
        details: 'Successfully connected to bookings table',
      });
      results.summary.passed++;
      results.summary.total++;
    }
  } catch (error: any) {
    results.tests.push({
      name: 'Database Connection',
      status: 'FAIL',
      details: error.message,
    });
    results.summary.failed++;
    results.summary.total++;
  }

  // Test 4: Test CRUD operations (if table exists)
  try {
    // Try to read bookings
    const { data: bookings, error: readError } = await supabase
      .from('bookings')
      .select('*')
      .limit(5);

    if (!readError) {
      results.tests.push({
        name: 'Read Operation (SELECT)',
        status: 'PASS',
        details: `Successfully read ${bookings?.length || 0} bookings`,
      });
      results.summary.passed++;
      results.summary.total++;

      // Test insert (create a test booking)
      const testBooking = {
        id: `TEST-${Date.now()}`,
        customer_name: 'Test User',
        email: 'test@example.com',
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

      if (!insertError && inserted) {
        results.tests.push({
          name: 'Create Operation (INSERT)',
          status: 'PASS',
          details: 'Successfully created test booking',
          testBookingId: inserted.id,
        });
        results.summary.passed++;
        results.summary.total++;

        // Test update
        const { data: updated, error: updateError } = await supabase
          .from('bookings')
          .update({ status: 'Confirmed' })
          .eq('id', inserted.id)
          .select()
          .single();

        if (!updateError && updated) {
          results.tests.push({
            name: 'Update Operation (UPDATE)',
            status: 'PASS',
            details: 'Successfully updated test booking',
          });
          results.summary.passed++;
          results.summary.total++;

          // Test delete
          const { error: deleteError } = await supabase
            .from('bookings')
            .delete()
            .eq('id', inserted.id);

          if (!deleteError) {
            results.tests.push({
              name: 'Delete Operation (DELETE)',
              status: 'PASS',
              details: 'Successfully deleted test booking',
            });
            results.summary.passed++;
            results.summary.total++;
          } else {
            results.tests.push({
              name: 'Delete Operation (DELETE)',
              status: 'FAIL',
              details: deleteError.message,
            });
            results.summary.failed++;
            results.summary.total++;
          }
        } else {
          results.tests.push({
            name: 'Update Operation (UPDATE)',
            status: 'FAIL',
            details: updateError?.message || 'Update failed',
          });
          results.summary.failed++;
          results.summary.total++;
        }
      } else {
        results.tests.push({
          name: 'Create Operation (INSERT)',
          status: 'FAIL',
          details: insertError?.message || 'Insert failed',
          hint: 'Check Row Level Security (RLS) policies in Supabase',
        });
        results.summary.failed++;
        results.summary.total++;
      }
    } else {
      results.tests.push({
        name: 'Read Operation (SELECT)',
        status: 'FAIL',
        details: readError.message,
      });
      results.summary.failed++;
      results.summary.total++;
    }
  } catch (error: any) {
    results.tests.push({
      name: 'CRUD Operations',
      status: 'FAIL',
      details: error.message,
    });
    results.summary.failed++;
    results.summary.total++;
  }

  // Test 5: Check users table
  try {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (usersError) {
      if (usersError.code === '42P01') {
        results.tests.push({
          name: 'Users Table Check',
          status: 'WARN',
          details: 'Users table does not exist. Create it using the SQL in SUPABASE_GUIDE.md',
        });
      } else {
        results.tests.push({
          name: 'Users Table Check',
          status: 'FAIL',
          details: usersError.message,
        });
      }
    } else {
      results.tests.push({
        name: 'Users Table Check',
        status: 'PASS',
        details: 'Users table exists',
      });
      results.summary.passed++;
      results.summary.total++;
    }
  } catch (error: any) {
    results.tests.push({
      name: 'Users Table Check',
      status: 'WARN',
      details: error.message,
    });
  }

  // Final summary
  const allPassed = results.summary.failed === 0;
  const success = allPassed && results.summary.passed > 0;

  res.status(200).json({
    success,
    message: success
      ? '✅ All tests passed! Supabase is working correctly.'
      : '⚠️ Some tests failed. Check details below.',
    results,
    nextSteps: success
      ? [
          '1. Switch to Supabase storage in api/lib/storage.ts',
          '2. Test your booking form',
          '3. Check admin portal',
        ]
      : [
          '1. Check environment variables in Vercel',
          '2. Create database tables using SQL from SUPABASE_GUIDE.md',
          '3. Check Row Level Security policies',
          '4. Verify API keys are correct',
        ],
  });
}

