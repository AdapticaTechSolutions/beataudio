// Test password comparison endpoint
// Helps debug password matching issues

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserByUsername } from '../lib/api/storage.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const username = (req.query.username as string) || 'admin';
    const testPassword = (req.query.password as string) || 'password';

    // Get user from database
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(200).json({
        success: false,
        error: 'User not found',
        username,
      });
    }

    // Show password hash details (for debugging)
    const passwordHash = user.passwordHash || '';
    const passwordMatch = testPassword === passwordHash;
    const trimmedMatch = testPassword.trim() === passwordHash.trim();

    res.status(200).json({
      success: true,
      username,
      testPassword,
      passwordHash,
      passwordHashLength: passwordHash.length,
      passwordHashFirstChars: passwordHash.substring(0, 20),
      passwordHashLastChars: passwordHash.substring(Math.max(0, passwordHash.length - 20)),
      passwordMatch,
      trimmedMatch,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        hasPasswordHash: !!user.passwordHash,
        passwordHashType: typeof user.passwordHash,
      },
      comparison: {
        exact: testPassword === passwordHash,
        trimmed: testPassword.trim() === passwordHash.trim(),
        caseSensitive: testPassword.toLowerCase() === passwordHash.toLowerCase(),
      },
      recommendation: passwordMatch
        ? '✅ Password matches!'
        : trimmedMatch
        ? '⚠️ Password matches after trimming whitespace'
        : '❌ Password does not match. Check what is stored in database.',
    });
  } catch (error: any) {
    res.status(200).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}

