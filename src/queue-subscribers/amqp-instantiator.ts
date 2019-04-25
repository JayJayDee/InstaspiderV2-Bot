import { connect, Connection } from 'amqplib';
import { AmqpConfig } from '../configs';

export default async (cfg: AmqpConfig): Promise<Connection> => {
  const client = await connect(cfg);
  console.log(`* amqp connection established: ${cfg.hostname}`);
  return client;
};