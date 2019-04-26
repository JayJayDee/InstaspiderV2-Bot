import { Page } from 'puppeteer';
import * as qs from 'query-string';
import fetchCsrf from '../helpers/csrf-token';

type Param = {
  feedId: string;
  comment: string;
};

export default async (page: Page, param: Param) => {
  const csrfToken = await fetchCsrf(page);
  const beforeQs = {
    comment_text: param.comment,
    replied_to_comment_id: ''
  };
  const formData = qs.stringify(beforeQs);
  const script = `
    fetch('/web/comments/${param.feedId}/add/', {
      method: 'POST',
      headers: {
        'x-csrftoken': '${csrfToken}',
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: '${formData}'
    });
  `;
  await page.evaluate(script);
  console.log(`* commented to feed: ${param.feedId}, ${param.comment}`);
};