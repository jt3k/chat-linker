// @flow

import xmpp from 'node-xmpp';
import appConfig from '../../../app-config';
import bus from '../../bus';
import botNetwork from './network';

import type { Config } from './Config';
import type { XmppClient } from './types';

const config: Config = appConfig.jabber;

const { JID } = xmpp;
const chat = config[process.env.NODE_ENV === 'prod' ? 'prod' : 'dev'];

const { connection } = config;

const client: XmppClient = new xmpp.Client(connection);

// Keep alive
const { socket } = client.connection;
socket.setTimeout(0);
socket.setKeepAlive(true, 10000);

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

      bus.emit('message', { network, room, name, message });
    }
  } catch (err) {
    global.sss.push(stanza);
    global.eee.push(err);
    console.error(err);
  }
});

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
    }).c('ping', { xmlns: 'urn:xmpp:ping' });
    client.send(iq);

    setTimeout(schedulePing, chat.pingMs);
  };
  schedulePing();
}

client.sendMessage = function (textMessage) {
  return client.send(
    new xmpp.Element(
      'message',
      {
        to: chat.room,
        type: 'groupchat'
      }
    )
    .c('body')
    .t(textMessage));
};

export default client;
