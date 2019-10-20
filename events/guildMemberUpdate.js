var mysqlStandard = require("../database/mysqlCon");

module.exports = (oldMember,newMember) => {
    var guildID = oldMember.guild.id;
    mysqlStandard.con.query(`SELECT * FROM kingsinfo WHERE guildID = ${guildID}`, function (err, result, fields) {
        if (err) {
            throw err;
        } else {
            var truefalse = result[0].updateTrue;
            var channelSend = result[0].updateChannel;
            if (truefalse === 1) {
                newMember.guild.fetchAuditLogs({ limit: 1 }).then(logs => {
                    var userWhoChanged = newMember.client.users.get(`${logs.entries.first().executor.id}`);
                    if (oldMember.displayName !== newMember.displayName) {
                        if(userWhoChanged.username === newMember.user.username){
                            newMember.user.client.channels.find("id", `${channelSend}`).send(`${userWhoChanged} changed his own name from ${oldMember.displayName} to ${newMember.displayName}!.`);
                            } else {
                        newMember.user.client.channels.find("id", `${channelSend}`).send(`${userWhoChanged} changed ${newMember.user.username}'s name from ${oldMember.displayName} to ${newMember.displayName}.`);
                    }
                    }
                });
            } else { return; }
        }
    });
}