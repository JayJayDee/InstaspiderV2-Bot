import { Page } from 'puppeteer';
import { get } from 'lodash';
import { interceptXhrResponse, initializePage } from '../helpers';

type Feed = {
  id: string;
  shortid: string;
  url: string;
  thumbnail: string;
  image: string;
  image_desc: string;
  owner_id: string;
};

// fetch('https://www.instagram.com/web/likes/2023871649813484269/like/', {
//     method: 'POST',
//     headers: {
//       'X-Requested-With': 'XMLHttpRequest',
//       'X-IG-App-ID': '936619743392459',
//       'X-Instagram-AJAX': 'd41871c85427',
//       'X-CSRFToken': 'VVHiz3iJsZ74TcYt90ap84BAaZ7pFGaQ',
//       'Accept': '*/*',
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: {}
// })

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

export const loginUser =
  (page: Page) =>
    (userId: string, password: string): Promise<void> =>
      new Promise((resolve, reject) => {

      });

export const fetchInitialHashtagFeeds =
  (page: Page) =>
    (hashtag: string, filterText?: string): Promise<Feed[]> =>
      new Promise((resolve, reject) => {
        initializePage(page);
        const intercept = interceptXhrResponse(page);
        intercept((url, data: any) => {
          const rawFeeds = get(data, ['graphql', 'hashtag', 'edge_hashtag_to_media', 'edges']);
          if (!rawFeeds) return resolve([]);

          const convertedFeeds: Feed[] = rawFeeds.map(toFeed);
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

const toFeed = (rawFeed: any): Feed => ({
  id: rawFeed.node.id,
  shortid: rawFeed.node.shortcode,
  thumbnail: rawFeed.node.thumbnail_src,
  image: rawFeed.node.display_url,
  url: `https://www.instagram.com/p/${rawFeed.node.shortcode}`,
  image_desc: rawFeed.node.accessibility_caption ? rawFeed.node.accessibility_caption : null,
  owner_id: rawFeed.node.owner.id
});