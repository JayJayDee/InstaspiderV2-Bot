import { launch } from 'puppeteer';

import credential from './commands/credential';

(async () => {
  console.log('* browser launching...');
  const browser = await launch();
  console.log('* browser launched');
  const context = await browser.defaultBrowserContext();
  console.log('* context created');

  const page = await context.newPage();

  const resp = await credential(page);
  console.log(resp);

  await browser.close();
  console.log('* browser closed');
})();