import { Page } from 'puppeteer';
import getCsrfToken from '../helpers/csrf-token';
import wait from '../helpers/await';

export default async (page: Page, feedId: string, feedUrl: string) => {
  // likeWithView(page, feedUrl);
  await likeWithApi(page, feedId);
};

export const likeWithApi = async (page: Page, feedId: string) => {
  const csrfToken = await getCsrfToken(page);
  const script = `
    fetch('/web/likes/${feedId}/like/', {
      method: 'POST',
      headers: {
        'x-csrftoken': '${csrfToken}'
      }
    });
  `;
  await page.evaluate(script);
  console.log(`* liked to feed: ${feedId}`);
};

export const likeWithView = async (page: Page, feedUrl: string) => {
  await page.goto(feedUrl);
  await wait(1);
  await page.evaluate(`document.querySelectorAll()[1].click();`);
  await wait(1);
};