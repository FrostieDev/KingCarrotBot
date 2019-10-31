const guildDB = require("../../database/guildDB");
var newKingModule = require("../../modules/newKing");


let callUpdateGuildTime = function (guildID, hourKing, minuteKing) {
    return new Promise(function (resolve, reject) {
        guildDB.updateHourAndMinute(hourKing, minuteKing, guildID);
        resolve(true);
    });
}

exports.run = function (bot, message, args) {
    var permission = message.member.hasPermission("ADMINISTRATOR");

    if (permission) {
        // Select time 00:00
        var msgCont = message.content.split(' ').slice(1);
        if (msgCont[0] === undefined) { // Check if anything was entered after command.
            message.channel.send("Timeslot was not entered.");
        } else {
            var fullString = msgCont[0].toString();

            var regExpPattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

            if (fullString.match(regExpPattern)) { // Check if request follows pattern.
                var stringArray = fullString.split(":");
                var hourKing = parseInt(stringArray[0]);
                var minuteKing = parseInt(stringArray[1]);

                var guildID = message.guild.id;

                newKingModule.callGetGuild(guildID)
                    .then(function (result) {
                        message.channel.send("Updated time for selection to " + fullString + ".");
                        callUpdateGuildTime(guildID, hourKing, minuteKing);
                    })

            } else {
                message.channel.send("Wrong input.");
            }
        }
    } else {
        message.channel.send("You do not have permisson for this.");
    }
};