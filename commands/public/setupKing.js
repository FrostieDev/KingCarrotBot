var mysql = require("../../mysqlCon");

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

                var channelID = message.channel.id;

                    try {
                    var roleID = message.mentions.roles.first().id;
                    } catch (err){
                        message.channel.send("No role was given");
                    }
                    if(roleID != undefined){
                    var sql = `INSERT INTO kingsinfo (guildID, channelID, roleID, hour, minute, updateChannel, updateTrue) VALUES ( ` + guildID + `, ` + channelID + `, ` + roleID + `, 18, 30, "null", 0)`;
                    mysql.con.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("1 record inserted");
                        message.channel.send("Guild was set.");
                    });
                } 

            }
        });
    } else {
        message.channel.send("You do not have permisson for this.");
    }
};