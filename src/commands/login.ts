import { Page } from 'puppeteer';
import wait from '../helpers/await';
import cookie from '../helpers/cookie';

type Param = {
  id: string;
  password: string;
};

const loginUri = 'https://www.instagram.com/accounts/login';

export default async (page: Page, param: Param): Promise<void> => {
  await cookie.restore(page);

  console.log(`* navigate to ${loginUri}`);
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36');
  await page.goto(loginUri);
  await wait(3);
  console.log('* navigate to login-uri done');

  await loginWithClick(page, param);
};

const loginWithClick = async (page: Page, param: Param) => {
  try {
    await page.evaluate(`document.querySelectorAll('button')[0].removeAttribute('disabled');`);
    await wait(1);
    await page.type('input[name=username]', param.id);
    console.log('* username filled');
    await wait(1);
    await page.type('input[name=password]', param.password);
    console.log('* password filled');
    await wait(1);

    await page.evaluate(`document.querySelectorAll('button')[1].click();`);
    console.log('* login button clicked');
    await wait(5);
    await cookie.save(page);
  } catch (err) {
    console.error(err);
  }
};