import { Page } from 'puppeteer';
import getCsrfToken from '../helpers/csrf-token';

export default async (page: Page, feedId: string) => {
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