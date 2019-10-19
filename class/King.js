var mysql = require("../class/Database");
const GuildInfo = require("../class/GuildInfo");
var mysqlStandard = require("../database/mysqlCon");

/* There is a difference between kingObj, and a user mapping from the discord api */

class King {


    constructor(guildID, discID, discName, amount, banned){
        this.guildID = guildID; // ID of guild which the user is located in
        this.discID = discID; // Personal ID of the user
        this.discName = discName; // Name of the user
        this.amount = amount; // How many times the user had been a king
        this.banned = banned; // Boolean for checking if the user is banned from being a king - Using tinyint, 1 for banned, 0 for unbanned.
    }
    /* Getters */
    getDiscName(){
        return this.discName;
    }

    /* Setters */

    // Get all info about user on database and set a temporary object. Returns a King object. Requires a guildID and discID.
    getKing(guildID, discID,callback){ 
        var kingObj;
        var newQuery = new mysql();
        var pQuery = `SELECT * FROM kings WHERE guildID = ? AND discID = ?`;
        let data = [guildID, discID];

        newQuery.query(pQuery,data)
        .then(rows => {
            kingObj = rows[0];
            console.log(kingObj);
            if(kingObj != undefined){
                return callback(kingObj);
            } else {
                return callback(false);
            }
        }).catch((err) => {
            // Handle any error that occurred
        });
    }

   /* updateAmountKing(guildID, discID, amount){
        var newQuery = new mysql();
        var newAmount = currentAmount++; 
        var pQuery = `UPDATE kings SET amount = ? WHERE guildID = ? AND discID = ?`;
        let data = [amount,guildID,discID];

        newQuery.query(pQuery,data)
        .then(
            confirmation => {
                return callback(confirmation.affectedRows + " record(s) updated");
            }
        )
        .catch((err) => {
            // Handle any error that occured
        });
    } */

    updateAmountKing(guildID,discID,amount){
        var pQuery = `UPDATE kings SET amount = ? WHERE guildID = ? AND discID = ?`;
        let data = [amount,guildID,discID];

        mysqlStandard.con.query(pQuery,data, function (err, result) {
            if (err) throw err;
        });
        return true;
    }

    memberToKingObj(memberObj){
        var kingObj = new King();
        kingObj = memberObj;
        return kingObj;
    }

    //Check if user is banned. Using kingObj
    isBanned(kingObj){
        if(kingObj.banned != 1){
            return false;
        } else {
            return true;
        }
    }


};

module.exports = King;


// New member method <-- Input alle data