
module.exports = bot => {
    bot.user.setActivity(`?help`);
    console.log(`KingCarrot is ready to serve on ${bot.guilds.size} servers, for ${bot.users.size} users, at ${new Date()}`);
}
