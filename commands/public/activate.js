var mysql = require("../../mysqlCon");

exports.run = function (bot, message, args) {
    var permission = message.member.hasPermission("ADMINISTRATOR");
    if (permission === true) {
        var guildID = message.guild.id;

        var sql = "UPDATE kingsinfo SET kingActive = " + 1 + " WHERE guildID = " + guildID;
        mysql.con.query(sql, function (err, result) {
            if (err) throw err;
        });

        message.channel.send("King of the day for this guild has been activated.");
    } else {
        message.channel.send("You do not have permission for this. (Admin right)");
    }
};