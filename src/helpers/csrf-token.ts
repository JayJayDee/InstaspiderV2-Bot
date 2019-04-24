import { Page } from 'puppeteer';
import { get } from 'lodash';

export default async (page: Page): Promise<string> => {
  const shared = await page.evaluate('window._sharedData');
  const csrfToken = get(shared, ['config', 'csrf_token']);
  return csrfToken;
};