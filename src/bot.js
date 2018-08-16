// @flow

export interface Bot {
  client: Object;
  config: Object;
  network: Symbol;

  send(messageEvent: MessageEvent): void;
}
