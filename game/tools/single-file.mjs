// Builds one self-contained HTML file (CSS + game bundle inlined) for pasting into
// Google Sites "Embed code". Run `npm run build` first. Usage: node tools/single-file.mjs <out.html>
import { readFileSync, writeFileSync } from 'node:fs';
const html = readFileSync('index.html', 'utf8');
import { transformSync } from 'esbuild';
const css = transformSync(readFileSync('styles.css', 'utf8'), { loader: 'css', minify: true }).code;
const js = readFileSync('dist/game.js', 'utf8');
if (js.includes('</script')) throw new Error('bundle contains </script');
let head = html.slice(html.indexOf('<head>') + 6, html.indexOf('</head>'));
head = head.replace(/\s*<link rel="(apple-touch-icon|apple-touch-startup-image|icon|manifest|stylesheet)" [^>]*href="(icons\/|manifest|styles)[^>]*>/g, '');
let body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'));
body = body.replace(/<script>\s*\/\/ Service worker[\s\S]*?<\/script>/, '');
body = body.replace('<script src="dist/game.js"></script>', () => `<script>\n${js}\n</script>`);
const out = `<!DOCTYPE html>\n<html lang="en">\n<head>${head}\n<style>\n${css}\n</style>\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
writeFileSync(process.argv[2] || 'golf-single-file.html', out);
console.log(`wrote ${process.argv[2]} (${(out.length / 1024).toFixed(0)} KB)`);
