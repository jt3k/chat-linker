const Telegraf = require('telegraf');

const config = require('../../app-config').telegram;
const bus = require('../../bus');
const botNetwork = require('./network');

const chat = config[process.env.NODE_ENV];

const {BOT_TOKEN} = config;

const client = new Telegraf(BOT_TOKEN);

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
  getDetails() {
    const msg = this.msg;
    const nick = Name.from(msg.from);
    const message = msg.text;

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
  toString() {
    const msg = this.msg;
    const nick = Name.from(msg.forward_from);

    // adds quoting brackets
    const message = msg.text.replace(/\n/g, '\n>> ');

    return `>> <${nick}> ${message}`;
  }
}

class BotMessage extends ReplyToMessage {
  static isFromBot(msg) {
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
    const text = msg.text;
    const lineEndPos = text.indexOf('\n');
    const _nick = text.slice(0, lineEndPos);
    const _message = text.slice(lineEndPos + 1);
    return [_nick, _message];
  }
}

function messageFactory(msg) {
  const forwardMessage = msg.forward_from;
  if (forwardMessage) {
    return new ForwardedMessage(msg);
  }

  const replyToMessage = msg.reply_to_message;
  const isReplyWithText = replyToMessage && replyToMessage.text;
  if (!isReplyWithText) {
    return new Message(msg);
  }

  const isReplyFromOurBot = BotMessage.isFromBot(msg);
  if (isReplyFromOurBot) {
    return new BotMessage(replyToMessage);
  }

  return new ReplyToMessage(replyToMessage);
}

function prepareMessage(msg) {
  const message = messageFactory(msg);
  const stringMessage = message.toString();

  return stringMessage;
}

client.on('text', (ctx, next) => {
  const room = ctx.message.chat.title;
  if (room === chat.title) {
    const name = Name.from(ctx.message.from);
    const message = prepareMessage(ctx.message);

    bus.emit('message', {network: botNetwork, room, name, message});

    next();
  }
});

client.on('sticker', (ctx, next) => {
  const room = ctx.message.chat.title;
  if (room === chat.title) {
    //
    const sticker = ctx.message.sticker;
    const emoji = sticker.emoji;

    const name = Name.from(ctx.message.from);
    const message = emoji || prepareMessage(ctx.message);

    bus.emit('message', {network: botNetwork, room, name, message});

    next();
  }
});

client.startPolling();

module.exports = client;
