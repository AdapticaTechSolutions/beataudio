// Test user lookup to debug the server error
// Access at: /api/auth/test-user-lookup?username=admin

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserByUsername } from '../lib/storage';

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

  const username = (req.query.username as string) || 'admin';

  try {
    console.log('Looking up user:', username);
    const user = await getUserByUsername(username);
    
    if (!user) {
      res.status(200).json({
        success: false,
        error: 'User not found',
        username,
      });
      return;
    }

    // Test creating response object (like login does)
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

    res.status(200).json({
      success: true,
      user: userResponse,
      rawUser: user,
      validation: {
        hasId: !!user.id,
        hasUsername: !!user.username,
        hasPasswordHash: !!user.passwordHash,
        idType: typeof user.id,
        idValue: user.id,
        isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(user.id || '')),
      },
    });
  } catch (error: any) {
    console.error('Test user lookup error:', error);
    res.status(200).json({
      success: false,
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
  }
}

