// start.mjs - Database init + seed + Next.js server startup
import { execSync } from 'child_process';
import { mkdirSync, existsSync } from 'fs';

console.log('🔄 haydebby-store starting...');

// 1. Ensure db directory exists
mkdirSync('db', { recursive: true });

// 2. Push schema (create tables)
console.log('📦 Creating database tables...');
try {
  execSync('npx prisma db push --skip-generate', { stdio: 'pipe' });
  console.log('✅ Database tables ready');
} catch (e) {
  console.log('⚠️  DB push warning (may be fine):', e.stderr?.toString().slice(0, 200));
}

// 3. Seed database (if empty)
console.log('🌱 Seeding database...');
try {
  execSync('node prisma/seed.mjs', { stdio: 'pipe' });
  console.log('✅ Database seeded');
} catch (e) {
  console.log('⚠️  Seed warning (data may already exist):', e.stderr?.toString().slice(0, 200));
}

// 4. Start Next.js server
console.log('🚀 Starting Next.js server...');
import('next/dist/cli/next-start.js').catch(() => {
  // Fallback: use npx
});
execSync('npx next start', { stdio: 'inherit' });
