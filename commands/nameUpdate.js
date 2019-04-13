var mysql = require("../mysqlCon");
// To choose which channel the daily king function will send message to.
exports.run = function (bot, message, args) {
    var permission = message.member.hasPermission("ADMINISTRATOR");
    if (permission === true) {
        var updateID = message.channel.id;
        var guildID = message.guild.id;
        var sql = `UPDATE kingsinfo SET updateChannel = ` + updateID + `, updateTrue = ` + 1 + ` WHERE guildID = ` + guildID;
        mysql.con.query(sql, function (err, result) {
            if (err) throw err;
        });
    } else {
        message.channel.send("You do not have permisson for this.");
    }
};