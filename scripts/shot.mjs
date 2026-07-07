// Dev-only visual smoke test: loads the built site in headless Chrome,
// captures console errors and screenshots at several scroll depths.
import puppeteer from 'puppeteer-core';

const URL = process.env.SHOT_URL ?? 'http://localhost:4173/';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--use-gl=angle', '--enable-webgl', '--window-size=1600,900'],
  defaultViewport: { width: 1600, height: 900 },
});

const page = await browser.newPage();
const logs = [];
page.on('console', (m) => {
  if (['error', 'warning'].includes(m.type())) logs.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });

// Let the preloader finish (~3.5s) and the hero settle.
await new Promise((r) => setTimeout(r, 6500));
await page.screenshot({ path: 'scripts/shot-hero.png' });

const height = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
for (const [name, frac] of [['manifesto', 0.12], ['mid', 0.45], ['end', 1.0]]) {
  await page.evaluate((y) => scrollTo(0, y), Math.round(height * frac));
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: `scripts/shot-${name}.png` });
}

console.log(logs.length ? logs.join('\n') : 'NO CONSOLE ERRORS');
await browser.close();
