import { launch } from 'puppeteer';
import login from './commands/login';

(async () => {
  console.log('* browser launching...');
  const browser = await launch();
  console.log('* browser launched');
  const context = await browser.defaultBrowserContext();
  console.log('* context created');

  const page = await context.newPage();
  await login(page, {
    id: 'jindongp',
    password: 'hu77lzg5'
  });

  await browser.close();
  console.log('* browser closed');
})();