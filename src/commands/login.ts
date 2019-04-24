import { Page } from 'puppeteer';
import * as qs from 'query-string';
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
  await wait(10);
  console.log('* navigate to login-uri done');

  const body = qs.stringify({
    username: param.id,
    password: param.password,
    queryParams: '{}',
    optIntoOneTap: false
  });
  console.log(`* login api body = ${body}`);

  const csrfToken = await fetchCsrf(page);
  const fetchScript = `
    (() => {
      fetch('/accounts/login/ajax/', {
        method: 'POST',
        body: 'username=jindongp&password=hu77lzg5&queryParams=%7B%7D&optIntoOneTap=false',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'x-csrftoken': '${csrfToken}',
          'Origin': 'https://www.instagram.com',
          'Referer': 'https://www.instagram.com/accounts/login/',
          'x-requested-with': 'XMLHttpRequest',
          'x-instagram-ajax': '54a9070d7dcf-hot',
          'x-ig-app-id': '936619743392459'
        }
      });
    })();
  `;
  await page.evaluate(fetchScript);
  await wait(10);
};

// (() => {
//   const form = new FormData();
//   form.set('username', '${param.id}');
//   form.set('password', '${param.password}');
//   form.set('queryParams', '{}');
//   form.set('optIntoOneTap', false);
//   fetch('/accounts/login/ajax/', {
//     method: 'POST',
//     body: form,
//     headers: {
//       'x-csrftoken': '${csrfToken}'
//     }
//   })
// })();