var mysql = require("../../mysqlCon");

exports.run = function (bot, message, args) {
    var guildID = message.guild.id;
    mysql.con.query(`SELECT * FROM kingsinfo WHERE guildID = ${guildID}`, function (err, result, fields) {
        if (err) {
            throw err;
        } else {
            var NOTIFY_HOUR = result[0].hour;
            var NOTIFY_MINUTE = result[0].minute;
            message.channel.send(`King of the day time is set at: ${NOTIFY_HOUR}:${NOTIFY_MINUTE}`)
        }
    });
};