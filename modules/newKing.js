var Promise = require('promise');
var Q = require('q');
const GuildInfo = require("../class/GuildInfo");
const King = require("../class/King");
var mysql = require("../class/Database");
var mysqlStandard = require("../mysqlCon");
var BannedList = require("../class/BannedList");

var userDB = require("../database/userDB");

var newBannedList = new BannedList();
var newGuildInfo = new GuildInfo(); // To put a database object into - kingsinfo to GuildInfo
var newGuildMember = new King(); // To put a database object into - kings to King

/**
* Get list of the banned status of people.
* @param {guildID}   guildID    ID of a guild.
* @returns {GuildInfo}   Returns an Object of GuildInfo.
*/
let callGetGuild = function (guildID) {
    return new Promise(function (resolve, reject) {
        newGuildInfo.getGuild(guildID, function (result) {
            var tempGuildInfo = result;
            if (tempGuildInfo != undefined) {
                resolve(tempGuildInfo);
            } else {
                reject("No guild found in DB.");
            }
        });
    });
};

/**
* Get list of the banned status of people.
* @param {guildID}   guildID    ID of a guild.
* @returns {array}   Returns an array of member banned status. [BannedList]
*/
let callGetBannedList = function (guildID) {
    return new Promise(function (resolve, reject) {
        newBannedList.getBannedList(guildID, function (result) {
            var tempListOfBannedStatus = result;
                resolve(tempListOfBannedStatus);
        });
    });
};

/**
* Gets a random member from a guild. 
* Can't return a bot or current king.
* @param {GuildInfo}   guildInfo    An object of GuildInfo.
* @param {guild}   guild    A guild Discord API object.
* @returns {RandomMemberDiscAPI} A member Discord API object.
*/
let randomMemberFunc = function (guildInfo, guild) {
    var tempRandomMember = guild.members.random(); // Uses the discord.js library
    var isBot = tempRandomMember.user['bot'];
    while (isBot || tempRandomMember.user['id'] === guildInfo.currentKing) { // If only one is not banned. Infinite loop. How to handle?
        tempRandomMember = guild.members.random();
        isBot = tempRandomMember.user['bot'];
    }
    return tempRandomMember;
}

/**
* Recursive loop of getting a random member, and checking if banned.
* @param {Array}   array        Array of BannedList objects.
* @param {GuildInfo}   guildInfo    An object of GuildInfo.
* @param {guild}   guild    A guild Discord API object.
* @returns {RandomMemberDiscAPI} A member Discord API object.
* TODO: Fix infinite loop if all members are banned or if only one member is not banned and he was previous king.
*/
let randomMemberRecursion = function (array, guildInfo, guild) {
    var member = randomMemberFunc(guildInfo, guild);
    var found = false;

    return new Promise(function (resolve, reject) {
        array.forEach(element => {
            if (element.discID == member.user["id"]) { // Check if bannedlist discID is matching user id.
                found = true;
                console.log("This member is in the banned database: " + member.user["username"] + ": " + element.discID);
                console.log("His banned status is: " + element.banned);
                if (element.banned !== 1) { // Success, can be king.
                    console.log("This member is the chosen one.");
                    resolve(member);
                } else if (element.banned == 1) { // Skip user, and try the next.
                    console.log("This user is banned.");
                    return randomMemberRecursion(array, guildInfo, guild)
                        .then(function (result) {
                            console.log(result);
                            resolve(result);
                        });
                } 
            }
        });
        if (!found) { // If user is not in database.
            console.log("Will proceed with: " + member.user["username"]);
            resolve(member);
        }
    });
}

/**
* Get a guild object from database. Put it onto guildMember.
* @param {guildID}   guildID    ID of a guild.
* @returns {King}   Returns an Object of King.
*/
let callGetKing = function (guildID, discID) {
    return new Promise(function (resolve, reject) {
        newGuildMember.getKing(guildID, discID, function (result) {
            var guildMember = result;
            if (guildMember != false) {
                resolve(guildMember);
            } else {
                resolve(false);
            }
        });
    });
};

/** 
* To avoid chinese characters etc + general security.
* @param {userName} userName string value
* @returns {boolean} True if valid.
*/
function regExUserNameChecker(userName,callback){
    var regExpPattern = /^[a-zA-Z][a-zA-Z0-9-_]{3,32}/;
    if(userName.match(regExpPattern)){
        return callback(true);
    } else {
        return callback(false);
    }
}

/**
 * Inserting new user into database.
 * @param {guildID} guildID
 * @param {randomMember} discordMemberAPI
 * @param {channelToSend} discordChannelAPI
 * @return {guildMember} KingObject
*/
let newUser = function (guildID, randomMember ,channelToSend){
    console.log("newUser function" + randomMember.user["username"]);
    channelToSend.send("First time king. Congratz.");

    //To object
    var guildMember = new King;
    guildMember.guildID = guildID;
    guildMember.discID = randomMember.user["id"];
    guildMember.discName = randomMember.user["username"];
    guildMember.amount = 0;
    guildMember.banned = 0;

    regExUserNameChecker(guildMember.discName,function(result){
        if (result == true){
        //Insert into database
        try{
            userDB.insertUser(guildID,guildMember.discID,guildMember.discName,guildMember.amount);
        } catch(err) {
            console.log(err);
        }
        } else {
        //Insert into database - NON IMPORTANT DATA.
        try{
            userDB.insertUser(guildID,guildMember.discID,"Illegal characters",guildMember.amount);
        } catch(err) {
            console.log(err);
        }
        }

    })
    return guildMember;
    }


