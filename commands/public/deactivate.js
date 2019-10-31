var guildDB = require("../../database/guildDB");

exports.run = function (bot, message, args) {
    var permission = message.member.hasPermission("ADMINISTRATOR");
    if (permission === true) {
        var guildID = message.guild.id;

        guildDB.updateKingActive(false,guildID);

        message.channel.send("King of the day for this guild has been deactivated.");
    } else {
        message.channel.send("You do not have permission for this. (Admin right)");
    }
};