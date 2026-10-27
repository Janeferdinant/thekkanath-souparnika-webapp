// Checks the homepage's initial JavaScript budget from the Vite manifest.
// Collects the index.html entry plus its static imports (not dynamic imports),
// gzips each chunk, and fails if the total is over budget or a chunk contains
// code that must stay out of the public entry (Supabase, recharts).
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const BUDGET_KB = 130;
const FORBIDDEN = ['supabase-js', 'recharts-wrapper'];
const dist = 'dist';

const manifest = JSON.parse(readFileSync(join(dist, '.vite', 'manifest.json'), 'utf8'));
const entry = manifest['index.html'];
if (!entry) {
  console.error('index.html entry not found in manifest');
  process.exit(1);
}

const seen = new Set();
const chunks = [];
const visit = (key) => {
  if (seen.has(key)) return;
  seen.add(key);
  const c = manifest[key];
  chunks.push(c);
  for (const imp of c.imports ?? []) visit(imp);
};
visit('index.html');

let total = 0;
let failed = false;
console.log('Initial JS chunks (static imports of index.html):');
for (const c of chunks) {
  const buf = readFileSync(join(dist, c.file));
  const gz = gzipSync(buf).length;
  total += gz;
  const text = buf.toString('utf8');
  const bad = FORBIDDEN.filter((f) => text.includes(f));
  if (bad.length) failed = true;
  console.log(`  ${c.file.padEnd(40)} ${(gz / 1024).toFixed(1).padStart(7)} KB gzip${bad.length ? `  CONTAINS ${bad.join(', ')}` : ''}`);
}
const totalKb = total / 1024;
console.log(`Total: ${totalKb.toFixed(1)} KB gzip (budget ${BUDGET_KB} KB)`);
if (totalKb > BUDGET_KB) failed = true;
process.exit(failed ? 1 : 0);
