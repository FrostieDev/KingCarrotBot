const reqEvent = (event) => require(`../events/${event}`)

module.exports = (bot,cooldowns) => {
	console.log(cooldowns);
	bot.on('ready', () => reqEvent('ready')(bot));
	bot.on('reconnecting', () => reqEvent('reconnecting')(bot));
	bot.on('disconnect', () => reqEvent('disconnect')(bot));
	bot.on('message', (message) => reqEvent('message')(message,cooldowns));
	bot.on('guildMemberUpdate', (oldMember,newMember) => reqEvent('guildMemberUpdate')(oldMember,newMember));
};