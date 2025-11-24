// API route: POST /api/users/seed - Create default admin users
// This is a one-time setup endpoint

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  // IMPORTANT: Use SERVICE_ROLE_KEY for seeding (bypasses RLS)
  // ANON_KEY will fail due to RLS policies
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).json({
      success: false,
      error: 'Supabase credentials not configured',
      hint: 'Make sure SUPABASE_SERVICE_ROLE_KEY is set in Vercel environment variables',
    });
    return;
  }

  // Warn if using ANON_KEY (will likely fail due to RLS)
  const isUsingAnonKey = !process.env.SUPABASE_SERVICE_ROLE_KEY && !!process.env.VITE_SUPABASE_ANON_KEY;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Default admin users
    const defaultUsers = [
      {
        username: 'admin',
        email: 'admin@beataudio.ph',
        password_hash: 'password', // In production, use bcrypt hash
        role: 'admin',
      },
      {
        username: 'staff',
        email: 'staff@beataudio.ph',
        password_hash: 'password',
        role: 'staff',
      },
    ];

    const results = [];

    for (const user of defaultUsers) {
      // Check if user already exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', user.username)
        .single();

      if (existing) {
        results.push({
          username: user.username,
          status: 'exists',
          message: 'User already exists',
        });
        continue;
      }

      // Insert new user
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();

      if (error) {
        results.push({
          username: user.username,
          status: 'error',
          error: error.message,
          code: error.code,
          hint: error.code === '42501' 
            ? 'Row Level Security (RLS) is blocking inserts. Use SERVICE_ROLE_KEY or disable RLS temporarily.'
            : error.hint || '',
        });
      } else {
        results.push({
          username: user.username,
          status: 'created',
          id: data.id,
        });
      }
    }

    const allCreated = results.every(r => r.status === 'created' || r.status === 'exists');
    const hasErrors = results.some(r => r.status === 'error');

    res.status(200).json({
      success: allCreated && !hasErrors,
      message: hasErrors 
        ? 'Some users failed to create. Check errors below.'
        : 'Users seeded successfully',
      results,
      credentials: {
        admin: { username: 'admin', password: 'password' },
        staff: { username: 'staff', password: 'password' },
      },
      note: '⚠️ Change these passwords in production!',
      rlsWarning: isUsingAnonKey 
        ? '⚠️ Using ANON_KEY - RLS policies may block inserts. Use SERVICE_ROLE_KEY for seeding.'
        : undefined,
      instructions: hasErrors && results[0]?.code === '42501' 
        ? [
            'RLS is blocking user creation. Solutions:',
            '1. Add SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables (recommended)',
            '2. Or disable RLS temporarily: ALTER TABLE users DISABLE ROW LEVEL SECURITY;',
            '3. Or create users directly in Supabase SQL Editor (see below)',
          ]
        : undefined,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}

