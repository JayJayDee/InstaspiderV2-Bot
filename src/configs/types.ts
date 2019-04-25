export type RootConfig = {
  amqp: AmqpConfig;
};

export type AmqpConfig = {
  hostname: string;
  port: number;
  username: string;
  password: string;
};