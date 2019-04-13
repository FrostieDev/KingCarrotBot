var mysql = require("../class/Database");
const GuildInfo = require("../class/GuildInfo");

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

        newQuery.query(`SELECT * FROM kings WHERE guildID = ` + guildID + ` AND discID = ${discID}`)
        .then(rows => {
            kingObj = rows[0];
            console.log(kingObj);
            if(kingObj != undefined){
                return callback(kingObj);
            } else {
                return callback("No king found");
            }
        }).catch((err) => {
            // Handle any error that occurred
        });
    }

    updateAmountKing(guildID, discID, currentAmount){
        var newQuery = new mysql();
        var newAmount = currentAmount++; 
        console.log(newAmount);

        newQuery.query("UPDATE kings SET amount = " + 15 + " WHERE guildID = " + guildID + ` AND discID = ` + findID)
        .then(
            confirmation => {
                return "Succesfull";
            }
        )
        .catch((err) => {
            // Handle any error that occured
        });
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