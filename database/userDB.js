var mysqlStandard = require("./mysqlCon");

function insertUser(guildID,discID,name,amount){
    var pQuery = `INSERT INTO kings ( guildID,discID,name,amount,banned ) VALUES ( ?,?,?,1,0 )`;
    let data = [guildID,discID,name,amount];

    mysqlStandard.con.query(pQuery,data, function(err,result){
        if (err) {
            throw err
        } else {
            return result;
        };
    });
} 

function updateUserAmount(guildID,discID,amount){
    var pQuery = `UPDATE kings SET amount = ? WHERE guildID = ? AND discID = ?`;
    let data = [amount,guildID,discID];

    mysqlStandard.con.query(pQuery,data, function (err, result) {
        if (err) {
            throw err
        } else {
            return true;
        };
    });
}

function getUsersSortedByAmount(guildID, callback){
var pQuery = "SELECT * FROM kings WHERE guildID = ? ORDER BY amount DESC LIMIT 10"
let data = [guildID];

mysqlStandard.con.query(pQuery,data,function (err,result){
    if(err){
        throw err
    } else {
        if ( result != 0 ) {
            return callback(result);
        } else {
            return callback(null);
        }
    };
});
}

module.exports = {
insertUser,
updateUserAmount,
getUsersSortedByAmount
};