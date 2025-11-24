// Test the complete login flow
// Simulates what the frontend does

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

  try {
    const username = (req.query.username as string) || 'admin';
    const password = (req.query.password as string) || 'password';

    // Simulate the login API call
    const loginResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const loginData = await loginResponse.json();

    res.status(200).json({
      success: true,
      test: 'Login flow test',
      username,
      loginApiStatus: loginResponse.status,
      loginApiResponse: loginData,
      analysis: {
        hasSuccess: 'success' in loginData,
        successValue: loginData.success,
        hasToken: 'token' in loginData,
        hasUser: 'user' in loginData,
        hasData: 'data' in loginData,
        responseStructure: Object.keys(loginData),
        expectedStructure: ['success', 'token', 'user'],
        matchesExpected: loginData.success === true && 'token' in loginData && 'user' in loginData,
      },
      recommendation: loginData.success && loginData.token && loginData.user
        ? '✅ Login API response is correct'
        : '❌ Login API response structure issue',
    });
  } catch (error: any) {
    res.status(200).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}

