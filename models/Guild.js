class Guild{
    constructor(guildID, roleID, channelID, hour, minute, updateChannel, updateTrue, currentKing, kingActive) {
        // Guild is the individual discord server.
        this.guildID = guildID; // ID of guild
        this.roleID = roleID; // ID of selected role
        this.channelID = channelID; // ID of guild channel to send king update in
        this.hour = hour; // Hour for executing
        this.minute = minute; // Minute for executing
        this.updateChannel = updateChannel; // ID of guild channel to send name updates in
        this.updateTrue = updateTrue; // Boolean to check if guild wants name updates
        this.currentKing = currentKing; // ID of current king in the guild
        this.kingActive = kingActive; // Boolean to check if guild wants new king(Not working)
    }
}

module.exports = Guild;
