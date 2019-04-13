var Promise = require('promise');
var Q = require('q');
const GuildInfo = require("../class/GuildInfo");
const King = require("../class/King");
var mysql = require("../class/Database");
var mysqlStandard = require("../mysqlCon");
var BannedList = require("../class/BannedList");

var newKingModule = require("../modules/newKing");

exports.run = function (bot, message, args) {
    var permission = message.member.hasPermission("ADMINISTRATOR");
    if (permission === true) {
    var guild = message.guild; // Get guild from Discord API
    var newBannedList = new BannedList();
    var listOfBannedStatus = []; // Array of banned status for the chosen guild.
    var newGuildInfo = new GuildInfo(); // To put a database object into - kingsinfo to GuildInfo
    var newGuildMember = new King(); // To put a database object into - kings to King
    var validRole; // Discord role
    var randomMember; // Take a random disc member from guild
    var messageChannel = message.channel;

    newKingModule.callGetGuild(guild.id)
        .then(function (result) {
            newGuildInfo = result;
            return newKingModule.callGetBannedList(guild.id);
        })
        .then(function (result) {
            listOfBannedStatus = result;
            return newKingModule.randomMemberRecursion(result, newGuildInfo, guild);
        })
        .then(function (result) {
            randomMember = result;
            return newKingModule.callGetKing(guild.id, result.user["id"], guild);
        })
        .then(function (result) {
            newGuildMember = result;
            return newKingModule.removeMemberAsKing(newGuildInfo,messageChannel,guild);
        })
        .then(function (result) {
            validRole = result;
            return newKingModule.updateDiscRole(randomMember,validRole);
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

    }

};
