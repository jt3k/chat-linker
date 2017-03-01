//
//  telegram
//
const fs = require('fs');
const path = require('path');
const url = require('url');

const http = require('request');
const Telegraf = require('telegraf');
const uuid = require('uuid/v4');

const config = require('../app-config').telegram;
const httpd = require('../app-config').http;
const bus = require('../bus.js');

const chat = config[process.env.NODE_ENV];
const files = httpd[process.env.NODE_ENV];

const {BOT_TOKEN} = config;

const client = new Telegraf(BOT_TOKEN);
const internal = {};

internal.prepareMessage = function (ctx) {
  let nick = '';
  let message = ctx.message.text;
  let replyText = '';

  const replyToMessage = ctx.message.reply_to_message;

  if (ctx.state.fileLink) {
    message = ctx.state.fileLink;
  }

  const isReplyWithText = replyToMessage && replyToMessage.text;
  if (isReplyWithText) {
    const isReplyFromOurBot = BOT_TOKEN.indexOf(replyToMessage.from.id) > -1;

    if (isReplyFromOurBot) {
      [nick, replyText] = (function () {
        const lineEndPos = replyToMessage.text.indexOf('\n');
        const _nick = replyToMessage.text.slice(0, lineEndPos);
        const _message = replyToMessage.text
                          .slice(lineEndPos + 1);
        return [_nick, _message];
      })();
    } else {
      // if no bots reply
      nick = replyToMessage.from.username;
      replyText = replyToMessage.text;
    }

    // adds quoting brackets
    replyText = replyText.replace(/\n/g, '\n>> ');

    return `>> <${nick}> ${replyText}\n${message}`;
  }

  //
  // is no-reply //
  //
  return message;
};

// html-escaping only for telegram
internal.htmlEscape = str => (
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
);

const downloadLinkMiddleware = (ctx, next) => {
  if (ctx.updateSubType !== 'text') {
    const updateSubType = ctx.message[ctx.updateSubType];
    return client.telegram.getFileLink(updateSubType.file_id)
      .then(link => {
        const filename = uuid() + path.extname(url.parse(link).pathname);
        http(link).pipe(fs.createWriteStream(path.join(files.directory, filename)));
        ctx.state.fileLink = new url.URL(filename, files.baseUrl);
        return next();
      });
  }
  return next();
};

client.on('message', downloadLinkMiddleware, (ctx, next) => {
  const room = ctx.message.chat.title;
  if (room === chat.title) {
    const name = ctx.message.from.username;
    const message = internal.prepareMessage(ctx);

    const network = 'TELEGRAM';

    bus.emit('message', {network, room, name, message});

    next();
  }
});
client.startPolling();

function send({name, message}) {
  message = internal.htmlEscape(message);
  name = internal.htmlEscape(name);

  client.telegram.sendMessage(
		chat.id,
		`<b>${name}</b>\n${message}`,
		{parse_mode: 'HTML'}
	);
}

module.exports = {client, send};
