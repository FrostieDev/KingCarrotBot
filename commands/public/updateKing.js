var Promise = require('promise');
const guildDB = require("../../database/guildDB");
const newKingModule = require("../../modules/newKing");
const config = require("../../config.json");
// Updates the currentKing in database with the id of the author of the command, in the guild which it was written.

/*
TODO: Update king amount. Remove previous king.
*/
exports.run = function (bot, message, args) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
    var guild = message.guild;
    var guildMemberAPI = message.mentions.members.first();;

    let callUpdateKing = function(discID,guildID){
        return new Promise(function (resolve, reject) {
            guildDB.updateKing(discID,guildID,function (result) {
                if(result.affectedRows == 1){
                     resolve();
                 } else {
                     reject("Did not insert new king into database.");
                 }
            });
        });
    }
    
    let sendMessage = function(result) {
        return new Promise(function(resolve, reject){
            resolve(message.channel.send(`Hail <@${guildMemberAPI.id}>, he is the one with the power!`))
        });
    };

    callUpdateKing(guildMemberAPI.id,guild.id).then(function(result){
        return newKingModule.callGetGuild(guild.id);
    }).then(function(result){
        return newKingModule.updateDiscRole(guildMemberAPI,guild.roles.get(result.roleID));
    }).then(function(result){
        return sendMessage();
    })
    .catch(function(err){
        console.log("Promise was rejected: " + err);
        message.channel.send("Something went wrong. 404");
    });


    } else {
        message.channel.send("You are not the owner of this BOT.");
    }
};
