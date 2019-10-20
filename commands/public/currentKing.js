var Promise = require('promise');
const GuildInfo = require("../../class/GuildInfo");
const King = require("../../class/King");

exports.run = function (bot, message, args) {
var guildid = message.guild;
var newGuildInfo = new GuildInfo();



let callGetGuild = function() {
    return new Promise(function(resolve, reject){
        newGuildInfo.getGuild(guildid.id, function (result){
            newGuildInfo=result;
            resolve(newGuildInfo);
        });
    });
};

let sendMessage = function(guildObj) {
    return new Promise(function(resolve, reject){
        console.log(guildObj);
        resolve(message.channel.send(`<@${guildObj.currentKing}>`))
    });
};

callGetGuild().then(function(result){
    sendMessage(result);
});

};