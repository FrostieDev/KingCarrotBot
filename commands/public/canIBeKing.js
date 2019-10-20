const GuildInfo = require("../../class/GuildInfo");
const newKingModule = require("../../modules/newKing");

exports.run = function (bot, message, args) {
var authorDiscID = message.author.id;
var thisGuildID = message.guild.id;

let checkBanned = function(array) {
    return new Promise(function(resolve, reject){
        var found = false;
        array.forEach(element => {
            if(authorDiscID == element.discID && element.banned != 1){
                found = true;
                resolve(message.channel.send(`You can be king!`));
            } else if (authorDiscID == element.discID && element.banned == 1) {
                found = true;
                reject(message.channel.send(`You can not be a king.`));
            }
        });
        if(!found){
            resolve(message.channel.send(`You can be king!`));
        }
    });
};

//Calling functions
newKingModule.callGetBannedList(thisGuildID).then(function(result){
    checkBanned(result);
});
};