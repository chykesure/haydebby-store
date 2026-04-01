// start.mjs - Database init + seed + Next.js server startup
import { execSync } from 'child_process';
import { mkdirSync } from 'fs';

console.log('Starting haydebby-store...');

mkdirSync('db', { recursive: true });

console.log('Creating database tables...');
try {
  execSync('npx prisma db push --skip-generate', { stdio: 'pipe' });
  console.log('Database tables ready');
} catch (e) {
  console.log('DB push note:', (e.stderr || '').toString().slice(0, 200));
}

console.log('Seeding database...');
try {
  execSync('node prisma/seed.mjs', { stdio: 'pipe' });
  console.log('Database seeded');
} catch (e) {
  console.log('Seed note:', (e.stderr || '').toString().slice(0, 200));
}

const port = process.env.PORT || 3000;
console.log('Starting Next.js on port ' + port + '...');
execSync('npx next start -p ' + port, { stdio: 'inherit' });
