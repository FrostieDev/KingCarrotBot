var mysql = require("../../mysqlCon");
const config = require("../../config.json");

exports.run = function (bot, message, args) {
    var guildID = message.guild.id;
    mysql.con.query(`SELECT * FROM kings WHERE guildID = ${guildID} ORDER BY amount DESC`, function (err, result, fields) {
        if (err) {
            throw err;
        } else {
            var sql = `SELECT COUNT(*) AS amountOF FROM kings WHERE guildID = ` + guildID;
            mysql.con.query(sql, function (err, rows, fields) {
                if (err) throw err;
                var rowsInDatabase = rows[0].amountOF;
                var nameScore = [10];
                var amountScore = [10];
                if (rowsInDatabase > 10) { // Hvis den er større end 10.
                    rowsInDatabase = 10;
                }
                for (var i = 0; i < rowsInDatabase; i++) {
                    amountScore[i] = result[i].amount;
                    nameScore[i] = result[i].name;
                }
                for (var j = rowsInDatabase; j < 10; j++) {
                    amountScore[j] = "not yet set";
                    nameScore[j] = "John Doe";
                }

                message.channel.send({
                    embed: {
                        color: 3447003,
                        author: {
                            name: message.client.user.username,
                            icon_url: message.client.user.avatarURL
                        },
                        title: "Kings",
                        description: "Top 10",
                        fields: [{
                            name: `THE BEST KING`,
                            value: `${nameScore[0]} with ${amountScore[0]} times as a king.`
                        },
                        {
                            name: `Not close enough.`,
                            value: `${nameScore[1]} with ${amountScore[1]} times as a king.`
                        },
                        {
                            name: `Filthy commoner`,
                            value: `${nameScore[2]} with ${amountScore[2]} times as a king.`
                        },
                        {
                            name: `Such a common pleb`,
                            value: `${nameScore[3]} with ${amountScore[3]} times as a king.`
                        },
                        {
                            name: `Such a common pleb`,
                            value: `${nameScore[4]} with ${amountScore[4]} times as a king.`
                        },
                        {
                            name: `Such a common pleb`,
                            value: `${nameScore[5]} with ${amountScore[5]} times as a king.`
                        },
                        {
                            name: `Such a common pleb`,
                            value: `${nameScore[6]} with ${amountScore[6]} times as a king.`
                        },
                        {
                            name: `Such a common pleb`,
                            value: `${nameScore[7]} with ${amountScore[7]} times as a king.`
                        },
                        {
                            name: `Such a common pleb`,
                            value: `${nameScore[8]} with ${amountScore[8]} times as a king.`
                        },
                        {
                            name: `Bottom bitch`,
                            value: `${nameScore[9]} with ${amountScore[9]} times as a king.`
                        }
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: message.client.user.avatarURL,
                            text: config.footer
                        }
                    }
                });

            });
        }
    });
};