import { Page } from 'puppeteer';
import wait from '../helpers/await';
import fetchCsrf from '../helpers/csrf-token';

type Param = {
  id: string;
  password: string;
};

const loginUri = 'https://www.instagram.com/accounts/login';

export default async (page: Page, param: Param): Promise<void> => {
  console.log(`* navigate to ${loginUri}`);
  await page.goto(loginUri);
  await wait(3);
  console.log('* navigate done');

  const csrfToken = await fetchCsrf(page);
  const fetchScript = `
    (() => {
      const form = new FormData();
      form.set('username', '${param.id}');
      form.set('password', '${param.password}');
      form.set('queryParams', '{}');
      form.set('optIntoOneTap', false);
      fetch('/accounts/login/ajax/', {
        method: 'POST',
        body: form,
        headers: {
          'x-csrftoken': '${csrfToken}'
        }
      })
    })();
  `;
  const resp = await page.evaluate(fetchScript);
  console.log('* login script execution done');
  console.log(resp);
  await wait(1);
};