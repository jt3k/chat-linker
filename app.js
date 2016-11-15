//
//  core
//

const bus = require('./bus.js');

// global for debugging
global.jabber = require('./bots/jabber');
global.telegram = require('./bots/telegram');

bus.on('message', ({network, room, name, message})=>{
	console.log(`${network} "${room}": <${name}> ${message}`);

	if (network === 'JABBER') {
		telegram.send({name, message});
	}

	if (network === 'TELEGRAM') {
		jabber.send({name, message});
	}
});
