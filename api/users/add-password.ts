// API route: POST /api/users/add-password - Add password_hash to existing users
// This fixes users that were created without password_hash

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

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).json({
      success: false,
      error: 'Supabase credentials not configured',
    });
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update admin user
    const { data: adminUpdate, error: adminError } = await supabase
      .from('users')
      .update({ password_hash: 'password' })
      .eq('username', 'admin')
      .select()
      .single();

    // Update staff user
    const { data: staffUpdate, error: staffError } = await supabase
      .from('users')
      .update({ password_hash: 'password' })
      .eq('username', 'staff')
      .select()
      .single();

    const results = {
      admin: adminError 
        ? { error: adminError.message, code: adminError.code }
        : { success: true, updated: !!adminUpdate },
      staff: staffError
        ? { error: staffError.message, code: staffError.code }
        : { success: true, updated: !!staffUpdate },
    };

    const allSuccess = !adminError && !staffError;

    res.status(allSuccess ? 200 : 500).json({
      success: allSuccess,
      message: allSuccess 
        ? 'Passwords added successfully'
        : 'Some updates failed',
      results,
      credentials: {
        admin: { username: 'admin', password: 'password' },
        staff: { username: 'staff', password: 'password' },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}

