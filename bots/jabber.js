//
//  jabber
//

const botNetwork = Symbol.for('XMPP');

const xmpp = require('node-xmpp');

const bus = require('../bus');

const {JID} = xmpp;
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
    to: `${chat.room}/${chat.nick}`
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
    const isNotSelfMsg = stanza.attr('from') !== `${chat.room}/${chat.nick}`;
    const isNotDelay = !stanza.children.find(item => item.name === 'delay');

    if (isNotDelay && message && isGroupchat && isNotSelfMsg) {
      message = message.getText();
      const from = new JID(stanza.attr('from'));
      const room = `${from.getLocal()}@${from.getDomain()}`;
      const name = from.getResource();
      const network = botNetwork;

      bus.emit('message', {network, room, name, message});
    }
  } catch (err) {
    global.sss.push(stanza);
    global.eee.push(err);
    console.error(err);
  }
});

function send({name, message}) {
  const textMessage = (config.messageTemplate || '<@{name}> {message}')
    .replace('{name}', name)
    .replace('{message}', message);

  return client.send(
    new xmpp.Element(
      'message',
      {
        to: chat.room,
        type: 'groupchat'
      }
    )
    .c('body')
    .t(textMessage)
  );
}

if (chat.pingMs) {
  const jid = config.connection.jid.toString();
  const server = new xmpp.JID(jid).getDomain();

  let pingCounter = 0;
  const schedulePing = () => {
    const iq = new xmpp.Element('iq', {
      type: 'get',
      to: server,
      from: jid,
      id: `ping${pingCounter++}`
    }).c('ping', {xmlns: 'urn:xmpp:ping'});
    client.send(iq);

    setTimeout(schedulePing, chat.pingMs);
  };
  schedulePing();
}

module.exports = {client, send, network: botNetwork};
