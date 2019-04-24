import { Page } from 'puppeteer';
import getCsrfToken from '../helpers/csrf-token';

export default async (page: Page, feedId: string) => {
  await page.goto('https://www.instagram.com/explore/tags/가로수길맛집추천/');
  // TODO: 나중에 제거 필요

  const csrfToken = getCsrfToken(page);
  const script = `
    fetch('/web/likes/${feedId}/unlike/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': ${csrfToken}
      }
    });
  `;
  await page.evaluate(script);
};