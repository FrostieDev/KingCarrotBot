
exports.run = function (bot, message, args) {
    var permission = message.member.hasPermission("ADMINISTRATOR");

    var pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    var string = '20:20';

    if (permission === true) {
        var validTime = false;
        var res = string.match(pattern);


        if (res) {
            validTime = true;
        } else {
            validTime = false;
        }

        message.channel.send("Valid time? " + validTime);

    } else {
        message.channel.send("You do not have permisson for this.");
    }
};