const checkSetup = require("../modules/checkSetup");

exports.run = function (bot, message, args) {
    check = checkSetup.checkForSetup();

    if(check == true){
        message.channel.send("Guild is in database.")
    } else {
        message.channel.send("Guild is not in database.");
    }
    
};