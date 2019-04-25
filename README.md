# InstaspiderV2-Bot
instaspider-v2 bot for instaspiderV2 services. using Google Puppeteer api.

## Getting started
```bash
$ npm install
$ CONFIG_PATH=configpath npm run start
```

## Configuration file format
instaspider-v2-bot uses amqp protocol as for a messsage exchange.
so you must supply the below configuration file before run.
```json
{
   "amqp":{
      "hostname":"HOST_NAME",
      "port":PORT,
      "username":"USERNAME",
      "password":"PASSWORD"
   }
}
```