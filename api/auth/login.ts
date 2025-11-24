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
    const user = await getUserByUsername(trimmedUsername);

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid username or password' });
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
    const { passwordHash, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      token,
      user: {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString(),
      },
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

