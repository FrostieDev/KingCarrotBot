var mysql = require("../class/Database");
const King = require("../class/King");
var mysqlStandard = require("../mysqlCon");

// Formerly known as kingsinfo
class GuildInfo {

    constructor(guildID, roleID, channelID, hour, minute, updateChannel, updateTrue, currentKing, kingActive) {
        // Guild is the individual discord server.
        this.guildID = guildID; // ID of guild
        this.roleID = roleID; // ID of selected role
        this.channelID = channelID; // ID of guild channel to send king update in
        this.hour = hour; // Hour for executing
        this.minute = minute; // Minute for executing
        this.updateChannel = updateChannel; // ID of guild channel to send name updates in
        this.updateTrue = updateTrue; // Boolean to check if guild wants name updates
        this.currentKing = currentKing; // ID of current king in the guild
        this.kingActive = kingActive; // Boolean to check if guild wants new king(Not working)
    }

    /* Getters */
    getkingActive() {
        return this.kingActive;
    }

    // Get name from mysql database.

    /* Setters */

    /**
        * Get all info about guild on sql database and set a temporary object.
        * @param {String}   guildID         Needs a guild id for parameter.
        * @param {function} callback        Is a promise.
        * @returns {GuildInfo}              Returns a guild object(GuildInfo).
    */
    getGuild(guildID, callback) {
        var guildObj;
        var newQuery = new mysql();
        var pQuery = `SELECT * FROM kingsinfo WHERE guildID = ?`;
        let data = [guildID];

        newQuery.query(pQuery,data)
            .then(rows => {
                guildObj = rows[0];
                console.log(guildObj);
                if (guildObj != undefined) {
                    return callback(guildObj);
                } else {
                    return callback("No guild found");
                }
            }).catch((err) => {
                // Handle any error that occurred
            });
    }
    /* Methods */

    /**
        * Check if any guild has the chosen time(parameters).
        * @param {int}   hour         Hour in 24 hour format.
        * @param {int}   minute       Minute in 0-60 minute format. Like 2 and 32.
        * @param {int}   callback        Is a promise.
        * @returns {GuildInfo}           Returns Guild Object if true, else return null.
    */
    checkTime(hour, minute, callback) {
        var thisGuildID;
        var newQuery = new mysql();
        var pQuery = `SELECT * FROM kingsinfo WHERE hour = ? AND minute = ?`;
        let data = [hour, minute];

        newQuery.query(pQuery,data)
            .then(rows => {
                thisGuildID = rows[0];
                console.log(thisGuildID);
                if (thisGuildID != undefined) {
                    return callback(thisGuildID);
                } else {
                    return callback(null);
                }
            }).catch((err) => {
                // Handle any error that occurred in any of the previous
                // promises in the chain.
            });
    }

    isCurrentKing(guildObj, king) {
        if (guildObj.currentKing == king.user["id"]) {
            return true;
        } else {
            return false;
        }
    }

    //Check if member from a guild is banned or was the previous king.
    validNewKing(kingObj, guildObj, guild, callback) {
        var newKingObj = new King();
        var increment = 0;
        var done = false;

        while (done) {
            var newKing = this.getRandomMember(guild);
            newKingObj = newKing;
            //kingObj = newKingObj.memberToKingObj(newKing);
            console.log(newKingObj.discName);
            console.log(increment);
            console.log(guildObj);
            increment++;

            if (increment >= 20) {
                if (newKing != undefined) {
                    return callback(newKing);
                } else {
                    return callback("Failed");
                }
                done = true;
            }
        }
    }

    /**
        * Update database with a new king.
        * @param {String}   guildId         Needs a guild id for parameter.
        * @param {String}   kingId       Is a promise.
    */
    updateKingDatabase(guildId, kingId) {
        var newQuery = new mysql();
        var pQuery = `UPDATE kingsinfo SET currentKing = ? WHERE guildID = ?`;
        let data = [kingId,guildId];

        newQuery.query(pQuery,guildId)
            .then(
                confirmation => {
                    return "Succesfull";
                }
            ).catch((err) => {
                // Handle any error that occurred in any of the previous
                // promises in the chain.
            });
    }

    updateKing(kingID,guildID){
        var pQuery = `UPDATE kingsinfo SET currentKing = ? WHERE guildID = ?`;
        let data = [kingID,guildID];

        mysqlStandard.con.query(pQuery,data, function (err, result) {
            if (err) throw err;
        });
    }

};
module.exports = GuildInfo;