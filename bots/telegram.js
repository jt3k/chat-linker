//
//  telegram
//
const botNetwork = Symbol.for('TELEGRAM');
const Telegraf = require('telegraf');

const config = require('../app-config').telegram;
const bus = require('../bus');

const chat = config[process.env.NODE_ENV];

const {BOT_TOKEN} = config;

const client = new Telegraf(BOT_TOKEN);
const internal = {};

internal.prepareName = function (from) {
  if (from.username) {
    return from.username;
  }

  if (from.last_name) {
    return `${from.first_name} ${from.last_name}`;
  }

  return from.first_name;
};

internal.isMessageFromBot = function (message) {
  const replyToMessage = message.reply_to_message;

  const isReplyWithText = replyToMessage && replyToMessage.text;
  if (!isReplyWithText) {
    return false;
  }

  const isReplyFromOurBot = BOT_TOKEN.indexOf(replyToMessage.from.id) > -1;

  return isReplyFromOurBot;
};

internal.getMessageDetails = function (replyToMessage) {
  const text = replyToMessage.text;
  const lineEndPos = text.indexOf('\n');
  const _nick = text.slice(0, lineEndPos);
  const _message = text.slice(lineEndPos + 1);
  return [_nick, _message];
};

internal.getNoBotsReplyMessageDetails = function (replyToMessage) {
  const nick = internal.prepareName(replyToMessage.from);
  const message = replyToMessage.text;

  return [nick, message];
};

internal.prepareMessage = function (msg, emoji) {
  let nick = '';
  let message = '';

  const replyToMessage = msg.reply_to_message;
  const isReplyFromOurBot = internal.isMessageFromBot(msg);

  const isReplyWithText = replyToMessage && replyToMessage.text;
  if (isReplyWithText) {
    [nick, message] = isReplyFromOurBot ?
    internal.getMessageDetails(replyToMessage) :
    internal.getNoBotsReplyMessageDetails(replyToMessage);

    // adds quoting brackets
    message = message.replace(/\n/g, '\n>> ');

    return `>> <${nick}> ${message}\n${message.text}`;
  }

  //
  // is no-reply //
  //

  if (msg.forward_from) {
    nick = internal.prepareName(msg.forward_from);

    // adds quoting brackets
    message = msg.text.replace(/\n/g, '\n>> ');

    return `>> <${nick}> ${message}`;
  }

  return emoji || msg.text;
};

// html-escaping only for telegram
internal.htmlEscape = str => (
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
);

client.on('text', (ctx, next) => {
  const room = ctx.message.chat.title;
  if (room === chat.title) {
    const name = internal.prepareName(ctx.message.from);
    const message = internal.prepareMessage(ctx.message);

    const network = botNetwork;

    bus.emit('message', {network, room, name, message});

    next();
  }
});

client.on('sticker', (ctx, next) => {
  const room = ctx.message.chat.title;
  if (room === chat.title) {
    //
    const sticker = ctx.message.sticker;
    const emoji = sticker.emoji;

    const name = internal.prepareName(ctx.message.from);
    const message = internal.prepareMessage(ctx.message, emoji);

    const network = botNetwork;

    bus.emit('message', {network, room, name, message});

    next();
  }
});

client.startPolling();

function send({name, message}) {
  message = internal.htmlEscape(message);
  name = internal.htmlEscape(name);

  const textMessage = (config.messageTemplate || '<b>{name}</b>\n{message}')
    .replace('{name}', name)
    .replace('{message}', message);

  client.telegram.sendMessage(
		chat.id,
		textMessage,
		{parse_mode: 'HTML'}
	);
}

module.exports = {client, send, network: botNetwork};
