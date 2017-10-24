// @flow

export interface Bot {
  client: Object;
  config: Object;
  network: Symbol;

  send({ name: string, message: string }): any;
}
