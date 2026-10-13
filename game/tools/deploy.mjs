// One-command deploy to Netlify: builds the game, uploads site/ and prints the live URL.
// Needs a Netlify personal access token in NETLIFY_AUTH_TOKEN (see DEPLOY.md).
// Optional: NETLIFY_SITE_NAME (e.g. "my-golf-game") the first time, NETLIFY_SITE_ID afterwards.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { zipDir } from './zip.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://api.netlify.com/api/v1';
const token = process.env.NETLIFY_AUTH_TOKEN;
const stateFile = path.join(root, '.netlify-site.json');

if (!token) {
  console.error('\n  ✖ NETLIFY_AUTH_TOKEN is not set.\n    Create one at https://app.netlify.com/user/applications#personal-access-tokens\n    then run:  NETLIFY_AUTH_TOKEN=xxxx npm run deploy\n');
  process.exit(1);
}

execFileSync(process.execPath, [path.join(root, 'tools/build.mjs')], { stdio: 'inherit' });

const api = async (method, url, body, headers = {}) => {
  const res = await fetch(API + url, { method, body, headers: { Authorization: `Bearer ${token}`, ...headers } });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} -> ${res.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
};

let siteId = process.env.NETLIFY_SITE_ID;
if (!siteId && fs.existsSync(stateFile)) siteId = JSON.parse(fs.readFileSync(stateFile, 'utf8')).site_id;
if (!siteId) {
  const name = process.env.NETLIFY_SITE_NAME || `golf-ai-${Math.random().toString(36).slice(2, 7)}`;
  console.log(`  Creating Netlify site "${name}"…`);
  const site = await api('POST', '/sites', JSON.stringify({ name }), { 'Content-Type': 'application/json' });
  siteId = site.id;
  fs.writeFileSync(stateFile, JSON.stringify({ site_id: site.id, name: site.name, url: site.ssl_url || site.url }, null, 2));
}

console.log('  Uploading…');
let deploy = await api('POST', `/sites/${siteId}/deploys`, zipDir(path.join(root, 'site')), { 'Content-Type': 'application/zip' });
for (let i = 0; i < 90 && !['ready', 'error'].includes(deploy.state); i++) {
  await new Promise(r => setTimeout(r, 2000));
  deploy = await api('GET', `/deploys/${deploy.id}`);
}
if (deploy.state !== 'ready') { console.error(`  ✖ Deploy ended in state "${deploy.state}" ${deploy.error_message || ''}`); process.exit(1); }
const site = await api('GET', `/sites/${siteId}`);
const url = site.ssl_url || `https://${site.name}.netlify.app`;
fs.writeFileSync(stateFile, JSON.stringify({ site_id: siteId, name: site.name, url }, null, 2));
fs.writeFileSync(path.join(root, 'LIVE_URL.txt'), url + '\n');
console.log(`\n  ⛳  GAME LIVE\n\n      ${url}\n\n      OPEN GAME →  ${url}\n`);
