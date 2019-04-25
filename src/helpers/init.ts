import { Page, launch } from 'puppeteer';

export default async (): Promise<Page> => {
  console.log('* browser launching...');
  const browser = await launch({
    headless: false,
    args: ['--lang=ko-KR, ko', '--no-sandbox', '--disable-setuid-sandbox']
  });
  console.log('* browser launched');
  const context = await browser.defaultBrowserContext();
  console.log('* context created');
  const page = await context.newPage();
  return page;
};