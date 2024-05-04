const { Client, ActivityType, PresenceUpdateStatus } = require("discord.js")
const { log } = require("../../util/logger")

module.exports = {
    name: 'ready',
    once: true,
    /** @param {Client} client */
    async execute(client) {
        log(`Ready!!! ${client.user.tag} is logged in and online`)
        client.user.setPresence({
            activities: [{
                name: "/quote-daily",
                type: ActivityType.Playing
            }],
            status: PresenceUpdateStatus.Online
        })
    }
}