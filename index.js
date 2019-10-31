const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");

const cooldowns = new Discord.Collection();

// For events
require('./util/eventLoader')(bot,cooldowns);

// Error catch
bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));

// Access commands folder by message commands. 
// var reload = (message, cmd) => {
// 	delete require.cache[require.resolve('./commands/' + cmd)];
// 	try {
// 		let cmdFile = require('./commands/' + cmd);
// 	} catch (err) {
// 		message.channel.send(`Problem loading ${cmd}: ${err}`).then(
// 			response => response.delete(1000).catch(error => console.log(error.stack))
// 		).catch(error => console.log(error.stack));
// 	}
// 	message.channel.send(`${cmd} reload was a success!`).then(
// 		response => response.delete(1000).catch(error => console.log(error.stack))
// 	).catch(error => console.log(error.stack));
// };
// exports.reload = reload;



bot.login(config.token);