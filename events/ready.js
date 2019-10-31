var Promise = require('promise');
var newKingModule = require("../modules/newKing");

const GuildInfo = require("../class/GuildInfo");
const GuildDB = require('../database/guildDB');


module.exports = bot => {
    bot.user.setActivity(`?help`);
    console.log(`KingCarrotBot is ready to serve on ${bot.guilds.size} servers, for ${bot.users.size} users, at ${new Date()}`);

            // Initial commands
            console.log(`King of the day timer just got activated. ${new Date()}`);
            // Initial commands end
    
            //Interval check time start.
            setInterval(function () {
                var d = new Date(); // Get the date and time of the processor.
                var guild = new GuildInfo(); // Guild model
                var cont1nue = false;
                let guildAPI; // Discord API guild
                var sendToChannel;
                
                // Callback function(Because async) - Get guild at selected hour
                // TODO: ADD LIST OF CHANNELS WITH THE SAME TIME AND LOOP THROUGHT IT.
                 GuildDB.getGuildByHourAndMinute(d.getHours(), d.getMinutes(), function (result) {
                    if (result != null) {
                        for(let i = 0; i < result.length; i++){
                        guild = result[i];
                        cont1nue = true;
                        console.log(guild.kingActive);
                        // Check if guild wants a new king, if not set continue to false.
                        if (cont1nue) {
                            var wantsNewKing = guild.kingActive;
                            if (wantsNewKing == 1) {
                                console.log("This guild wants a new king"); //Test console.log
                                guildAPI = bot.guilds.get(`${guild.guildID}`); // Discord API call for guild with matching Guild ID
                                sendToChannel = bot.channels.get(guild.channelID); // Discord API call for channel with matching Channel ID
                                
                                newKingModule.newKing(guildAPI,sendToChannel);
                                
                            } else {
                                cont1nue = false;
                                console.log("This guild does not want a new king"); //Test console.log
                            }
                        }
    
                    } 
                }
                else { // Part of checktime
                    console.log(`No guild found with set time: ${d.getHours()}:${d.getMinutes()}`); //Test console.log
                    cont1nue = false; // Only for the visuals
                }
                }) 
            }, 60 * 1000);
            //Interval check time end.
    
}
