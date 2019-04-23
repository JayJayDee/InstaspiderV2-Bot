import { Page } from 'puppeteer';
import { get } from 'lodash';
import { interceptXhr, initializePage } from '../helpers';

type Feed = {
  id: string;
  url: string;
  thumbnail: string;
  image: string;
  image_desc: string;
  owner_id: string;
};

export const likeFeed =
  (page: Page) =>
    (feedId: string): Promise<void> =>
      new Promise((resolve, reject) => {

      });

export const followUser =
  (page: Page) =>
    (userIdNumber: string): Promise<void> =>
      new Promise((resolve, reject) => {

      });

export const fetchInitialHashtagFeeds =
  (page: Page) =>
    (hashtag: string, filterText?: string): Promise<Feed[]> =>
      new Promise((resolve, reject) => {
        initializePage(page);
        const intercept = interceptXhr(page);
        intercept((url, data: any) => {
          const rawFeeds = get(data, ['graphql', 'hashtag', 'edge_hashtag_to_media', 'edges']);
          if (!rawFeeds) return resolve([]);

          const convertedFeeds: Feed[] = rawFeeds.map(convertToFeed);
          if (filterText) {
            const filtered = convertedFeeds.filter((f) => {
              if (!f.image_desc) return false;
              if (f.image_desc.includes(filterText)) return true;
              return false;
            });
            resolve(filtered);
          } else {
            resolve(convertedFeeds);
          }
        }, 'explore');
        page.goto(`https://www.instagram.com/explore/tags/${encodeURIComponent(hashtag)}/`);
      });

const convertToFeed = (rawFeed: any): Feed => ({
  id: rawFeed.node.shortcode,
  thumbnail: rawFeed.node.thumbnail_src,
  image: rawFeed.node.display_url,
  url: `https://www.instagram.com/p/${rawFeed.node.shortcode}`,
  image_desc: rawFeed.node.accessibility_caption ? rawFeed.node.accessibility_caption : null,
  owner_id: rawFeed.node.owner.id
});