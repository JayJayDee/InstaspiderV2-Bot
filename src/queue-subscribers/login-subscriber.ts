import { Connection, Channel } from 'amqplib';
import { Page } from 'puppeteer';
import loginCommand from '../commands/login';

const queueName = 'command';

export default (connection: Connection, page: Page) =>
  async () => {
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    console.log(`* queue consume started: ${queueName}`);
    await channel.consume('command', async (msg) => {
      const login = handleLogin(page, channel);

      let parsed: any = null;
      try {
        parsed = JSON.parse(msg.content.toString());
        console.log(`* message arrival from queue: ${queueName}`);
        console.log(msg);
        if (parsed.type === 'login') login(parsed);
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
    await loginCommand(page, {
      id: payload.email,
      password: payload.password
    });
    await sendResponse(channel, {
      type: 'login_ok'
    });
  };