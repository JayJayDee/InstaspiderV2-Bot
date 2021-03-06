import { Connection, Channel } from 'amqplib';
import { Page } from 'puppeteer';
import { shuffle } from 'lodash';

import loginCommand from '../commands/login';
import fetchFeeds from '../commands/feeds';
import likeFeed from '../commands/like';
import followSomeone from '../commands/follow-someone';
import writeComment from '../commands/comment';
import wait from '../helpers/await';

const queueName = 'command';

export default (connection: Connection, page: Page) =>
  async () => {
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    console.log(`* queue consume started: ${queueName}`);
    await channel.consume('command', async (msg) => {
      const login = handleLogin(page, channel);
      const hahstag = handleHashtag(page, channel);
      const interact = handleInteraction(page, channel);

      let parsed: any = null;
      try {
        parsed = JSON.parse(msg.content.toString());
        console.log(`* message arrival from queue: ${queueName}`);
        console.log(parsed);
        if (parsed.type === 'login') login(parsed);
        if (parsed.type === 'hashtag') hahstag(parsed);
        if (parsed.type === 'interaction') interact(parsed);
      } catch (err) {
        console.log('* invalid payload. ignored.');
      }
    }, { noAck: true });
  };

const sendResponse = async (channel: Channel, payload: any) => {
  const type = payload.type;
  await channel.assertQueue('bot_response');
  await channel.sendToQueue('bot_response', Buffer.from(JSON.stringify(payload)));
  console.log(`* bot_response written: ${type}`);
};

const handleLogin = (page: Page, channel: Channel) =>
  async (payload: any) => {
    console.log('* login process started');
    await loginCommand(page, {
      id: payload.email,
      password: payload.password
    });
    await sendResponse(channel, {
      type: 'login_ok'
    });
  };

const handleHashtag = (page: Page, channel: Channel) =>
  async (payload: any) => {
    console.log('* hashtag-search process started');
    const feeds = await fetchFeeds(page, {
      hashtag: payload.tag,
      filterAfter: payload.img_filter
    });
    const filteredFeeds = feeds.map((f) => ({
      id: f.id,
      owner_id: f.ownerId,
      thumbnail: f.thumbnailUri,
      url: f.feedUri
    }));
    console.log('* fetched feeds');
    console.log(filteredFeeds);
    await sendResponse(channel, {
      type: 'hashtag_ok',
      feeds: filteredFeeds
    });
  };

const handleInteraction = (page: Page, channel: Channel) =>
  async (payload: any) => {
    console.log('* feeds-interaction process started');
    const interactions = payload.interactionList as any[];
    for (let interaction of interactions) {
      await likeFeed(page, interaction.feed_id, interaction.url);
      await sendResponse(channel, {
        type: 'interaction_like_ok',
        feed_id: interaction.feed_id
      });
      await wait(1);

      await followSomeone(page, interaction.owner_id);
      await sendResponse(channel, {
        type: 'interaction_follow_ok',
        owner_id: interaction.owner_id
      });
      await wait(1);

      await writeComment(page, {
        feedId: interaction.feed_id,
        comment: randomComment()
      });
      await sendResponse(channel, {
        type: 'interaction_comment_ok',
        feed_id: interaction.feed_id
      });
      await wait(1);
    }
  };

const comments = [
  '잇님😀 맛있어 보이네요 오늘 가서 먹어보고 싶네요. 소통하고 싶어 팔로우 하고 갑니다',
  '잇님😀 맛있는 피드 잘보고 갑니다. 자주 소통하고 싶어서 선팔하고 가요',
  '잇님😀 음식 비쥬얼이 대박이네요. 피드보러 자주 놀러올게요 선팔하고 가요'
];
const randomComment = (): string => shuffle(comments)[0];