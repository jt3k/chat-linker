// @flow

import type { Bot } from '../../bot';
import type { Config } from './config';

import botNetwork from './network';

// html-escaping only for telegram
const htmlEscape = str => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

class TelegramBot implements Bot {
  client: Object;
  config: Config;
  network: Symbol;

  constructor(client: Object, config: Config) {
    this.client = client;
    this.config = config;
    this.network = botNetwork;
  }

  send({ name, message }: { name: string, message: string }): this {
    const { config } = this;
    const chat = config[process.env.NODE_ENV === 'prod' ? 'prod' : 'dev'];

    message = htmlEscape(message);
    name = htmlEscape(name);

    const textMessage = (config.messageTemplate || '<b>{name}</b>\n{message}')
      .replace('{name}', name)
      .replace('{message}', message);

    this.client.telegram.sendMessage(
      chat.id,
      textMessage,
      { parse_mode: 'HTML' }
    );

    return this;
  }
}

export default TelegramBot;
