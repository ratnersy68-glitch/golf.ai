// Headless smoke test: node tools/shot.js <script-name>
import { chromium } from 'playwright-core';
const SP = process.env.SP || '.';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const logs = [];
page.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', e => logs.push(`[pageerror] ${e.message}\n${e.stack}`));
await page.goto('http://localhost:8080/', { waitUntil: 'load' });
await page.waitForTimeout(4000);
await page.screenshot({ path: `${SP}/01-menu.png` });
const steps = process.argv[2] || 'basic';
async function snap(n) { await page.screenshot({ path: `${SP}/${n}.png` }); }
if (steps === 'basic' || steps === 'play') {
  await page.click('[data-go="round18"]');
  await page.waitForTimeout(500);
  await snap('02-golfer');
  await page.click('#next');
  await page.waitForTimeout(6000);
  await snap('03-course');
  await page.click('#next');
  await page.waitForTimeout(500);
  await snap('04-setup');
  await page.click('#next');
  await page.waitForTimeout(5000);
  await snap('05-flyover');
  await page.keyboard.press('Space');
  await page.waitForTimeout(1500);
  await snap('06-address');
  // swing: hold space ~1s, release, tap when marker near zero
  await page.keyboard.down('Space');
  await page.waitForTimeout(950);
  await page.keyboard.up('Space');
  await page.waitForTimeout(330);
  await page.keyboard.press('Space');
  await page.waitForTimeout(700);
  await snap('07-launch');
  await page.waitForTimeout(2500);
  await snap('08-flight');
  await page.waitForTimeout(5000);
  await snap('09-rest');
  await page.waitForTimeout(3000);
  await snap('10-next');
}
console.log(logs.slice(0, 60).join('\n'));
await browser.close();
