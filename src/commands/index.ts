import { Page } from 'puppeteer';
import { get } from 'lodash';
import { interceptXhr, initializePage } from '../helpers';

type Feed = {
  id: string;
  url: string;
  thumbnail: string;
  image: string;
};

export const fetchInitialHashtagFeeds =
  (page: Page) =>
    (hashtag: string): Promise<Feed[]> =>
      new Promise((resolve, reject) => {
        initializePage(page);
        const intercept = interceptXhr(page);
        intercept((url, data: any) => {
          const feeds = get(data, ['graphql', 'hashtag', 'edge_hashtag_to_media', 'edges']);
          if (!feeds) {
            return resolve([]);
          }
          console.log(feeds);
          resolve(feeds.map(convertToFeed));
        }, 'explore');
        page.goto(`https://www.instagram.com/explore/tags/${encodeURIComponent(hashtag)}/`);
      });

const convertToFeed = (rawFeed: any): Feed => ({
  id: rawFeed.node.id,
  thumbnail: rawFeed.node.thumbnail_src,
  image: rawFeed.node.display_url,
  url: `https://www.instagram.com/p/${rawFeed.node.shortcode}`
});