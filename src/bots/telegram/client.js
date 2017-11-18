// @flow

import Telegraf from 'telegraf';
// $FlowFixMe
import appConfig from '../../../app-config';
import { type MessageEvent, emitMessage } from '../../bus';
import botNetwork from './network';

import type { Config } from './config';

import type {
  Telegram$User,
  Telegram$Chat,
  Telegram$Message
} from './telegram.h';

type Context = {
  telegram: Telegraf$Telegram,
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
  match?: Array<?string>
};

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

class StickerMessage extends Message {
  static test(msg: Telegram$Message): boolean {
    return Boolean(msg.sticker);
  }

  toString(): string {
    const { msg } = this;

    let message: string = msg.text || '';

    const { sticker } = msg;

    if (!sticker) {
      return message;
    }

    const { emoji } = sticker;

    message += emoji ? `[Sticker ${emoji}]` : '';

    return message;
  }
}

class PhotoMessage extends Message {
  static test(msg: Telegram$Message): boolean {
    return Boolean(msg.photo);
  }

  toString(): string {
    const caption = this.msg.caption || '';
    const message = `[Photo] ${caption}`;

    return message;
  }
}

class DocumentMessage extends Message {
  static test(msg: Telegram$Message): boolean {
    return Boolean(msg.document);
  }

  toString(): string {
    const caption = this.msg.caption || '';
    const message = `[Document] ${caption}`;

    return message;
  }
}

class ReplyToMessage extends Message {
  static test(msg: Telegram$Message): boolean {
    return Boolean(msg.reply_to_message);
  }

  getDetails(): [string, string] {
    const { msg } = this;
    const replyToMessage: ?Telegram$Message = msg.reply_to_message;

    if (!replyToMessage) {
      return ['', ''];
    }

    const nick = Name.from(replyToMessage.from);
    const message: string = prepareMessage(replyToMessage);

    return [nick, message];
  }

  toString(): string {
    const { msg } = this;
    let [nick, message] = this.getDetails();

    // adds quoting brackets
    message = message.replace(/\n/g, '\n>> ');

    return `>> <${nick}> ${message}\n${msg.text || ''}`;
  }
}

class BotMessage extends ReplyToMessage {
  static test(msg: Telegram$Message): boolean {
    const replyToMessage: ?Telegram$Message = msg.reply_to_message;

    if (!replyToMessage) {
      return false;
    }

    const isReplyWithText = Boolean(replyToMessage.text);

    if (!isReplyWithText) {
      return false;
    }

    const isReplyFromOurBot = BOT_TOKEN.indexOf(
      replyToMessage.from.id.toString()
    ) > -1;

    return isReplyFromOurBot;
  }

  getDetails(): [string, string] {
    const { msg } = this;

    const replyToMessage: ?Telegram$Message = msg.reply_to_message;
    const text: string = replyToMessage ? (replyToMessage.text || '') : '';
    const lineEndPos: number = text.indexOf('\n');
    const _nick: string = text.slice(0, lineEndPos);
    const _message: string = text.slice(lineEndPos + 1);

    return [_nick, _message];
  }
}

function messageFactory(msg: Telegram$Message): Message {
  if (StickerMessage.test(msg)) {
    return new StickerMessage(msg);
  }

  if (PhotoMessage.test(msg)) {
    return new PhotoMessage(msg);
  }

  if (DocumentMessage.test(msg)) {
    return new DocumentMessage(msg);
  }

  if (BotMessage.test(msg)) {
    return new BotMessage(msg);
  }

  if (ReplyToMessage.test(msg)) {
    return new ReplyToMessage(msg);
  }

  return new Message(msg);
}

function prepareMessage(msg: Telegram$Message): string {
  const message: Message = messageFactory(msg);
  let stringMessage = message.toString();

  if (msg.forward_from) {
    const nick = Name.from(msg.forward_from);

    // adds quoting brackets
    stringMessage = stringMessage.replace(/\n/g, '\n>> ');

    return `>> <${nick}> ${stringMessage}`;
  }

  return stringMessage;
}

function prepareEmittingMessageDetails(
  message: Telegram$Message
): ?MessageEvent {
  const room: string = message.chat.title || '';

  if (room !== chat.title) {
    return null;
  }

  const name = Name.from(message.from);
  const msg: string = prepareMessage(message);

  return { network: botNetwork, room, name, message: msg };
}

function onMessage(ctx: Context, next: (*) => Promise<*>): void {
  if (!ctx.message) {
    return;
  }

  const e: ?MessageEvent = prepareEmittingMessageDetails(ctx.message);

  if (e) {
    emitMessage(e);
    next();
  }
}

client
  .on('text', onMessage)
  .on('sticker', onMessage)
  .on('photo', onMessage)
  .on('document', onMessage)
  .startPolling();

export default client;
