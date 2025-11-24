// API route: POST /api/auth/login - Authenticate user

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import with error handling
let getUserByUsername: any;
try {
  const storage = require('../../lib/api/storage');
  getUserByUsername = storage.getUserByUsername;
  if (!getUserByUsername) {
    throw new Error('getUserByUsername not exported from storage');
  }
} catch (importError: any) {
  console.error('Failed to import getUserByUsername:', importError);
  // Will handle in handler
}

// Simple password comparison (in production, use bcrypt)
function comparePassword(password: string, hash: string): boolean {
  // For demo purposes, simple comparison
  // In production, use: bcrypt.compare(password, hash)
  return password === hash;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Check if import succeeded
  if (!getUserByUsername) {
    console.error('getUserByUsername function not available');
    res.status(500).json({
      success: false,
      error: 'Server configuration error',
      details: 'Failed to load user lookup function',
    });
    return;
  }

  // Wrap everything in try-catch to prevent function crashes
  try {

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || typeof username !== 'string' || username.trim() === '') {
      res.status(400).json({ success: false, error: 'Username is required and must be a valid string' });
      return;
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      res.status(400).json({ success: false, error: 'Password is required and must be a valid string' });
      return;
    }

    // Trim whitespace
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Get user from database
    let user;
    try {
      console.log('Attempting to fetch user:', trimmedUsername);
      user = await getUserByUsername(trimmedUsername);
      console.log('User fetch result:', user ? 'Found' : 'Not found', user ? { id: user.id, username: user.username } : null);
    } catch (dbError: any) {
      console.error('Database error fetching user:', {
        error: dbError.message,
        stack: dbError.stack,
        username: trimmedUsername,
        errorName: dbError.name,
        errorCode: dbError.code,
        fullError: JSON.stringify(dbError, Object.getOwnPropertyNames(dbError)),
      });
      
      // Return more helpful error messages
      const errorMessage = dbError.message || 'Database error';
      const isPatternError = errorMessage.includes('pattern') || errorMessage.includes('expected');
      const isRLSError = errorMessage.includes('row-level security') || errorMessage.includes('RLS') || dbError.code === '42501';
      
      res.status(500).json({ 
        success: false, 
        error: isPatternError 
          ? 'Database query error. Please disable RLS on users table: ALTER TABLE users DISABLE ROW LEVEL SECURITY;'
          : isRLSError
          ? 'Row Level Security is blocking access. Run: ALTER TABLE users DISABLE ROW LEVEL SECURITY;'
          : errorMessage,
        details: process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development' 
          ? {
              message: dbError.message,
              code: dbError.code,
              hint: isPatternError || isRLSError
                ? 'Go to Supabase Dashboard → SQL Editor → Run: ALTER TABLE users DISABLE ROW LEVEL SECURITY;'
                : 'Check Supabase dashboard and Vercel function logs for more details.',
            }
          : undefined
      });
      return;
    }

    if (!user) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid username or password',
        hint: 'User not found. Create users using /api/users/seed or SQL Editor'
      });
      return;
    }

    // Validate user data structure
    if (!user.id || !user.username || !user.passwordHash) {
      console.error('Invalid user data structure:', {
        user,
        hasId: !!user.id,
        hasUsername: !!user.username,
        hasPasswordHash: !!user.passwordHash,
      });
      res.status(500).json({ 
        success: false, 
        error: 'Invalid user data',
        details: 'User record is missing required fields',
        debug: process.env.NODE_ENV === 'development' ? {
          hasId: !!user.id,
          hasUsername: !!user.username,
          hasPasswordHash: !!user.passwordHash,
        } : undefined
      });
      return;
    }

    // Validate UUID format if it's a UUID
    if (user.id && typeof user.id === 'string') {
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidPattern.test(user.id)) {
        console.warn('User ID is not a valid UUID format:', user.id);
        // Don't fail - just log it, might be a different ID format
      }
    }

    // Verify password
    if (!comparePassword(trimmedPassword, user.passwordHash)) {
      res.status(401).json({ success: false, error: 'Invalid username or password' });
      return;
    }

    // Generate token (in production, use JWT)
    const token = Buffer.from(`${trimmedUsername}:${Date.now()}`).toString('base64');

    // Return user data (without password)
    // Ensure all fields are properly formatted and typed
    const validRoles = ['admin', 'staff', 'viewer'] as const;
    const userRole = validRoles.includes(user.role as any) 
      ? (user.role as 'admin' | 'staff' | 'viewer')
      : 'staff';

    const userResponse = {
      id: String(user.id || ''),
      username: String(user.username || ''),
      email: String(user.email || ''),
      role: userRole,
      createdAt: user.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Validate UUID format if it's supposed to be UUID
    if (userResponse.id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userResponse.id)) {
      console.warn('User ID is not a valid UUID format:', userResponse.id);
    }

    res.status(200).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error: any) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
    });
    
    // Return detailed error in development, generic in production
    const errorResponse: any = {
      success: false,
      error: error.message || 'Login failed',
    };

    if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development') {
      errorResponse.details = error.stack;
      errorResponse.errorCode = error.code;
      errorResponse.errorName = error.name;
    }

    res.status(500).json(errorResponse);
  } catch (outerError: any) {
    // Catch any unhandled errors to prevent function crash
    console.error('Unhandled error in login handler:', {
      message: outerError.message,
      stack: outerError.stack,
      name: outerError.name,
    });
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development'
        ? outerError.message
        : undefined,
    });
  }
}

