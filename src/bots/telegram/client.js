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

type Details = {
  name: string,
  message: string
};

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

const { BOT_TOKEN, quoteLength } = config;

const client = new Telegraf(BOT_TOKEN);

class Name {
  static from(author: Telegram$User | Telegram$Chat): string {
    if (author.username) {
      return author.username;
    }

    if (author.title) {
      return author.title;
    }

    const names = [author.first_name, author.last_name].filter(x => x);

    if (names.length > 0) {
      return names.join(' ');
    }

    return `[Chat ${author.id}]`;
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

    let text: string = msg.text || '';

    const { sticker } = msg;

    if (!sticker) {
      return text;
    }

    const { emoji } = sticker;

    text += emoji ? `[Sticker ${emoji}]` : '';

    return text;
  }
}

class PhotoMessage extends Message {
  static test(msg: Telegram$Message): boolean {
    return Boolean(msg.photo);
  }

  toString(): string {
    const caption: string = this.msg.caption || '';
    const text: string = `[Photo] ${caption}`;

    return text;
  }
}

class DocumentMessage extends Message {
  static test(msg: Telegram$Message): boolean {
    return Boolean(msg.document);
  }

  toString(): string {
    const caption: string = this.msg.caption || '';
    const text: string = `[Document] ${caption}`;

    return text;
  }
}

class ReplyToMessage extends Message {
  static test(msg: Telegram$Message): boolean {
    return Boolean(msg.reply_to_message);
  }

  getDetails(): Details {
    const { msg } = this;
    const replyToMessage: ?Telegram$Message = msg.reply_to_message;

    if (!replyToMessage) {
      throw new Error('No reply_to_message');
    }

    const name: string = Name.from(replyToMessage.from);
    const message: string = prepareMessage(replyToMessage);

    return { name, message };
  }

  toString(): string {
    const { msg } = this;
    let { name, message }: Details = this.getDetails();

    message = prepareQuote(message);

    // adds quoting brackets
    message = message.replace(/\n/g, '\n>> ');

    return `>> <${name}> ${message}\n${msg.text || ''}`;
  }
}

class BotMessage extends ReplyToMessage {
  static test(msg: Telegram$Message): boolean {
    const replyToMessage: ?Telegram$Message = msg.reply_to_message;

    if (!replyToMessage) {
      return false;
    }

    const isReplyWithText: boolean = Boolean(replyToMessage.text);

    const isReplyFromOurBot: boolean = BOT_TOKEN.indexOf(
      replyToMessage.from.id.toString()
    ) > -1;

    return isReplyWithText && isReplyFromOurBot;
  }

  getDetails(): Details {
    const { msg } = this;

    const replyToMessage: ?Telegram$Message = msg.reply_to_message;
    const text: string = (replyToMessage && replyToMessage.text) || '';
    const lineEndPos: number = text.indexOf('\n');
    const name: string = text.slice(0, lineEndPos);
    const message: string = text.slice(lineEndPos + 1);

    return { name, message };
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
  let text: string = message.toString();

  const forwardFrom = msg.forward_from || msg.forward_from_chat;

  if (forwardFrom) {
    const name: string = Name.from(forwardFrom);

    // adds quoting brackets
    text = text.replace(/\n/g, '\n>> ');

    return `>> <${name}> ${text}`;
  }

  return text;
}

function prepareQuote(quote: string): string {
  if (!quoteLength) {
    return quote;
  }

  // get first three lines
  let prepared = quote.split('\n').slice(0, 3).join('\n');

  // cut out an unnecessary tail
  prepared = prepared.slice(0, quoteLength);

  const isMatched = prepared === quote;
  const ellipsisChar = '\u2026';

  return prepared + (isMatched ? '' : ellipsisChar);
}

function prepareEmittingMessageDetails(
  message: Telegram$Message
): ?MessageEvent {
  const room: Telegram$Chat = message.chat;
  const title: string = room.title || '';

  if (room.id !== chat.id) {
    return null;
  }

  const name: string = Name.from(message.from);
  const text: string = prepareMessage(message);

  return { network: botNetwork, room: title, name, message: text };
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

const updateTypes = [
  'text',
  'sticker',
  'photo',
  'document'
];

client
  .on(updateTypes, onMessage)
  .startPolling();

export default client;
