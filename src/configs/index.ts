import { RootConfig, AmqpConfig } from "./types";

let root: RootConfig = null;
const rootConfig = async (): Promise<RootConfig> => {
  if (root === null) {
    root = {
      amqp: {
        hostname: 'chatpot.chat',
        port: 56720,
        username: 'jaydee',
        password: 'hu77lzg5'
      }
    };
  }
  return root;
};

export const amqp = async (): Promise<AmqpConfig> =>
  (await rootConfig()).amqp;

export { AmqpConfig } from './types';