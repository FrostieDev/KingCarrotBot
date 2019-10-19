var mysqlStandard = require("./mysqlCon");

function insertUser(guildID,discID,name,amount){
    var pQuery = `INSERT INTO kings ( guildID,discID,name,amount ) VALUES ( ?,?,?,?,1 )`;
    let data = [guildID,discID,name,amount];

    mysqlStandard.con.query(pQuery,data, function(err,result){
        if (err) {
            throw err
        } else {
            return true;
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