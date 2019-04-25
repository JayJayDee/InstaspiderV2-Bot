import { Connection } from 'amqplib';
import { Page } from 'puppeteer';

const queueName = 'command';

export default (connection: Connection, page: Page) =>
  async () => {
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName);
    console.log(`* queue consume started: ${queueName}`);
    await channel.consume('command', async (msg) => {
      console.log(`* message arrival from queue: ${queueName}`);
      console.log(msg);
    }, { noAck: true });
  };