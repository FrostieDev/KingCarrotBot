var Promise = require('promise');
var Q = require('q');
const GuildInfo = require("../class/GuildInfo");
const King = require("../class/King");
var mysql = require("../class/Database");
var mysqlStandard = require("../mysqlCon");
var BannedList = require("../class/BannedList");

var newKingModule = require("../modules/newKing");

exports.run = function (bot, message, args) {
    var permission = message.member.hasPermission("ADMINISTRATOR"); // Check if Admin
    if (permission === true) {
    var guild = message.guild; // Get guild from Discord API
    var messageChannel = message.channel; // Get discord API text channel

    newKingModule.newKing(guild,messageChannel);

    } else {
        message.channel.send("You do not have permission for this. (Admin right)");
    }

};
