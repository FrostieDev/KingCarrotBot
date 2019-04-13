var mysql = require("../class/Database");
const GuildInfo = require("../class/GuildInfo");

class BannedList {

    constructor(guildID, discID, banned, lastday) {
        this.guildID = guildID; // ID of guild which the user is located in
        this.discID = discID; // Personal ID of the user
        this.banned = banned; // banned false or true
        this.lastday = lastday; // Last day of ban
    }

    /* Getters */

    /**
    * Get all member statuses of the guild.
    * @param {String}   guildID         Needs a guild id for parameter.
    * @param {function} callback        Is a promise.
    * @returns {rows}              Returns an array of members.
*/
    getBannedList(guildID, callback) {
        var newQuery = new mysql();

        newQuery.query(`SELECT * FROM bannedlist WHERE guildID = ` + guildID)
            .then(rows => {
                if (rows != undefined) {
                    return callback(rows);
                    console.log(rows);
                } else {
                    return callback("No guild found");
                }
            }).catch((err) => {
                // Handle any error that occurred
            });
    }

    /**
        * Get all member statuses of the guild.
        * @param {String}   guildID         Needs a guild id for parameter.
        * @param {function} callback        Is a promise.
        * @returns {memberStatus}              Returns an array of objects of BannedList.
    */
    toObjects(rows) {
        var memberStatuses = [];
        rows.forEach(element => {
            newBannedList = new BannedList();
            newBannedList.guildID = element.guildID;
            newBannedList.discID = element.discID;
            newBannedList.banned = element.banned;
            newBannedList.lastday = element.lastday;
            memberStatus.push(newBannedList);
        });
        return memberStatuses;
    }

}

module.exports = BannedList;


