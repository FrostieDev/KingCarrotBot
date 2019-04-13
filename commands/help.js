const testFolder = './commands/';
const fs = require('fs');
const config = require("../config.json");


exports.run = function (bot, message, args) {
    var args3 = "";

    let getFiles = function () {
        return new Promise(function (resolve, reject) {
            fs.readdir(testFolder, (err, files) => {
                files.forEach(file => {
                    var args2 = file.split(".").slice(0, 1);
                    args3 += "?" + args2 + " ";
                });
                console.log(args3); // use those file and return it as a REST API
                resolve(args3);
            })
        });
    };

    let sendEmbed = function (result) {
        return new Promise(function (resolve, reject) {
            resolve(
                message.channel.send({
                    embed: {
                        color: 3447003,
                        author: {
                            name: message.client.user.username,
                            icon_url: message.client.user.avatarURL
                        },
                        title: "Bot creator website",
                        url: config.website,
                        description: "Commands for the bot.",
                        fields: [{
                            name: "Commands",
                            value: `${result}`
                        },
                        {
                            name: "Admin-Commands",
                            value: "?setupKing {role} / ?timeKing 20:30 / ?nameUpdate / ?newKing"
                        },
                        {
                            name: "How to",
                            value: "Use setupKing by mentioning a role after space. Use timeKing by putting in a timeslot like 9:4 or 12:38 (24hour clock). nameUpdate will use the channel you entered it in."
                        }
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: message.client.user.avatarURL,
                            text: config.footer
                        }
                    }
                })
            );
        });
    };

    //Calling functions
    getFiles().then(function (result) {
        sendEmbed(result);
    });

};