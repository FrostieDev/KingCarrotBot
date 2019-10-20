var Promise = require('promise');
const GuildInfo = require("../../class/GuildInfo");
const config = require("../../config.json");
// Updates the currentKing in database with the id of the author of the command, in the guild which it was written.

exports.run = function (bot, message, args) {
    if (message.author.id == config.ownerID) {
    var guildID = message.guild.id;
    var discID = "109755551692410880";

    var newGuildInfo = new GuildInfo();


    let callUpdateKingDatabase = function() {
        return new Promise(function(resolve, reject){
            newGuildInfo.updateKingDatabase(guildID,discID, function (result){
            resolve(result);
            });
        });
    };
    
    let sendMessage = function(result) {
        return new Promise(function(resolve, reject){
            resolve(message.channel.send(result))
        });
    };

    callUpdateKingDatabase().then(function(result){
        console.log(result);
        sendMessage(result);
    });
    } else {
        message.channel.send("You are not the owner of this BOT.");
    }
};