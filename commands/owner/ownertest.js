const Discord = require('discord.js');
const config = require("../../config.json");
const userDB = require("../../database/userDB");

exports.run = function (bot, message, args) {
    var guildID = message.guild.id;
    var titleArray = ["THE ALMIGHTY KING", "Not close enough!", "King's jester", 
"Lower class citizen", "Inferior human being", "Filthy commoner", "Such a commoner",
"Such a common pleb", "Such a common pleb", "Bottom bitch"];

    const topTenEmbed = new Discord.RichEmbed()
    .setColor("#00289e")
    .setTitle("Top 10 kings in this guild")
    .setAuthor(message.client.user.username)
    .setThumbnail(message.client.user.avatarURL)
    .setTimestamp(new Date().toISOString)
    .setFooter(config.footer);

    userDB.getUsersSortedByAmount(guildID, function(result){
        for (var i = 0; i < result.length ; i++) {
            topTenEmbed.addField(`${(i+1).toString()}: ${titleArray[i]}`, `<@${result[i].discID}> with ${result[i].amount} time(s) as a king.`);
        }
        message.channel.send(topTenEmbed);
    });
};
