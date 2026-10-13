// Builds a compact one-file version for Google Sites "Embed code": the game bundle and
// stylesheet are gzipped + base64-encoded and unpacked in the browser (DecompressionStream),
// which makes the pasted code about a third of the size. Run `npm run build` first.
// Usage: node tools/single-file-packed.mjs <out.html>
import { readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { transformSync } from 'esbuild';

const html = readFileSync('index.html', 'utf8');
const css = transformSync(readFileSync('styles.css', 'utf8'), { loader: 'css', minify: true }).code;
const js = readFileSync('dist/game.js');
const pack = (buf) => gzipSync(buf, { level: 9 }).toString('base64');
let head = html.slice(html.indexOf('<head>') + 6, html.indexOf('</head>'));
head = head.replace(/\s*<link rel="(apple-touch-icon|apple-touch-startup-image|icon|manifest|stylesheet)" [^>]*href="(icons\/|manifest|styles)[^>]*>/g, '');
let body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'));
body = body.replace(/<script>\s*\/\/ Service worker[\s\S]*?<\/script>/, '');
body = body.replace('<script src="dist/game.js"></script>', () => `<script>
(function () {
  var CSS = "${pack(css)}";
  var JS = "${pack(js)}";
  function fail(e) { var m = document.getElementById('boot-msg'); if (m) { m.className = 'boot-msg err'; m.textContent = "This browser couldn't unpack the game (" + e + "). Use the regular full code instead."; } }
  function unpack(b64) {
    var bin = atob(b64), u = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  }
  if (!window.DecompressionStream) { fail('browser too old'); return; }
  unpack(CSS).then(function (css) {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    return unpack(JS);
  }).then(function (src) {
    var s = document.createElement('script'); s.textContent = src; document.body.appendChild(s);
  }).catch(function (e) { fail(e && e.message || e); });
})();
</script>`);
// tiny inline style so the loading screen looks right while the real stylesheet unpacks
const boot = '<style>html,body{margin:0;height:100%;background:#0b0f0d;color:#eef3ef;font-family:Inter,system-ui,sans-serif;overflow:hidden}#rotate,#offline{display:none}#boot{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}</style>';
// file previews (e.g. iPhone Files / Quick Look) show the page but never run scripts:
// hide the phone-only screens with inline styles and explain how to play instead
body = body.replace('<div id="rotate">', '<div id="rotate" style="display:none">').replace('<div id="offline">', '<div id="offline" style="display:none">');
body = body.replace('<div class="boot-msg" id="boot-msg">Loading course…</div>', `<div class="boot-msg" id="boot-msg">Loading course…</div>
    <noscript><p style="max-width:520px;margin:16px auto;font:16px sans-serif;color:#eef3ef;text-align:center">This viewer can't run games. On iPhone, open <b>https://ratnersy68-glitch.github.io/golf.ai/</b> in Safari. On a computer, open this file in Chrome or paste it into Google Sites.</p></noscript>`);
const unhide = "['rotate','offline'].forEach(function(id){var e=document.getElementById(id);if(e)e.removeAttribute('style');});";
body = body.replace('(function () {\n  var CSS', '(function () {\n  ' + unhide + '\n  var CSS');
const out = `<!DOCTYPE html>\n<html lang="en">\n<head>${head}\n${boot}\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
writeFileSync(process.argv[2] || 'golf-packed.html', out);
console.log(`wrote ${process.argv[2]} (${(out.length / 1024).toFixed(0)} KB)`);
