import { launch } from 'puppeteer';

(async () => {
  console.log('* browser launching...');
  const browser = await launch();
  console.log('* browser launched');
  const context = await browser.defaultBrowserContext();
  console.log('* context created');

  const page = await context.newPage();
  await page.goto('https://www.instagram.com/explore/tags/신사역맛집/');
  console.log('* page loaded');

  const result = await page.evaluate('window._sharedData');
  console.log('* fetched data');
  console.dir(result.entry_data, { depth: null });

  await browser.close();
  console.log('* browser closed');
})();