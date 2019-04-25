import { Connection, Channel } from 'amqplib';
import { Page } from 'puppeteer';

import loginCommand from '../commands/login';
import fetchFeeds from '../commands/feeds';

const queueName = 'command';

export default (connection: Connection, page: Page) =>
  async () => {
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    console.log(`* queue consume started: ${queueName}`);
    await channel.consume('command', async (msg) => {
      const login = handleLogin(page, channel);
      const hahstag = handleHashtag(page, channel);

      let parsed: any = null;
      try {
        parsed = JSON.parse(msg.content.toString());
        console.log(`* message arrival from queue: ${queueName}`);
        console.log(parsed);
        if (parsed.type === 'login') login(parsed);
        if (parsed.type === 'hashtag') hahstag(parsed);
      } catch (err) {
        console.log('* invalid payload. ignored.');
      }
    }, { noAck: true });
  };

const sendResponse = async (channel: Channel, payload: any) => {
  await channel.assertQueue('bot_response');
  await channel.sendToQueue('bot_response', Buffer.from(JSON.stringify(payload)));
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
      thumbnail: f.thumbnailUri
    }));
    console.log(filteredFeeds);
    await sendResponse(channel, {
      type: 'hashtag_ok',
      feeds: filteredFeeds
    });
  };