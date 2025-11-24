// Test endpoint for Edge Config
// Access at: /api/test-edge-config

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { get } from '@vercel/edge-config';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Test reading from Edge Config
    const testValue = await get('test_key');
    
    res.status(200).json({
      success: true,
      message: 'Edge Config is working',
      testValue: testValue || 'No value set for "test_key"',
      instructions: 'Set a value in Vercel Dashboard > Edge Config > Your Config',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      note: 'Make sure EDGE_CONFIG environment variable is set in Vercel',
    });
  }
}

