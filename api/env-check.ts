// Environment Variable Diagnostic Endpoint
// Access at: /api/env-check
// This helps debug environment variable issues

import type { VercelRequest, VercelResponse } from '@vercel/node';

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

  // Check all Supabase-related environment variables
  const envCheck = {
    // Server-side variables (for API routes)
    SUPABASE_URL: {
      exists: !!process.env.SUPABASE_URL,
      value: process.env.SUPABASE_URL 
        ? `${process.env.SUPABASE_URL.substring(0, 30)}...` 
        : 'NOT SET',
      length: process.env.SUPABASE_URL?.length || 0,
      startsWith: process.env.SUPABASE_URL?.substring(0, 8) || 'N/A',
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      value: process.env.SUPABASE_SERVICE_ROLE_KEY 
        ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...` 
        : 'NOT SET',
      length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      startsWith: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) || 'N/A',
      isAnonKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('sb_publishable_') || false,
      isJWT: process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('eyJ') || false,
    },
    
    // Client-side variables (with VITE_ prefix)
    VITE_SUPABASE_URL: {
      exists: !!process.env.VITE_SUPABASE_URL,
      value: process.env.VITE_SUPABASE_URL 
        ? `${process.env.VITE_SUPABASE_URL.substring(0, 30)}...` 
        : 'NOT SET',
      length: process.env.VITE_SUPABASE_URL?.length || 0,
    },
    VITE_SUPABASE_ANON_KEY: {
      exists: !!process.env.VITE_SUPABASE_ANON_KEY,
      value: process.env.VITE_SUPABASE_ANON_KEY 
        ? `${process.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` 
        : 'NOT SET',
      length: process.env.VITE_SUPABASE_ANON_KEY?.length || 0,
    },

    // Fallback check (what the code will actually use)
    effectiveUrl: {
      source: process.env.SUPABASE_URL ? 'SUPABASE_URL' : 
              process.env.VITE_SUPABASE_URL ? 'VITE_SUPABASE_URL' : 
              'NONE',
      value: (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'NOT SET').substring(0, 30) + '...',
    },
    effectiveKey: {
      source: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SUPABASE_SERVICE_ROLE_KEY' : 
              process.env.VITE_SUPABASE_ANON_KEY ? 'VITE_SUPABASE_ANON_KEY (FALLBACK!)' : 
              'NONE',
      value: (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'NOT SET').substring(0, 20) + '...',
      warning: !process.env.SUPABASE_SERVICE_ROLE_KEY && !!process.env.VITE_SUPABASE_ANON_KEY 
        ? '⚠️ Using anon key fallback - this may cause RLS issues!' 
        : null,
    },

    // Environment info
    environment: {
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set',
      VERCEL: process.env.VERCEL || 'false',
    },

    // All Supabase-related keys
    allSupabaseKeys: Object.keys(process.env)
      .filter(key => key.includes('SUPABASE'))
      .map(key => ({
        name: key,
        exists: true,
        length: process.env[key]?.length || 0,
      })),
  };

  // Determine if setup is correct
  const isCorrect = 
    !!process.env.SUPABASE_URL && 
    !!process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith('eyJ');

  const issues: string[] = [];
  
  if (!process.env.SUPABASE_URL && !process.env.VITE_SUPABASE_URL) {
    issues.push('❌ No SUPABASE_URL or VITE_SUPABASE_URL found');
  }
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    issues.push('❌ SUPABASE_SERVICE_ROLE_KEY is missing');
    if (process.env.VITE_SUPABASE_ANON_KEY) {
      issues.push('⚠️ Code will fallback to VITE_SUPABASE_ANON_KEY (may cause RLS issues)');
    }
  } else {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith('sb_publishable_')) {
      issues.push('❌ SUPABASE_SERVICE_ROLE_KEY appears to be anon key (starts with sb_publishable_)');
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith('eyJ')) {
      issues.push('⚠️ SUPABASE_SERVICE_ROLE_KEY should start with eyJ (JWT format)');
    }
  }

  res.status(200).json({
    success: isCorrect && issues.length === 0,
    setupCorrect: isCorrect,
    issues,
    environmentVariables: envCheck,
    recommendations: [
      !process.env.SUPABASE_URL ? 'Add SUPABASE_URL (without VITE_ prefix) in Vercel' : null,
      !process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Add SUPABASE_SERVICE_ROLE_KEY (without VITE_ prefix) in Vercel' : null,
      process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('sb_publishable_') 
        ? 'Replace SUPABASE_SERVICE_ROLE_KEY with service_role key from Supabase (starts with eyJ)' 
        : null,
      !process.env.VITE_SUPABASE_URL ? 'Add VITE_SUPABASE_URL (with VITE_ prefix) for client-side' : null,
      !process.env.VITE_SUPABASE_ANON_KEY ? 'Add VITE_SUPABASE_ANON_KEY (with VITE_ prefix) for client-side' : null,
    ].filter(Boolean),
  });
}

