const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('message', message => {
    var guild;

    guild = message.client.guilds.get(`${getGuild.guildID}`); // Discord API call for guild with matching Guild ID
    var channelToSend = message.client.channels.get("415973684029685766").send('Hello from another guild!');
});