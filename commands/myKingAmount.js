var mysql = require("../mysqlCon");
const King = require("../class/King");
exports.run = function (bot, message, args) {
    var guildID = message.guild.id;
    var discID = message.author.id;

    var tempKing = new King();

    /*var newKing;
    tempKing.getKing(guildID,discID, function (result){
        newKing = result;
    });*/

    let callGetKing = function() {
        return new Promise(function(resolve, reject){
            tempKing.getKing(guildID,discID, function (result){
                newKing =result;
                resolve(newKing);
            });
        });
    };

    let sendMessage = function(kingObj) {
        return new Promise(function(resolve, reject){
            resolve(message.channel.send(`<@${discID}> has been a king ${newKing.amount} amount of times.`))
        });
    };

    callGetKing().then(function(result){
        sendMessage(result);
    });
    /*message.channel.send(`<@${discID}> has been king ${newKing} amount of times.`)
    console.log(newKing);*/

};