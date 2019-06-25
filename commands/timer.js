var Promise = require('promise');
var newKingModule = require("../modules/newKing");

var BannedList = require("../class/BannedList");
const GuildInfo = require("../class/GuildInfo");
const King = require("../class/King");

const config = require("../config.json");

exports.run = function (bot, message, args) {
    if (message.author.id == config.ownerID) {
        // Initial commands
        console.log(`King of the day timer just got activated. ${new Date()}`);
        message.channel.send("Timer just started.");
        // Initial commands end

        //Interval check time start.
        setInterval(function () {
            var d = new Date(); // Get the date and time of the processor.
            var getGuild = new GuildInfo(); // Guild model
            var cont1nue = false;
            let guild; // Discord API guild
            var sendToChannel;

            // Callback function(Because async) - Get guild at selected hour
            // ADD LIST OF CHANNELS WITH THE SAME TIME AND LOOP THROUGHT IT.
            getGuild.checkTime(d.getHours(), d.getMinutes(), function (result) {
                if (result != null) {
                    getGuild = result;
                    cont1nue = true;

                    // Check if guild wants a new king, if not set continue to false.
                    if (cont1nue) {
                        var wantsNewKing = getGuild.kingActive;
                        if (wantsNewKing == 1) {
                            console.log("This guild wants a new king"); //Test console.log
                            guild = message.client.guilds.get(`${getGuild.guildID}`); // Discord API call for guild with matching Guild ID
                            sendToChannel = message.client.channels.get(getGuild.channelID); // Discord API call for channel with matching Channel ID

                                newKing(guild, getGuild, sendToChannel);
                            
                        } else {
                            cont1nue = false;
                            console.log("This guild does not want a new king"); //Test console.log
                        }
                    }

                } else { // Part of checktime
                    console.log(`No guild found with set time: ${d.getHours()}:${d.getMinutes()}`); //Test console.log
                    cont1nue = false; // Only for the visuals
                }
            })
        }, 60 * 1000);
        //Interval check time end.

        let newKing = function (guild, newGuildInfo, messageChannel) {
            var newBannedList = new BannedList();
            var newGuildMember = new King(); // To put a database object into - kings to King
            var validRole; // Discord role
            var randomMember; // Take a random disc member from guild
            // var listOfBannedStatus = []; // Array of banned status for the chosen guild.

            newKingModule.callGetBannedList(guild.id)
                .then(function (result) {
                    //listOfBannedStatus = result;
                    return newKingModule.randomMemberRecursion(result, newGuildInfo, guild);
                })
                .then(function (result) {
                    randomMember = result;
                    return newKingModule.callGetKing(guild.id, result.user["id"], guild);
                })
                .then(function (result) {
                    newGuildMember = result;
                    return newKingModule.removeMemberAsKing(newGuildInfo, messageChannel, guild);
                })
                .then(function (result) {
                    validRole = result;
                    return newKingModule.updateDiscRole(randomMember, validRole);
                })
                .then(function (result) {
                    return newKingModule.callUpdateKingAmount(newGuildMember, newGuildInfo, messageChannel);
                })
                .then(function (result) {
                    return newKingModule.callUpdateKing(newGuildMember, newGuildInfo);
                })
                .catch(function (err) {
                    console.log("something went wrong: " + err);
                })



        };

    } else {
        message.channel.send("You are not the owner of this BOT.");
    }

};