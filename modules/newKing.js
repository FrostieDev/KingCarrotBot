var Promise = require('promise');
var Q = require('q');
const GuildInfo = require("../class/GuildInfo");
const King = require("../class/King");
var mysql = require("../class/Database");
var mysqlStandard = require("../mysqlCon");
var BannedList = require("../class/BannedList");

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
            console.log("first");
            if (tempGuildInfo != undefined) {
                resolve(tempGuildInfo);
            } else {
                reject("Does not compute");
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
            if (tempListOfBannedStatus != undefined) {
                console.log("second");
                resolve(tempListOfBannedStatus);
            } else {
                reject("Does not compute");
            }
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
*/
let randomMemberRecursion = function (array, guildInfo, guild) {
    console.log("third");
    var last_element = array[array.length - 1];
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
                            resolve(result);
                        });
                } else if (element == last_element) { // If everyone is banned.
                    reject("Everyone is banned RIP.");
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
            console.log("Fourth");
            resolve(guildMember);
        });
    });
};

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
        let membersInRole = tempValidRole.members;

        // Remove previous king --------------------------------------------------------
        let memberList = membersInRole.last();
        if (memberList !== undefined) {
            let userRemoveID = memberList["id"];
            let userToRemove = guild.members.get(userRemoveID);

            if (userToRemove !== undefined) {
                userToRemove.removeRole(tempValidRole);
                channelToSend.send(`${userToRemove} has been dethroned and is now a pleb!`);
            }
            resolve(tempValidRole);
        } else {
            channelToSend.send(`There is no current king.`);
            resolve(tempValidRole);
        }
    });
};

/**
* Update the discord member with king role in the client.
* @param {memberDiscAPI}    discordRandomMember    A member from Discord API.
*/
let updateDiscRole = function (discordRandomMember, validRole) {
    return new Promise(function (resolve, reject) {
        console.log(`King of the day command just fired. ${new Date()}`);
        resolve(discordRandomMember.addRole(validRole));
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
* @param {King}    guildMember Am object of King.
* @param {GuildInfo}   guildInfo    An object of GuildInfo.
*/
let callUpdateKing = function (guildMember, guildInfo) {
    newGuildInfo.updateKing(guildMember.discID, guildInfo.guildID);
}

module.exports = {
    callGetGuild,
    callGetBannedList,
    randomMemberRecursion,
    callGetKing,
    removeMemberAsKing,
    updateDiscRole,
    callUpdateKingAmount,
    callUpdateKing
}

