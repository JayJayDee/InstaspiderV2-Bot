import { Page } from 'puppeteer';
import { get } from 'lodash';
import wait from '../helpers/await';

type Param = {
  hashtag: string;
  filterAfter: string;
};

type Feed = {
  id: string;
  ownerId: string;
  shortCode: string;
  thumbnailUri: string;
  imageUri: string;
  caption: string;
  feedUri: string;
};

export default async (page: Page, param: Param): Promise<Feed[]> =>
  new Promise(async (resolve, reject) => {
    const uri = `https://www.instagram.com/explore/tags/${encodeURIComponent(param.hashtag)}/`;
    console.log(`* navigate to ${uri}`);

    page.goto(uri);
    page.on('request', (req) => {
      if (req.resourceType() !== 'xhr') return;
      console.log(`  - ajax request made: ${req.url()}`);
    });

    page.on('response', async (res) => {
      if (res.request().resourceType() !== 'xhr') return;
      const uri = res.request().url();
      console.log(`  - ajax response arrive: ${uri}`);
      if (uri.includes('explore')) {
        const exploreResp = await res.json();
        const edges = get(exploreResp, ['graphql', 'hashtag', 'edge_hashtag_to_media', 'edges']);
        let feeds: Feed[] = edges.map(toFeed);

        if (param.filterAfter) {
          feeds = feeds.filter((f) => {
            if (!f.caption) return false;
            if (f.caption.includes(param.filterAfter)) return true;
            return false;
          });
        }
        resolve(feeds);
      }
    });
    await wait(5);
  });

const toFeed = (rawFeed: any): Feed => ({
  id: rawFeed.node.id,
  shortCode: rawFeed.node.shortcode,
  thumbnailUri: rawFeed.node.thumbnail_src,
  imageUri: rawFeed.node.display_url,
  caption: rawFeed.node.accessibility_caption,
  feedUri: `https://www.instagram.com/p/${rawFeed.node.shortcode}/`,
  ownerId: rawFeed.node.owner.id
});