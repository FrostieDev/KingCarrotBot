const GuildInfo = require("../../class/GuildInfo");

exports.run = function (bot, message, args) {
var thisGuild = message.guild;
var newGuildInfo = new GuildInfo();
var randomMember = newGuildInfo.getRandomMember(thisGuild);
message.channel.send(`<@${randomMember['id']}>`);
};