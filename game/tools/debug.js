// Headless test harness: node tools/debug.js <script> (scripts live in tools/scripts). Serve the game on :8080 first.
import { chromium } from 'playwright-core';
const SP = process.env.SP || '.';
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: +(process.env.VW || 1280), height: +(process.env.VH || 800) } });
const logs = { push: (m) => console.log(m), slice: () => [] };
page.on('console', m => { if (m.type() !== 'error' || !m.text().includes('Failed to load')) logs.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', e => logs.push(`[pageerror] ${e.message}\n${e.stack}`));
await page.goto('http://localhost:8080/' + (process.env.Q || ''), { waitUntil: 'load' });
await page.waitForTimeout(1500);
const script = process.argv[2];
const mod = await import(`./scripts/${script}.js`);
await mod.default(page, SP, logs);

await browser.close();
