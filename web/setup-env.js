#!/usr/bin/env node

/**
 * Environment Setup Script
 * Creates .env file with placeholder values for development
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `# Supabase Configuration (Replace with your actual values)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Security Configuration
VITE_APP_ENV=development
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_LOCKOUT_DURATION=900000

# Admin Configuration
VITE_ADMIN_EMAIL=admin@skenterprises.com
VITE_ADMIN_PHONE=9972749555
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with placeholder values');
  console.log('📝 Please edit .env file with your actual Supabase credentials');
  console.log('🔗 Get your credentials from: https://supabase.com');
} else {
  console.log('⚠️  .env file already exists');
  console.log('📝 Please check your .env file has the correct Supabase credentials');
}

console.log('\n🚀 Next steps:');
console.log('1. Edit .env file with your Supabase URL and API key');
console.log('2. Restart your development server: npm run dev');
console.log('3. Visit http://localhost:5173 to see your application');
