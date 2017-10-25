// @flow

export type Config = {
  BOT_TOKEN: string,
  dev: {
    id: number,
    title: string,
    type: string
  },
  prod: {
    id: number,
    title: string,
    username: string,
    type: string
  },
  messageTemplate: string
};
