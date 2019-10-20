const config = require('../config.json');
module.exports = message => {
	if (!message.content.startsWith(config.prefix)) return;
	if (message.author.bot) return;
	console.log('Entry with prefix detected');

	const client = message.client;
	const args = message.content.split(' ');
	const command = args.shift().slice(config.prefix.length);

	if(!command.startsWith("owner")){
	try {
		let cmdFile = require(`../commands/public/${command}`);
		cmdFile.run(client, message, args);
	} catch (err) {
		console.log(`Command ${command} failed\n${err.stack}`);
	}
	} else {
		try {
			let cmdFile = require(`../commands/owner/${command}`);
			cmdFile.run(client, message, args);
		} catch (err) {
			console.log(`Command ${command} failed\n${err.stack}`);
		}
	}
};