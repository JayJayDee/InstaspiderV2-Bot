import { Page } from 'puppeteer';

export const initializePage = (page: Page) => {
  page.setRequestInterception(true);
};

type ApiParam = {
  uri: string;
  method: 'POST' | 'GET';
  body: {[key: string]: string};
};

export const requestApiInPage = (page: Page) =>
  async (param: ApiParam) => {
    const script = `
      (() => {
        var oReq = new XMLHttpRequest();
        var url = "/graphql/query/?query_hash=f92f56d47dc7a55b606908374b43a314&variables=%7B%22tag_name%22%3A%22%EA%B0%80%EB%A1%9C%EC%88%98%EA%B8%B8%EB%A7%9B%EC%A7%91%EC%B6%94%EC%B2%9C%22%2C%22show_ranked%22%3Afalse%2C%22first%22%3A1%2C%22after%22%3A%22QVFDa3FqNzBlOWlObFJ2T1B4NVVaNmdYbkFZb3dydkJ5R0JmbFlrUFpIdUZhNHpVUUNrOVF2NFAxX1d3Q2FnYTVhNEdmcC1Hc09HYnBvWFJhRksxWmdBeQ%3D%3D%22%7D";
        oReq.addEventListener("error", (err) => {
          window._errors.push({
            url: url,
            err: err
          });
        });
        oReq.open("GET", url);
      })();
    `;
    return await page.evaluate(script);
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

export const awaitLittle = async (sec: number) =>
  new Promise((resolve, reject) =>
    setTimeout(resolve, sec * 1000));