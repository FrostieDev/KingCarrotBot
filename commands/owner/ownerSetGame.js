const config = require("../../config.json");

exports.run = function (bot, message, args) {
    if (message.author.id == config.ownerID) {
    let args2 = message.content.split(' ').slice(1);
    var argresult = args2.join(' ');
    bot.user.setActivity(argresult);
    } else {
        message.channel.send("You are not the owner of this BOT.");
    }
};