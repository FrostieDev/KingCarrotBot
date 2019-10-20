var bannedlist = require("../../class/BannedList")

exports.run = function (bot, message, args) {
    var guildID = message.guild.id;

    var tempBannedList = new bannedlist();
    var arrayOfBannedStatus = [];

    let callGetBannedList = function () {
        return new Promise(function (resolve, reject) {
            tempBannedList.getBannedList(guildID, function (results) {
                arrayOfBannedStatus = results;
                console.log(arrayOfBannedStatus);
                resolve(arrayOfBannedStatus);
            });
        });
    }

    let sendMessage = function (array) {
        return new Promise(function (resolve, reject) {
            var last_element = array[array.length - 1];
            var finalMessage = `Banned members: `;
            array.forEach(element => {
                if (element.banned == 1) {
                    finalMessage += `<@${element.discID}> `;
                }
                if (element == last_element) {
                    message.channel.send(finalMessage);
                    resolve("done");
                }
            });
            if(array.length == 0){
                message.channel.send("No banned member in this guild.")
            }
        });
    };


    callGetBannedList().then(function (result) {
        sendMessage(result);
    })

};
