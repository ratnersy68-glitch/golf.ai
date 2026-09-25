// Production build: bundles the game and assembles a clean static site in ./site
import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'site');
const t0 = Date.now();

await build({ entryPoints: [path.join(root, 'src/main.js')], bundle: true, format: 'iife', minify: true, target: 'es2019', outfile: path.join(root, 'dist/game.js'), logLevel: 'warning' });

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const copy = (rel) => {
  const src = path.join(root, rel), dst = path.join(out, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.cpSync(src, dst, { recursive: true });
};
['index.html', 'styles.css', 'manifest.webmanifest', 'dist/game.js', 'icons', 'assets'].forEach(copy);
const version = `${new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)}`;
fs.writeFileSync(path.join(out, 'sw.js'), fs.readFileSync(path.join(root, 'sw.js'), 'utf8').replace('__VERSION__', version));
// cache-bust the bundle & stylesheet per build
const html = fs.readFileSync(path.join(out, 'index.html'), 'utf8')
  .replace('href="styles.css"', `href="styles.css?v=${version}"`)
  .replace('src="dist/game.js"', `src="dist/game.js?v=${version}"`);
fs.writeFileSync(path.join(out, 'index.html'), html);
const kb = Math.round(fs.statSync(path.join(out, 'dist/game.js')).size / 1024);
console.log(`\n  ✔ Production build ready in site/  (game.js ${kb} KB, version ${version}, ${Date.now() - t0} ms)\n`);
