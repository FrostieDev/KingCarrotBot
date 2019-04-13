const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.json");

// For events
require('./util/eventLoader')(bot);

// mySQL connect to database
var mysql = require('mysql');

var con = mysql.createPool({
    host: 'localhost',
    user: 'test',
    password: '?????',
    database: '?????',
    insecureAuth: true
});

// Error catch
bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));


// Access commands folder by message commands. 
var reload = (message, cmd) => {
	delete require.cache[require.resolve('./commands/' + cmd)];
	try {
		let cmdFile = require('./commands/' + cmd);
	} catch (err) {
		message.channel.send(`Problem loading ${cmd}: ${err}`).then(
			response => response.delete(1000).catch(error => console.log(error.stack))
		).catch(error => console.log(error.stack));
	}
	message.channel.send(`${cmd} reload was a success!`).then(
		response => response.delete(1000).catch(error => console.log(error.stack))
	).catch(error => console.log(error.stack));
};
exports.reload = reload;

bot.on('guildMemberUpdate', (oldMember, newMember) => {
    var guildID = oldMember.guild.id;
    con.query(`SELECT * FROM kingsinfo WHERE guildID = ${guildID}`, function (err, result, fields) {
        if (err) {
            throw err;
        } else {
            var truefalse = result[0].updateTrue;
            var channelSend = result[0].updateChannel;
            if (truefalse === 1) {
                newMember.guild.fetchAuditLogs({ limit: 1 }).then(logs => {
                    var userWhoChanged = newMember.client.users.get(`${logs.entries.first().executor.id}`);
                    if (oldMember.displayName !== newMember.displayName) {
                        if(userWhoChanged.username === newMember.user.username){
                            newMember.user.client.channels.find("id", `${channelSend}`).send(`${userWhoChanged} changed his own name from ${oldMember.displayName} to ${newMember.displayName}!.`);
                            } else {
                        var serverToSend = newMember.user.client.channels.find("id", `${channelSend}`).send(`${userWhoChanged} changed ${newMember.user.username}'s name from ${oldMember.displayName} to ${newMember.displayName}.`);
                    }
                    }
                });
            } else { return; }
        }
    });
}); 

bot.login(config.token);