import { Page } from 'puppeteer';

export const initializePage = (page: Page) => {
  page.setRequestInterception(true);
};

type ResponseListener = (url: string, data: JSON) => void | Promise<void>;

export const interceptXhrResponse = (page: Page) =>
  (listener: ResponseListener, urlFilter?: string) => {
    console.log('* xhr-response interceptor ready');
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

type HeaderListener = (url: string, headers: {[key: string]: string}) => void | Promise<void>;
type XhrRequestListeners = {
  header?: HeaderListener;
};
export const interceptXhrRequest = (page: Page) =>
  (listeners: XhrRequestListeners, urlFilter?: string) => {
    console.log('* xhr-request interceptor ready');
    page.on('request', async (req) => {
      const uri = req.url();
      if ((urlFilter && uri.includes(urlFilter) === true) || !urlFilter) {
        if (listeners.header) {
          const headers: {[key: string]: string} = {};
          Object.keys(req.headers).forEach((k: string) => headers[k] = req.headers()[k]);
          listeners.header(uri, headers);
        }
      }
      req.continue();
    });
  };

export const documentFeeds = async (page: Page) => {
  return await page.evaluate('window._sharedData');
};

export const awaitLittle = async (sec: number) =>
  new Promise((resolve, reject) =>
    setTimeout(resolve, sec * 1000));