var mysql = require("../mysqlCon");

exports.run = function (bot, message, args) {
    var permission = message.member.hasPermission("ADMINISTRATOR");
    if (permission === true) {
        // Choose a role
        var guildID = message.guild.id;
        mysql.con.query(`SELECT * FROM kingsinfo WHERE guildID = ${guildID}`, function (err, result, fields) {
            if (err) {
                throw err;
            }
            else if (result.length > 0) {

                message.channel.send("Client is already set up.");

            } else {

                var msgCont = message.content.split(' ').slice(1);

                var channelID = message.channel.id;
                if (msgCont.length > 0) {
                    var roleID = message.mentions.roles.first().id;
                    var sql = `INSERT INTO kingsinfo (guildID, channelID, roleID, hour, minute, updateChannel, updateTrue) VALUES ( ` + guildID + `, ` + channelID + `, ` + roleID + `, 18, 30, "not", 0)`;
                    mysql.con.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("1 record inserted");
                    });
                } else {
                    message.channel.send("No role was given.");
                    return;
                }
            }
        });
    } else {
        message.channel.send("You do not have permisson for this.");
    }
};