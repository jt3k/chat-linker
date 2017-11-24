// @flow

import type { XmppOptions } from 'node-xmpp-client';

export type Config = {
  connection: XmppOptions,
  dev: {
    room: string,
    nick: string,
    pingMs: number
  },
  prod: {
    room: string,
    nick: string,
    pingMs: number
  },
  messageTemplate: string
};
