var mysql = require("../../mysqlCon");

exports.run = function (bot, message, args) {
    var permission = message.member.hasPermission("ADMINISTRATOR");
    if (permission === true) {
        let banMember = message.mentions.members.first();
        let banMemberID = banMember.id;
        var guildID = message.guild.id;
        mysql.con.query(`SELECT * FROM bannedlist WHERE guildID = ` + guildID + ` AND discID = ${banMemberID}`, function (err, result, fields) {
            if (err) {
                throw err;
            }
            else if (result.length > 0) {
                if(result.banned !== 0){
                message.channel.send(`(${banMember}) was unbanned...`);
                var sql = `UPDATE bannedlist SET banned = ` + 0 + ` WHERE guildID = ` + guildID + ` AND discID = ${banMemberID}`;
                mysql.con.query(sql, function (err, result) {
                    if (err) throw err;
                });
            }
            } else {
                message.channel.send(`It seems like there is no banned member on record for this user.`);
            }
        });
    }
};