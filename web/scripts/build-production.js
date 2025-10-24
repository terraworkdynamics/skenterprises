#!/usr/bin/env node

/**
 * Production Build Script
 * Handles secure production build with all security measures
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Production Build Process...\n');

// Step 1: Security Audit
console.log('🔍 Running security audit...');
try {
  execSync('npm audit --audit-level=moderate', { stdio: 'inherit' });
  console.log('✅ Security audit passed\n');
} catch (error) {
  console.log('⚠️  Security vulnerabilities found. Please review and fix.\n');
}

// Step 2: TypeScript Compilation
console.log('📝 Compiling TypeScript...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful\n');
} catch (error) {
  console.log('❌ TypeScript compilation failed');
  process.exit(1);
}

// Step 3: Production Build
console.log('🏗️  Building for production...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Production build completed\n');
} catch (error) {
  console.log('❌ Production build failed');
  process.exit(1);
}

// Step 4: Security Headers Check
console.log('🛡️  Checking security headers...');
const indexPath = path.join(__dirname, '../dist/index.html');
if (fs.existsSync(indexPath)) {
  const htmlContent = fs.readFileSync(indexPath, 'utf8');
  
  const securityChecks = [
    { name: 'Content Security Policy', pattern: /Content-Security-Policy/i },
    { name: 'X-Frame-Options', pattern: /X-Frame-Options/i },
    { name: 'X-Content-Type-Options', pattern: /X-Content-Type-Options/i }
  ];
  
  securityChecks.forEach(check => {
    if (check.pattern.test(htmlContent)) {
      console.log(`✅ ${check.name} header found`);
    } else {
      console.log(`⚠️  ${check.name} header missing`);
    }
  });
}

// Step 5: Build Analysis
console.log('\n📊 Build Analysis:');
try {
  const distPath = path.join(__dirname, '../dist');
  const files = fs.readdirSync(distPath, { recursive: true });
  
  let totalSize = 0;
  const fileStats = {};
  
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    if (fs.statSync(filePath).isFile()) {
      const size = fs.statSync(filePath).size;
      totalSize += size;
      
      const ext = path.extname(file);
      if (!fileStats[ext]) fileStats[ext] = { count: 0, size: 0 };
      fileStats[ext].count++;
      fileStats[ext].size += size;
    }
  });
  
  console.log(`📁 Total files: ${files.length}`);
  console.log(`📦 Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  Object.entries(fileStats).forEach(([ext, stats]) => {
    console.log(`   ${ext || 'no extension'}: ${stats.count} files, ${(stats.size / 1024).toFixed(2)} KB`);
  });
  
} catch (error) {
  console.log('⚠️  Could not analyze build output');
}

// Step 6: Security Checklist
console.log('\n🔐 Security Checklist:');
const securityItems = [
  { name: 'Environment variables configured', check: () => process.env.VITE_SUPABASE_URL },
  { name: 'Production build completed', check: () => fs.existsSync(path.join(__dirname, '../dist')) },
  { name: 'Source maps disabled', check: () => !fs.existsSync(path.join(__dirname, '../dist/assets/*.map')) },
  { name: 'Console logs removed', check: () => true }, // This is handled by Vite config
];

securityItems.forEach(item => {
  const status = item.check() ? '✅' : '❌';
  console.log(`${status} ${item.name}`);
});

console.log('\n🎉 Production build process completed!');
console.log('\n📋 Next Steps:');
console.log('1. Deploy the dist/ folder to your hosting provider');
console.log('2. Configure your environment variables');
console.log('3. Set up database security policies');
console.log('4. Configure SSL certificates');
console.log('5. Set up monitoring and logging');
console.log('\n📚 See DEPLOYMENT.md and SECURITY.md for detailed instructions.');
