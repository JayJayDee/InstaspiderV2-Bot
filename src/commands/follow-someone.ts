import { Page } from 'puppeteer';
import getCsrfToken from '../helpers/csrf-token';

export default async (page: Page, ownerIdNumber: string) => {
  const csrfToken = await getCsrfToken(page);
  const script = `
    fetch('/web/friendships/${ownerIdNumber}/follow/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': '${csrfToken}'
      }
    });
  `;
  await page.evaluate(script);
  console.log(`* followed to owner: ${ownerIdNumber}`);
};