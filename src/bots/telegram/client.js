// @flow

import type { Config } from './Config';
import EventEmitter from 'events';

import type {
  Telegram$User,
  Telegram$Chat,
  Telegram$Message
} from './telegram.h';

type Context = {
  telegram: Object,
  updateType: string,
  updateSubTypes?: string,
  me?: string,
  message?: Telegram$Message,
  editedMessage?: Telegram$Message,
  // inlineQuery?: ,
  // chosenInlineResult?: ,
  // callbackQuery?: ,
  // shippingQuery?: ,
  // preCheckoutQuery?: ,
  // channelPost?: ,
  // editedChannelPost?: ,
  chat?: Telegram$Chat,
  from?: Telegram$User,
  match?: ?string[],
};

import Telegraf from 'telegraf';

import appConfig from '../../../app-config';
import bus from '../../bus';
import botNetwork from './network';

const config: Config = appConfig.telegram;

const chat = config[process.env.NODE_ENV === 'prod' ? 'prod' : 'dev'];

const { BOT_TOKEN } = config;

const client = new Telegraf(BOT_TOKEN);

class Name {
  static from(user: Telegram$User): string {
    if (user.username) {
      return user.username;
    }

    if (user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }

    return user.first_name;
  }
}

class Message {
  msg: Telegram$Message;

  constructor(msg: Telegram$Message) {
    this.msg = msg;
  }

  toString(): string {
    return this.msg.text || '';
  }
}

class ReplyToMessage extends Message {
  static test(msg: Telegram$Message): boolean {
    const replyToMessage = msg.reply_to_message;
    const isReplyWithText = replyToMessage && replyToMessage.text;

    return !!isReplyWithText;
  }

  getDetails(): [string, string] {
    const msg = this.msg;
    const replyToMessage = msg.reply_to_message;

    if (!replyToMessage) return ['', ''];

    const nick = Name.from(replyToMessage.from);
    const message = replyToMessage && replyToMessage.text;

    return [nick, message || ''];
  }

  toString(): string {
    const msg = this.msg;
    let [nick, message] = this.getDetails();

    // adds quoting brackets
    message = message.replace(/\n/g, '\n>> ');

    return `>> <${nick}> ${message}\n${msg.text || ''}`;
  }
}

class ForwardedMessage extends Message {
  static test(msg: Telegram$Message): boolean {
    return !!msg.forward_from;
  }

  toString(): string {
    const msg = this.msg;

    if (!msg.forward_from) return '';

    const nick = Name.from(msg.forward_from);

    // adds quoting brackets
    const message = msg.text ? msg.text.replace(/\n/g, '\n>> ') : '';

    return `>> <${nick}> ${message}`;
  }
}

class BotMessage extends ReplyToMessage {
  static test(msg: Telegram$Message): boolean {
    const replyToMessage = msg.reply_to_message;

    if (!replyToMessage) return false;

    const isReplyWithText: boolean = !!replyToMessage.text;

    if (!isReplyWithText) {
      return false;
    }

    const isReplyFromOurBot = BOT_TOKEN.indexOf(
      replyToMessage.from.id.toString()
    ) > -1;

    return isReplyFromOurBot;
  }

  getDetails(): [string, string] {
    const msg = this.msg;
    const replyToMessage = msg.reply_to_message;
    const text = replyToMessage ? (replyToMessage.text || '') : '';
    const lineEndPos = text.indexOf('\n');
    const _nick = text.slice(0, lineEndPos);
    const _message = text.slice(lineEndPos + 1);

    return [_nick, _message];
  }
}

function messageFactory(msg: Telegram$Message) {
  if (ForwardedMessage.test(msg)) {
    return new ForwardedMessage(msg);
  }

  if (!ReplyToMessage.test(msg)) {
    return new Message(msg);
  }

  if (BotMessage.test(msg)) {
    return new BotMessage(msg);
  }

  return new ReplyToMessage(msg);
}

function prepareMessage(msg) {
  const message = messageFactory(msg);
  const stringMessage = message.toString();

  return stringMessage;
}

function prepareEmittingMessageDetails(message: Telegram$Message) {
  const room = message.chat.title;

  if (room !== chat.title) {
    return null;
  }

  const name = Name.from(message.from);
  const msg = prepareMessage(message);

  return {network: botNetwork, room, name, message: msg};
}

client
  .on('text', (ctx: Context, next: (*) => Promise<*>) => {
    if (!ctx.message) return;

    const msg = prepareEmittingMessageDetails(ctx.message);
    if (msg) {
      bus.emit('message', msg);
      next();
    }
  })
  .on('sticker', (ctx: Context, next: (*) => Promise<*>) => {
    if (!ctx.message) return;

    const message: Telegram$Message = ctx.message;

    const msg = prepareEmittingMessageDetails(message);
    if (msg) {
      const sticker = message.sticker;
      if (!sticker) return;
      const emoji = sticker.emoji;
      msg.message = emoji || msg.message;
      bus.emit('message', msg);
      next();
    }
  });

client.startPolling();

export default client;
