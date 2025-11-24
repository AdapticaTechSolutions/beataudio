// Test endpoint to debug login issues
// Access at: /api/auth/test-login

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

  if (!supabaseUrl || !supabaseKey) {
    res.status(200).json({
      success: false,
      error: 'Supabase credentials not configured',
    });
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Check if users table exists and has data
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, username, email, role, password_hash')
      .limit(10);

    if (usersError) {
      res.status(200).json({
        success: false,
        error: 'Failed to query users table',
        errorDetails: {
          message: usersError.message,
          code: usersError.code,
          details: usersError.details,
          hint: usersError.hint,
        },
      });
      return;
    }

    // Test 2: Try to find admin user
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'admin')
      .single();

    // Test 3: Check table structure (skip if RPC not available)
    let tableInfo = null;
    let tableError = null;
    try {
      const result = await supabase.rpc('get_table_info', { table_name: 'users' });
      tableInfo = result.data;
      tableError = result.error;
    } catch (e) {
      // RPC function doesn't exist - that's okay
      tableError = { message: 'RPC function not available' };
    }

    res.status(200).json({
      success: true,
      tests: {
        usersTableExists: !usersError,
        totalUsers: users?.length || 0,
        users: users?.map(u => ({
          id: u.id,
          username: u.username,
          email: u.email,
          role: u.role,
          hasPassword: !!u.password_hash,
        })),
        adminUserFound: !adminError && !!adminUser,
        adminUser: adminUser ? {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
          idType: typeof adminUser.id,
          idValue: adminUser.id,
        } : null,
        adminError: adminError ? {
          message: adminError.message,
          code: adminError.code,
          details: adminError.details,
        } : null,
      },
      recommendations: users?.length === 0
        ? ['No users found. Create users using /api/users/seed']
        : adminError?.code === 'PGRST116'
        ? ['Admin user not found. Create it using /api/users/seed']
        : ['Users table is accessible and contains data'],
    });
  } catch (error: any) {
    res.status(200).json({
      success: false,
      error: 'Unexpected error',
      errorMessage: error.message,
      stack: error.stack,
    });
  }
}

