import { launch } from 'puppeteer';
import { awaitLittle, interceptXhr, initializePage } from './helpers';

(async () => {
  console.log('* browser launching...');
  const browser = await launch();
  console.log('* browser launched');
  const context = await browser.defaultBrowserContext();
  console.log('* context created');

  const page = await context.newPage();

  initializePage(page);
  const intercept = interceptXhr(page);

  intercept((url, data) => {
    console.log(`* AJAX ARRIVAL : ${url}`);
    console.log(data, { depth: null });
  });

  await page.goto('https://www.instagram.com/explore/tags/신사역맛집/');
  await awaitLittle(10);

  await browser.close();
  console.log('* browser closed');
})();