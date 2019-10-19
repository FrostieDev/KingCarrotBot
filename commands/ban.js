var mysql = require("../mysqlCon");

exports.run = function (bot, message, args) {
    var permission = message.member.hasPermission("ADMINISTRATOR");
    if (permission === true) {
        let banMember = message.mentions.members.first();
        let banMemberID = banMember.id;
        var guildID = message.guild.id;
        message.channel.send(`Hah! ${banMember} was banned!`);

        mysql.con.query(`SELECT * FROM bannedlist WHERE guildID = ` + guildID + ` AND discID = ${banMemberID}`, function (err, result, fields) {
            if (err) {
                throw err;
            }
            else if (result.length > 0) {
                var sql = `UPDATE bannedlist SET banned = ` + 1 + ` WHERE guildID = ` + guildID + ` AND discID = ${banMemberID}`;
                mysql.con.query(sql, function (err, result) {
                    if (err) throw err;
                });
            } else {
                var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                var pQuery = `INSERT INTO bannedlist (guildID, discID, banned, dateFrom, dateTo, amount) VALUES (?, ?, ?, ?, ?, ? )`;
                let data = [guildID,banMemberID,1,date,date,1]

                mysql.con.query(pQuery,data, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
            }
        });
    }
};