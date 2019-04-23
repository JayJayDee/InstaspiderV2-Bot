import { Page } from 'puppeteer';

export const initializePage = (page: Page) => {
  page.setRequestInterception(true);
};

type ResponseListener = (url: string, data: JSON) => void | Promise<void>;

export const interceptXhr = (page: Page) =>
  (listener: ResponseListener, urlFilter?: string) => {
    console.log('* ajax interceptor set up');
    page.on('request', (req) => req.continue());
    page.on('response', async (res) => {
      if (res.request().resourceType() === 'xhr') {
        const uri = res.request().url();
        const jsonExpr = await res.json();
        if (urlFilter && uri.includes(urlFilter)) {
          listener(uri, jsonExpr);
        } else if (!urlFilter) {
          listener(uri, jsonExpr);
        }
      }
    });
  };

export const documentFeeds = async (page: Page) => {
  return await page.evaluate('window._sharedData');
};

export const awaitLittle = async (sec: number) =>
  new Promise((resolve, reject) =>
    setTimeout(resolve, sec * 1000));