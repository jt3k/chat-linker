// @flow

import Telegraf from 'telegraf';
import type { Bot } from '../../bot';
import type { MessageEvent } from '../../bus';
import type { Config } from './config';
import botNetwork from './network';

// html-escaping only for telegram
const htmlEscape = str => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

class TelegramBot implements Bot {
  client: Telegraf;
  config: Config;
  network: Symbol;

  constructor(client: Telegraf, config: Config) {
    this.client = client;
    this.config = config;
    this.network = botNetwork;
  }

  send(messageEvent: MessageEvent): void {
    const { config } = this;
    const destinationRoomId = messageEvent.destinationRoom;

    if (!destinationRoomId) {
      console.log('TELEGRAM: This message had no destination room id: ' + JSON.stringify(messageEvent));
      return;
    }
    const message = htmlEscape(messageEvent.message);
    const name = htmlEscape(messageEvent.name);

    const template = config.messageTemplate || '<b>{name}</b>\n{message}';
    const textMessage = template.replace(/{.*?}/g, tag => {
      switch (tag) {
        case '{name}': return name;
        case '{message}': return message;
        case '{room}': return messageEvent.room;
        case '{network}': return 'telegram';
        default: return tag;
      }
    });

    this.client.telegram.sendMessage(
      destinationRoomId,
      textMessage,
      { parse_mode: 'HTML' }
    );
  }
}

export default TelegramBot;
