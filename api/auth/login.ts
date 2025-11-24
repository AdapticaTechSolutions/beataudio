// API route: POST /api/auth/login - Authenticate user

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserByUsername } from '../lib/storage';

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
      user = await getUserByUsername(trimmedUsername);
    } catch (dbError: any) {
      console.error('Database error fetching user:', dbError);
      res.status(500).json({ 
        success: false, 
        error: 'Database error',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
      return;
    }

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid username or password' });
      return;
    }

    // Validate user data structure
    if (!user.id || !user.username || !user.passwordHash) {
      console.error('Invalid user data structure:', user);
      res.status(500).json({ 
        success: false, 
        error: 'Invalid user data',
        details: 'User record is missing required fields'
      });
      return;
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
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Login failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

