import { amqp } from './configs'
import { loginSubscriber } from './queue-subscribers';
import createAmqpConnection from './queue-subscribers/amqp-instantiator';
import initPage from './helpers/init';

(async () => {
  const amqpCfg = await amqp();
  const connection = await createAmqpConnection(amqpCfg);
  const page = await initPage();

  const subscribers = [
    loginSubscriber(connection, page)()
  ];
  await Promise.all(subscribers);
})();