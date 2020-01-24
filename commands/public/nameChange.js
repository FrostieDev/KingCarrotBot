const GuildDB = require("../../database/guildDB");
const GuildModel = require("../../models/Guild");

exports.run = function (bot, message, args) {
    var userAPI = message.author;
    var guildAPI = message.guild;
    var guild = new GuildModel();
    var userToChangeAPI = message.mentions.members.first();
    var newNickName = message.content.slice(35,message.content.length);

    let getGuild = function(){
        return new Promise(function(resolve,reject){
            GuildDB.getGuildById(guildAPI.id, function(result){
                if (result != undefined) {
                    resolve(result);
                } else {
                    reject("No guild found in DB.");
                }
            });
        });
    }

    getGuild()
    .then(function (result){
        console.log(newNickName);
        guild = result;
    })
    .then(function (){
        //Has permission?
        if(guild.currentKing == userAPI.id && newNickName.length <= 32){
            try {
                userToChangeAPI.setNickname(newNickName,`By king's demand.`);
            } catch(err) {
                reject(err);
            }
            
        } else {
            if(newNickName.length >= 32){
                message.channel.send("Name too long - Max 32 characters.");
            } else {
                console.log(guild.currentKing + " - " + userAPI.id);
                message.channel.send("You are not a king...");
            }
        }
    })
    .catch(function(err){
        console.log(err);
    })

}