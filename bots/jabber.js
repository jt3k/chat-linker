//
//  jabber
//
const bus = require('../bus.js');
const xmpp = require('node-xmpp');
var jid = require('@xmpp/jid')

const config = require('../app-config').jabber;

const chat = config[process.env.NODE_ENV];

const client = new xmpp.Client(config.connection);
// держим соединение
client.connection.socket.setTimeout(0);
client.connection.socket.setKeepAlive(true, 10000);

client.on('error', function () {
  console.log('arguments', arguments);
});
client.on('online', () => {
  console.log('online');
  client.send(new xmpp.Element('presence', {
    to: chat.room + '/' + chat.nick
  })
    .c('x', {
      xmlns: 'http://jabber.org/protocol/muc'
    }));
});

global.sss = [];
global.eee = [];
client.on('stanza', stanza => {
  try {
    let message = stanza.is('message') && stanza.getChildElements().find(item => item.is('body'));

    const isGroupchat = stanza.type === 'groupchat';
    const isNotSelfMsg = stanza.attr('from') !== chat.room + '/' + chat.nick;
    const isNotDelay = !stanza.children.find(item => item.name === 'delay');

    if (isNotDelay && message && isGroupchat && isNotSelfMsg) {
      message = message.getText();
      const from = new jid(stanza.attr('from'));
      const room = from.full;
      const name = from.resource;
      const network = 'JABBER';

      bus.emit('message', {network, room, name, message});
    }
  } catch (err) {
    global.sss.push(stanza);
    global.eee.push(err);
    console.error(err);
  }
});

function send({name, message}) {
  return client.send(
    new xmpp.Element(
      'message',
      {
        to: chat.room,
        type: 'groupchat'
      }
    )
    .c('body')
    .t(`<@${name}> ${message}`)
  );
}

module.exports = {client, send};