/**
* 
* REVISE use guildInfo.roleID instead of membersinrole.last.
* @param {GuildInfo}   guildInfo    An object of GuildInfo.
* @param {channelDiscAPI}   channelToSend    A textchannel from the discord API.
* @param {guild}   guild    A guild Discord API object.
* @returns {roleDiscAPI} A role from the Discord API.
*/
let removeMemberAsKing = function (guildInfo, channelToSend, guild) {
    return new Promise(function (resolve, reject) {
        var tempValidRole = guild.roles.get(guildInfo.roleID); // Disc API get role object API
        let lastKing = guild.members.get(guildInfo.currentKing); // Disc API member for last king.
        // Remove previous king
        if (lastKing != null) {
            lastKing.removeRole(tempValidRole);
            channelToSend.send(`${lastKing} has been dethroned and is now a pleb!`);
        } else {
            channelToSend.send(`There is no current king.`);
        }
        resolve(tempValidRole);
    });
};

/**
* Update the discord member with king role in the client.
* @param {memberDiscAPI}    memberDiscAPI    A member from Discord API.
*/
let updateDiscRole = function (memberDiscAPI, validRole) {
    return new Promise(function (resolve, reject) {
        console.log(`King of the day command just fired. ${new Date()}`);
        resolve(memberDiscAPI.addRole(validRole));
    });
}

/**
* +1 to new amount
* @param {memberDiscAPI}    guildMember    A member object.
* @returns {integer} Guildmember.amount +1 
*/
let calcKingAmount = function (guildMember) {
    return new Promise(function (resolve, reject) {
        resolve(guildMember.amount + 1); // New amount for count of times a user has been a king
    });
}

/**
 * Updates the database with new amount, and sends a message to chosen channel.
* @param {King}    guildMember Am object of King.
* @param {GuildInfo}   guildInfo    An object of GuildInfo.
* @param {channel} channelToSend  A discord API channel.
*/
let callUpdateKingAmount = function (guildMember, guildInfo, channelToSend) {
    return new Promise(function (resolve, reject) {

        calcKingAmount(guildMember)
            .then(function (result) {
                channelToSend.send(`The new king is <@${guildMember.discID}> and has been a king ${result} times.`);

                newGuildMember.updateAmountKing(guildInfo.guildID, guildMember.discID, result)

                return "fullfill";
            })
        resolve(true);
    });
}

/**
 * Updates the database with new king.
* @param {King}    guildMember An object of King.
* @param {GuildInfo}   guildInfo    An object of GuildInfo.
*/
let callUpdateKing = function (guildMember, guildInfo) {
    newGuildInfo.updateKing(guildMember.discID, guildInfo.guildID);
}

/** 
* Chooses a new king for the guild.
* @param {guild} guild Discord API guild
* @param {messageChannel} message.channel Discord text channel to send the updates.
*/
let newKing = function(guild, messageChannel){
    var newGuildInfo = new GuildInfo(); // To put a database object into - kingsinfo to GuildInfo
    var newGuildMember = new King(); // To put a database object into - kings to King
    var validRole; // Discord API role
    var randomMember; // Member from discord API

    callGetGuild(guild.id)
    .then(function (result) {
        newGuildInfo = result;
        return callGetBannedList(guild.id);
    })
    .then(function (result) {
        listOfBannedStatus = result;
        return randomMemberRecursion(result, newGuildInfo, guild);
    })
    .then(function (result) {
        randomMember = result;
        return callGetKing(guild.id, result.user["id"], guild);
    })
    .then(function (result) {
        if(result == false){
            var user = newUser(guild.id,randomMember,messageChannel);
            return user;
        } else {
            return result;
        }
    })
    .then(function (result) {
        newGuildMember = result;
        return removeMemberAsKing(newGuildInfo,messageChannel,guild);
    })
    .then(function (result) {
        validRole = result;
        return updateDiscRole(randomMember,validRole);
    })
    .then(function (result) {
        return callUpdateKingAmount(newGuildMember, newGuildInfo, messageChannel);
    })
    .then(function (result) {
        return callUpdateKing(newGuildMember, newGuildInfo);
    })
    .catch(function (err) {
        console.log("Promise was rejected: " + err);
        if(err == "No guild found in DB.")
        {
            messageChannel.send("Please setup your guild.");
        } 
        else if(err == "DiscordAPIError: Missing Permissions")
        {
            messageChannel.send("Bot does not have permissions for this.");
        } 
        else
        {
            message.channel.send("Something went wrong. ERROR: 500");
        }
    })

}


module.exports = {
    newKing,
    callGetGuild,
    callGetKing,
    callUpdateKing,
    updateDiscRole,
    callGetBannedList
}

