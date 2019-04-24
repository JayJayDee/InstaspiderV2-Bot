import { Page } from 'puppeteer';
import { join } from 'path';
import * as jsonfile from 'jsonfile';

export default {
  async restore(page: Page) {
    const cookies: any = await readCookie();
    if (cookies) {
      console.log(`* cookie exists, read it..`);
      for (let cookie of cookies) {
        await page.setCookie(cookie);
      }
      console.log(`* cookie written.`);
    } else {
      console.log('* cookie not exist.');
    }
  },
  save(page: Page) {
    return new Promise((resolve, reject) => {
      page.cookies().then((cookies: any) => {
        jsonfile.writeFile(cookieFilePath(), cookies, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  }
};

export const readCookie = (): Promise<any> =>
  new Promise((resolve, reject) => {
    jsonfile.readFile(cookieFilePath(), (err, obj) => {
      if (err) return resolve(null);
      resolve(obj);
    });
  });

const cookieFilePath = () =>
  `${join(__dirname, '..', '..', 'cookie-storage')}/cookies.json`;