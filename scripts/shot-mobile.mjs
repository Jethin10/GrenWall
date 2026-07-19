// Dev-only: mobile-width smoke test of the reworked sections.
import puppeteer from 'puppeteer-core';

const URL = process.env.SHOT_URL ?? 'http://localhost:4173/';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--use-gl=angle', '--enable-webgl'],
  defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
});

const page = await browser.newPage();
const logs = [];
page.on('console', (m) => {
  if (['error', 'warning'].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise((r) => setTimeout(r, 6000));

const height = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
for (const [name, frac] of [['m-hero', 0], ['m-manifesto', 0.12], ['m-caps', 0.3], ['m-systems', 0.55], ['m-end', 1.0]]) {
  await page.evaluate((y) => scrollTo(0, y), Math.round(height * frac));
  await new Promise((r) => setTimeout(r, 2200));
  await page.screenshot({ path: `scripts/shot-${name}.png` });
}

console.log(logs.length ? logs.join('\n') : 'NO CONSOLE ERRORS');
await browser.close();
