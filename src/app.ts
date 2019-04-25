import { amqp } from './configs';
import { commandSubscriber } from './queue-subscribers';
import createAmqpConnection from './queue-subscribers/amqp-instantiator';
import initPage from './helpers/init';

(async () => {
  const amqpCfg = await amqp();
  const connection = await createAmqpConnection(amqpCfg);
  const page = await initPage();

  const command = commandSubscriber(connection, page);

  const subscribers = [
    command()
  ];
  await Promise.all(subscribers);
})();