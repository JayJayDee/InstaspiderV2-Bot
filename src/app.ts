import { launch } from 'puppeteer';
import { fetchInitialHashtagFeeds } from './commands';

(async () => {
  console.log('* browser launching...');
  const browser = await launch();
  console.log('* browser launched');
  const context = await browser.defaultBrowserContext();
  console.log('* context created');

  const page = await context.newPage();

  const fetchFeeds = fetchInitialHashtagFeeds(page);
  const feeds = await fetchFeeds('신사역맛집', 'person');
  console.log(feeds.map((f) => f.thumbnail));

  await browser.close();
  console.log('* browser closed');
})();