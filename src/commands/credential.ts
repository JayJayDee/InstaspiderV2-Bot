import { Page } from 'puppeteer';

type Credential = {
  csrfToken: string;
};

type Feed = {
  id: string;
  shortId: string;
  ownerId: string;
  thumbnail: string;
};

type Param = {
  hashtag: string;
  filterUrl?: string;
  filterContent?: string;
};

type Response = {
  credential: Credential;
  feeds: Feed[];
};

export default async (page: Page, param: Param): Promise<Response> => {
  const resp: Response = {
    credential: null,
    feeds: null
  };
  return resp;
};