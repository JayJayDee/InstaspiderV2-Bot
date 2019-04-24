import { launch } from 'puppeteer';
import login from './commands/login';
import fetchFeeds from './commands/feeds';
import like from './commands/like';

(async () => {
  console.log('* browser launching...');
  const browser = await launch({
    headless: false,
    args: ['--lang=ko-KR, ko']
  });
  console.log('* browser launched');
  const context = await browser.defaultBrowserContext();
  console.log('* context created');

  const page = await context.newPage();
  await login(page, {
    id: 'jindongp',
    password: 'hu77lzg5'
  });

  const feeds = await fetchFeeds(page, {
    hashtag: '가로수길맛집',
    filterAfter: 'food'
  });

  const feed = feeds[0];
  console.log(feed);
  await like(page, feed.id);

  await awaitForever();
})();

const awaitForever = () =>
  new Promise((resolve, reject) => {

  });