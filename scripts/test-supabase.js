#!/usr/bin/env node
/**
 * Test Supabase Connection
 * Run: node scripts/test-supabase.js
 */

const https = require('https');
const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:5173/api/test-supabase';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: 'Invalid JSON response', raw: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runTests() {
  console.log('🔍 Testing Supabase Connection...\n');
  console.log(`API URL: ${API_URL}\n`);
  
  try {
    const result = await makeRequest(API_URL);
    
    if (result.error) {
      console.log('❌ Error:', result.error);
      if (result.raw) {
        console.log('Raw response:', result.raw);
      }
      console.log('\n💡 Make sure your dev server is running: npm run dev');
      return;
    }
    
    console.log('📊 Test Results:\n');
    
    if (result.results && result.results.tests) {
      result.results.tests.forEach((test, index) => {
        const icon = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
        console.log(`${icon} ${test.name} - ${test.status}`);
        if (test.details) {
          if (typeof test.details === 'string') {
            console.log(`   ${test.details}`);
          } else {
            console.log(`   ${JSON.stringify(test.details, null, 2)}`);
          }
        }
        console.log('');
      });
    }
    
    if (result.results && result.results.summary) {
      const { passed, failed, total } = result.results.summary;
      console.log('📈 Summary:');
      console.log(`   Passed: ${passed}`);
      console.log(`   Failed: ${failed}`);
      console.log(`   Total: ${total}\n`);
    }
    
    if (result.success) {
      console.log('✅ All tests passed! Supabase is working correctly.\n');
    } else {
      console.log('⚠️ Some tests failed. Check details above.\n');
    }
    
    if (result.nextSteps && result.nextSteps.length > 0) {
      console.log('📝 Next Steps:');
      result.nextSteps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step}`);
      });
    }
    
  } catch (error) {
    console.log('❌ Connection Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure dev server is running: npm run dev');
    console.log('   2. Check if API endpoint exists: /api/test-supabase');
    console.log('   3. Try accessing:', API_URL);
  }
}

runTests();

