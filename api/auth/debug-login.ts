// Debug endpoint for login issues
// Access at: /api/auth/debug-login?username=admin

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  const username = (req.query.username as string) || 'admin';

  if (!supabaseUrl || !supabaseKey) {
    res.status(200).json({
      success: false,
      error: 'Supabase credentials not configured',
    });
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Try to find user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (userError) {
      res.status(200).json({
        success: false,
        error: 'User lookup failed',
        errorDetails: {
          message: userError.message,
          code: userError.code,
          details: userError.details,
          hint: userError.hint,
        },
        username,
      });
      return;
    }

    if (!userData) {
      res.status(200).json({
        success: false,
        error: 'User not found',
        username,
        suggestion: 'Create user using SQL: INSERT INTO users (username, email, password_hash, role) VALUES (\'admin\', \'admin@beataudio.ph\', \'password\', \'admin\');',
      });
      return;
    }

    // Test 2: Validate data structure
    const validation = {
      hasId: !!userData.id,
      idType: typeof userData.id,
      idValue: userData.id,
      isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(userData.id || '')),
      hasUsername: !!userData.username,
      hasEmail: !!userData.email,
      hasPasswordHash: !!userData.password_hash,
      hasRole: !!userData.role,
    };

    // Test 3: Try to construct user object (like login does)
    let userObject;
    try {
      const userId = typeof userData.id === 'string' ? userData.id : String(userData.id);
      const validRoles = ['admin', 'staff', 'viewer'] as const;
      const userRole = validRoles.includes(userData.role as any) 
        ? (userData.role as 'admin' | 'staff' | 'viewer')
        : 'staff';

      userObject = {
        id: userId,
        username: String(userData.username || ''),
        email: String(userData.email || ''),
        role: userRole,
        passwordHash: String(userData.password_hash || ''),
        createdAt: userData.created_at ? String(userData.created_at) : new Date().toISOString(),
        lastLogin: userData.last_login ? String(userData.last_login) : undefined,
      };
    } catch (parseError: any) {
      res.status(200).json({
        success: false,
        error: 'Failed to parse user data',
        parseError: parseError.message,
        rawData: userData,
        validation,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User data is valid',
      username,
      validation,
      userData: {
        raw: userData,
        parsed: userObject,
      },
      testLogin: {
        username: userObject.username,
        passwordMatch: userObject.passwordHash === 'password',
        canLogin: userObject.passwordHash === 'password',
      },
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

