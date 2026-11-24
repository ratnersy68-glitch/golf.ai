/** Copies the deterministic simulation into the edge function so server and client run byte-identical physics. npm run backend:sync */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(ROOT, 'supabase/functions/validate-run/sim'); fs.mkdirSync(out, { recursive: true });
for (const f of ['dmath', 'track', 'vehicle', 'replay', 'trackgen']) {
  let s = fs.readFileSync(path.join(ROOT, 'src/sim', f + '.ts'), 'utf8');
  s = s.replace(/from '(\.\/[a-z-]+)'/g, "from '$1.ts'");
  fs.writeFileSync(path.join(out, f + '.ts'), s);
}
console.log('Synced simulation into supabase/functions/validate-run/sim');
