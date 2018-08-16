// @flow

import type { Bot } from '../../bot';
import type { MessageEvent } from '../../bus';
import type { Config } from './config';
import type { XmppClient } from './types';

import botNetwork from './network';

class JabberBot implements Bot {
  client: XmppClient;
  config: Config;
  network: Symbol;

  constructor(client: XmppClient, config: Config) {
    this.client = client;
    this.config = config;
    this.network = botNetwork;
  }

  send(messageEvent: MessageEvent): void {
    const { client, config } = this;
    const textMessage = (config.messageTemplate || '<@{name}> {message}')
      .replace('{name}', messageEvent.name)
      .replace('{message}', messageEvent.message)
      .replace('{room}', messageEvent.room)
      .replace('{network}', 'xmpp');

    client.sendMessage(
      textMessage,
      messageEvent.destinationRoom
    );
  }
}

export default JabberBot;
