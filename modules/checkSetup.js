const GuildInfo = require("../class/GuildInfo");
const newKing = require("./newKing");

var newGuildInfo = new GuildInfo(); // To put a database object into - kingsinfo to GuildInfo

let checkForSetup = function (guildID, channelToSend) {
    return new Promise(function (resolve, reject) {
        newKing.callGetGuild(guildID)
            .then(function (result) {
                if(result == "No guild found"){
                    resolve(false);
                } else {
                    reject(true);
                }
            })
    });
}

module.exports = {
    checkForSetup
}