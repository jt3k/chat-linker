// @flow

import type { Config } from './Config';

import Telegraf from 'telegraf';

import appConfig from '../../../app-config';
import bus from '../../bus';
import botNetwork from './network';

const config: Config = appConfig.telegram;

const chat = config[process.env.NODE_ENV === 'prod' ? 'prod' : 'dev'];

const { BOT_TOKEN } = config;

const client: Telegraf = new Telegraf(BOT_TOKEN);

class Name {
  static from(msg) {
    if (msg.username) {
      return msg.username;
    }

    if (msg.last_name) {
      return `${msg.first_name} ${msg.last_name}`;
    }

    return msg.first_name;
  }
}

class Message {
  constructor(msg) {
    this.msg = msg;
  }

  toString() {
    return this.msg.text;
  }
}

class ReplyToMessage extends Message {
  static test(msg) {
    const replyToMessage = msg.reply_to_message;
    const isReplyWithText = replyToMessage && replyToMessage.text;
    return isReplyWithText;
  }

  getDetails() {
    const msg = this.msg;
    const replyToMessage = msg.reply_to_message;
    const nick = Name.from(replyToMessage.from);
    const message = replyToMessage.text;

    return [nick, message];
  }

  toString() {
    const msg = this.msg;
    let [nick, message] = this.getDetails();

    // adds quoting brackets
    message = message.replace(/\n/g, '\n>> ');

    return `>> <${nick}> ${message}\n${msg.text}`;
  }
}

class ForwardedMessage extends Message {
  static test(msg) {
    return msg.forward_from;
  }

  toString() {
    const msg = this.msg;
    const nick = Name.from(msg.forward_from);

    // adds quoting brackets
    const message = msg.text.replace(/\n/g, '\n>> ');

    return `>> <${nick}> ${message}`;
  }
}

class BotMessage extends ReplyToMessage {
  static test(msg) {
    const replyToMessage = msg.reply_to_message;

    const isReplyWithText = replyToMessage && replyToMessage.text;
    if (!isReplyWithText) {
      return false;
    }

    const isReplyFromOurBot = BOT_TOKEN.indexOf(replyToMessage.from.id) > -1;

    return isReplyFromOurBot;
  }

  getDetails() {
    const msg = this.msg;
    const replyToMessage = msg.reply_to_message;
    const text = replyToMessage.text;
    const lineEndPos = text.indexOf('\n');
    const _nick = text.slice(0, lineEndPos);
    const _message = text.slice(lineEndPos + 1);
    return [_nick, _message];
  }
}

function messageFactory(msg) {
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

function prepareEmittingMessageDetails(message) {
  const room = message.chat.title;
  if (room !== chat.title) {
    return null;
  }

  const name = Name.from(message.from);
  const msg = prepareMessage(message);

  return {network: botNetwork, room, name, message: msg};
}

client.on('text', (ctx, next) => {
  const msg = prepareEmittingMessageDetails(ctx.message);
  if (msg) {
    bus.emit('message', msg);
    next();
  }
});

client.on('sticker', (ctx, next) => {
  const msg = prepareEmittingMessageDetails(ctx.message);
  if (msg) {
    const sticker = ctx.message.sticker;
    const emoji = sticker.emoji;
    msg.message = emoji || msg.message;
    bus.emit('message', msg);
    next();
  }
});

client.startPolling();

export default client;
