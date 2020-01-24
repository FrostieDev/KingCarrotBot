var mysqlStandard = require("./mysqlCon");

/**
* Update database with a new king.
* @param {String}   guildID         Needs a guild id for parameter.
* @param {String}   discID          Needs a disc id for parameter.
*/
function updateKing(discID, guildID,callback) {
    var pQuery = `UPDATE kingsinfo SET currentKing = ? WHERE guildID = ?`;
    let data = [discID, guildID];

    mysqlStandard.con.query(pQuery, data, function (err, result) {
        if (err) throw err;
        return callback(result);
    });
}

/**
* Update database with hour and minute.
* @param {Int}   hour            23 hour integer.
* @param {Int}   minute          59 minute integer.
* @param {String}   guildID         Needs a guild id for parameter.
*/
function updateHourAndMinute(hour, minute, guildID) {
    var pQuery = `UPDATE kingsinfo SET hour = ?, minute = ? WHERE guildID = ?`;
    let data = [hour, minute, guildID];

    mysqlStandard.con.query(pQuery, data, function (err, result) {
        if (err) throw err;
    });
}

function updateKingActive(updateStatus,guildID){
    var pQuery = "UPDATE kingsinfo SET kingActive = ? WHERE guildID = ?";
    var update;
    if(updateStatus){
        update = 1;
    } else {
        update = 0;
    }
    let data = [update, guildID];
    mysqlStandard.con.query(pQuery,data, function (err, result) {
        if (err) throw err;
    });
}

function getGuildByHourAndMinute(hour, minute, callback){
    var pQuery = `SELECT * FROM kingsinfo WHERE hour = ? AND minute = ?`;
    let data = [hour, minute];

    mysqlStandard.con.query(pQuery,data, function(err, result){
        if(err) throw err;
        console.log(result);
        if (result.length != 0) {
            return callback(result);
        } else {
            return callback(null);
        }
    })
}

function getGuildById(guildID, callback){
    var pQuery = `SELECT * FROM kingsinfo WHERE guildID = ?`;
    let data = [guildID];

    mysqlStandard.con.query(pQuery,data, function(err,result){
        if(err) throw err;
        if (result.length != 0) {
            return callback(result[0]);
        } else {
            return callback(null);
        }
    });
}

module.exports = {
    updateHourAndMinute,
    updateKing,
    updateKingActive,
    getGuildByHourAndMinute,
    getGuildById
}