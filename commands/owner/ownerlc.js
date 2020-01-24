const config = require("../../config.json");
var {PythonShell} = require('python-shell');

exports.run = function (bot, message, args) {

    if (message.author.id == config.ownerID) {
        message.channel.send("Checking for Land Cruisers. Please wait.");
        console.log("Starting Land Cruiser check.");

        let pyshell = new PythonShell('/home/martin/GitHub/KingCarrotBot/commands/owner/Web_Scraper.py', {mode: 'text'});

        var array = [];
        pyshell.on('message', function(message){
            array.push(message); //Add single line from python console to array.
        })

        pyshell.end(function(err){
            if (err){
                throw err;
            }
            if(array.length > 0){
            array.forEach(element => {
                console.log(element);
                message.channel.send(element);
            });
            console.log("finished");
        } else {
            message.channel.send("No Land Cruisers found");
        }
        });

/*         const spawn = require("child_process");
        const pythonProcess = spawn('python',['./Web_Scraper.py']);
        
    pythonProcess.stdout.on('data', (data) => {
        var string = data.toString();
        console.log(string);
        message.channel.send(string);
        console.log("ERROR");
    }); */
    } else {
        message.channel.send("You are not the owner of this BOT.");
    }
};