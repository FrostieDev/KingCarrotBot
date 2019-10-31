const spawn = require("child_process").spawn;
const pythonProcess = spawn('python',["../../../../Code/Web Scraper/Web_Scraper.py"]);

exports.run = function (bot, message, args) {
    console.log("Python Script activated");
pythonProcess.stdout.on('data',(data) => {
console.log(data);
});
}