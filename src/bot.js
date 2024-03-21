// @flow

import type { MessageEvent } from './bus';

export interface Bot {
  client: Object;
  config: Object;
  network: Symbol;

  send(messageEvent: MessageEvent): void;
}
