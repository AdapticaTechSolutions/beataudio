# Serverless Function Patterns - Quick Reference

## 🚨 Red Flags (Will Cause FUNCTION_INVOCATION_FAILED)

### 1. Top-Level Error Throwing
```typescript
// ❌ BAD - Crashes function on import
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('Missing API key'); // 💥 FUNCTION_INVOCATION_FAILED
}
```

### 2. Top-Level Async Operations
```typescript
// ❌ BAD - Module-level await
const config = await fetch('https://api.example.com/config');
const db = await connect(); // 💥 FUNCTION_INVOCATION_FAILED
```

### 3. Top-Level File I/O
```typescript
// ❌ BAD - Synchronous file operations
import fs from 'fs';
const config = JSON.parse(fs.readFileSync('config.json')); // 💥 Can crash
```

### 4. Eager Client Initialization
```typescript
// ❌ BAD - Initializes immediately
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
); // 💥 Throws if env vars missing
```

### 5. Importing Modules with Top-Level Errors
```typescript
// ❌ BAD - If './config' throws, this crashes
import { config } from './config'; // 💥 FUNCTION_INVOCATION_FAILED
```

## ✅ Safe Patterns

### 1. Lazy Initialization (Your Current Pattern)
```typescript
// ✅ GOOD - Only initializes when called
let client: Client | null = null;

function getClient(): Client {
  if (client) return client;
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error('Missing API key'); // Safe - only throws when called
  }
  
  client = new Client(apiKey);
  return client;
}
```

### 2. Handler-Level Validation
```typescript
// ✅ GOOD - Validates in handler
export default async function handler(req, res) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }
  // Use apiKey...
}
```

### 3. Safe Configuration Checker
```typescript
// ✅ GOOD - Never throws
function isConfigured(): boolean {
  return !!(process.env.API_KEY && process.env.API_URL);
}

// Use it safely
if (!isConfigured()) {
  return res.status(500).json({ error: 'Not configured' });
}
```

### 4. Factory Pattern with Null Return
```typescript
// ✅ GOOD - Returns null instead of throwing
function createClient(): Client | null {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new Client(apiKey);
  } catch {
    return null;
  }
}

const client = createClient(); // Safe - won't crash
```

## 🔍 How to Spot These Issues

### Static Analysis Checklist
- [ ] Search for `throw` outside functions: `grep -n "throw" | grep -v "function\|=>"`
- [ ] Search for top-level `await`: `grep -n "^await\|^const.*await"`
- [ ] Check imports for side effects
- [ ] Look for `fs.readFileSync`, `require()` with dynamic paths
- [ ] Check for environment variable validation at module level

### Runtime Testing
```bash
# Test if function can load without crashing
node -e "require('./lib/api/supabase-storage')" && echo "✅ Module loads safely"
```

## 🎯 Common Scenarios

### Scenario 1: Database Client
```typescript
// ❌ BAD
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.URL!, process.env.KEY!);

// ✅ GOOD
let supabase: SupabaseClient | null = null;
function getSupabase() {
  if (supabase) return supabase;
  supabase = createClient(process.env.URL!, process.env.KEY!);
  return supabase;
}
```

### Scenario 2: API Client
```typescript
// ❌ BAD
const api = new ApiClient({
  key: process.env.API_KEY || (() => { throw new Error('No key'); })()
});

// ✅ GOOD
function getApiClient() {
  const key = process.env.API_KEY;
  if (!key) throw new Error('No key');
  return new ApiClient({ key });
}
```

### Scenario 3: Configuration Loading
```typescript
// ❌ BAD
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

// ✅ GOOD
function getConfig() {
  try {
    return JSON.parse(fs.readFileSync('config.json', 'utf-8'));
  } catch {
    return { default: 'values' };
  }
}
```

## 📚 Related Patterns

### Pattern: Singleton with Lazy Init
```typescript
class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  
  private constructor() {}
  
  static getInstance(): DatabaseConnection {
    if (!this.instance) {
      this.instance = new DatabaseConnection();
    }
    return this.instance;
  }
}
```

### Pattern: Dependency Injection
```typescript
// Instead of module-level init, inject dependencies
export function createHandler(deps: Dependencies) {
  return async (req, res) => {
    // Use deps.client, deps.config, etc.
  };
}
```

## 🛡️ Defense in Depth

1. **Lazy initialization** - Don't initialize until needed
2. **Handler validation** - Check config in handler
3. **Graceful degradation** - Return errors, don't crash
4. **Error boundaries** - Catch errors and return HTTP responses
5. **Monitoring** - Log initialization failures

