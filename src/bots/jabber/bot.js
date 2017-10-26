// @flow

import type { Bot } from '../../bot';
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

  send({ name, message }: { name: string, message: string }): void {
    const { client, config } = this;

    const textMessage = (config.messageTemplate || '<@{name}> {message}')
      .replace('{name}', name)
      .replace('{message}', message);

    client.sendMessage(
      textMessage
    );
  }
}

export default JabberBot;
