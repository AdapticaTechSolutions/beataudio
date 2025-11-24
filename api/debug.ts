// Consolidated debug endpoint
// Access at: /api/debug?type=supabase|login|booking|users

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { getUserByUsername } from '../lib/api/storage';

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

  const debugType = (req.query.type as string) || 'supabase';
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    res.status(200).json({
      success: false,
      error: 'Supabase credentials not configured',
    });
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (debugType) {
      case 'supabase': {
        // Test Supabase connection
        const { data, error } = await supabase.from('bookings').select('count').limit(1);
        res.status(200).json({
          success: !error,
          type: 'supabase',
          connection: !error ? 'OK' : 'FAILED',
          error: error?.message,
        });
        break;
      }

      case 'users': {
        // List all users
        const { data: users, error } = await supabase
          .from('users')
          .select('id, username, email, role')
          .limit(10);
        res.status(200).json({
          success: !error,
          type: 'users',
          count: users?.length || 0,
          users: users || [],
          error: error?.message,
        });
        break;
      }

      case 'login': {
        // Test user lookup
        const username = (req.query.username as string) || 'admin';
        const user = await getUserByUsername(username);
        res.status(200).json({
          success: !!user,
          type: 'login',
          username,
          userFound: !!user,
          user: user ? {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            hasPassword: !!user.passwordHash,
          } : null,
        });
        break;
      }

      case 'booking': {
        // Test booking creation
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

        const { data, error } = await supabase
          .from('bookings')
          .insert(testBooking)
          .select()
          .single();

        if (!error && data) {
          // Clean up
          await supabase.from('bookings').delete().eq('id', testBooking.id);
        }

        res.status(200).json({
          success: !error,
          type: 'booking',
          testResult: !error ? 'Insert/Delete OK' : 'FAILED',
          error: error?.message,
        });
        break;
      }

      case 'full': {
        // Run all tests
        const results: any = {
          supabase: null,
          users: null,
          login: null,
          booking: null,
        };

        // Test 1: Supabase connection
        try {
          const { error } = await supabase.from('bookings').select('count').limit(1);
          results.supabase = { success: !error, error: error?.message };
        } catch (e: any) {
          results.supabase = { success: false, error: e.message };
        }

        // Test 2: Users
        try {
          const { data: users, error } = await supabase
            .from('users')
            .select('id, username, email, role')
            .limit(10);
          results.users = {
            success: !error,
            count: users?.length || 0,
            error: error?.message,
          };
        } catch (e: any) {
          results.users = { success: false, error: e.message };
        }

        // Test 3: Login
        try {
          const user = await getUserByUsername('admin');
          results.login = {
            success: !!user,
            userFound: !!user,
            error: user ? null : 'User not found',
          };
        } catch (e: any) {
          results.login = { success: false, error: e.message };
        }

        // Test 4: Booking
        try {
          const testBooking = {
            id: `TEST-${Date.now()}`,
            customer_name: 'Test',
            email: 'test@test.com',
            event_date: new Date().toISOString().split('T')[0],
            event_type: 'Test',
            venue: 'Test',
            guest_count: 1,
            services: ['Test'],
            status: 'Inquiry',
          };
          const { error } = await supabase.from('bookings').insert(testBooking);
          if (!error) {
            await supabase.from('bookings').delete().eq('id', testBooking.id);
          }
          results.booking = { success: !error, error: error?.message };
        } catch (e: any) {
          results.booking = { success: false, error: e.message };
        }

        const allPassed = Object.values(results).every((r: any) => r.success);

        res.status(200).json({
          success: allPassed,
          type: 'full',
          results,
          summary: {
            passed: Object.values(results).filter((r: any) => r.success).length,
            total: Object.keys(results).length,
          },
        });
        break;
      }

      default:
        res.status(200).json({
          success: false,
          error: 'Unknown debug type',
          availableTypes: ['supabase', 'users', 'login', 'booking', 'full'],
        });
    }
  } catch (error: any) {
    res.status(200).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}

