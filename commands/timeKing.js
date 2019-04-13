var mysql = require("../mysqlCon");

exports.run = function (bot, message, args) {
    var permission = message.member.hasPermission("ADMINISTRATOR");
    if (permission === true) {
        // Select time 00:00
        var msgCont = message.content.split(' ').slice(1);
        if (msgCont[0] === undefined) {
            message.channel.send("Timeslot was not entered.");
        } else {
            var fullString = msgCont[0].toString();
            var stringArray = fullString.split(":");
            var hourKing = parseInt(stringArray[0]);
            var minuteKing = parseInt(stringArray[1]);

            var guildID = message.guild.id;

            if (Number.isInteger(hourKing) === false || Number.isInteger(minuteKing) === false) {
                message.channel.send("You did not enter a legit number.");
            } else {
                mysql.con.query(`SELECT * FROM kingsinfo WHERE guildID = ${guildID}`, function (err, result, fields) {
                    if (err) {
                        throw err;
                    }
                    else if (result.length > 0) {
                        var sql = `UPDATE kingsinfo SET hour = ` + hourKing + `, minute =` + minuteKing + ` WHERE guildID = ` + guildID;
                        mysql.con.query(sql, function (err, result) {
                            if (err) throw err;
                        });
                        message.channel.send("You just set a new time");
                    } else {
                        message.channel.send("No king of the day setup has been set. Use /help or /command.")
                    }

                });
            }
        }
    } else {
        message.channel.send("You do not have permisson for this.");
    }
};