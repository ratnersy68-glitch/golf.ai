/** Builds ONE self-contained HTML file (JS + CSS + campaign data inlined): dist-single/apexline.html. npm run build:single
 *  Medal/benchmark ghost replays (21 MB) are not inlined; they load from ./data/replays/ if you host that folder next to the file, otherwise ghosts are simply absent. */
import fs from 'node:fs'; import path from 'node:path'; import { execSync } from 'node:child_process'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
execSync('npx vite build', { cwd: ROOT, stdio: 'inherit' });
const dist = path.join(ROOT, 'dist'); let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const esc = (s: string) => s.replace(/<\/(script|style)/gi, '<\\/$1');
html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/, (_, f) => `<style>${esc(fs.readFileSync(path.join(dist, f), 'utf8'))}</style>`);
const camp = fs.readFileSync(path.join(ROOT, 'public/data/campaign.json'), 'utf8');
html = html.replace(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/, '');
html = html.replace(/<link rel="modulepreload"[^>]*>/g, '');
const js = esc(fs.readFileSync(path.join(dist, html.match(/assets\/index-[^"]+\.js/)?.[0] ?? (fs.readdirSync(path.join(dist, 'assets')).map(f => 'assets/' + f).find(f => /index-.*\.js$/.test(f))!)), 'utf8'));
html = html.replace('</body>', () => `<script>window.__APEX_CAMPAIGN=${esc(camp)};</script>\n<script type="module">${js}</script>\n</body>`);
const out = path.join(ROOT, 'dist-single'); fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'apexline.html'), html);
console.log(`dist-single/apexline.html ${(html.length / 1048576).toFixed(2)} MB`);
