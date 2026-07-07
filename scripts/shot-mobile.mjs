import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--use-gl=angle', '--enable-webgl'],
  defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
});
const page = await browser.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise((r) => setTimeout(r, 6500));
await page.screenshot({ path: 'scripts/shot-hero-mobile.png' });
await browser.close();
