import * as jsonfile from 'jsonfile';
import { RootConfig, AmqpConfig } from './types';

let root: RootConfig = null;
const rootConfig = async (): Promise<RootConfig> => {
  if (root === null) {
    root = await readConfig();
  }
  return root;
};

export const amqp = async (): Promise<AmqpConfig> =>
  (await rootConfig()).amqp;

const readConfig = (): Promise<RootConfig> =>
  new Promise((resolve, reject) => {
    const path = process.env.CONFIG_PATH;
    if (!path) return reject(new Error('CONFIG_PATH environment variable not supplied'));
    jsonfile.readFile(path, (err, data) => {
      if (err) return reject(new Error(`config file not found or invalid: ${path}`));
      resolve(data as RootConfig);
    });
  });

export { AmqpConfig } from './types';