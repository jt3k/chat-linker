// @flow

export type Config = {
  connection: {
    jid: string,
    password: string,
    reconnect: boolean
  },
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
