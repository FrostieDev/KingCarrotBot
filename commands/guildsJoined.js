exports.run = function(bot, message, args) {
    const guildNames = bot.guilds.map(g => g.name).join("\n")
    message.channel.send(`The bot has joined these discord servers: ${guildNames}`);
};