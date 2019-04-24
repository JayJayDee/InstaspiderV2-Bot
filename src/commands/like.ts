import { Page } from 'puppeteer';
import getCsrfToken from '../helpers/csrf-token';

export default async (page: Page, feedId: string) => {
  const csrfToken = getCsrfToken(page);
  const script = `
    fetch('/web/likes/${feedId}/like/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': '${csrfToken}'
      }
    });
  `;
  await page.evaluate(script);
};