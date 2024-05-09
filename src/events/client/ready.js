const { Client, ActivityType, PresenceUpdateStatus } = require("discord.js")
const { log } = require("../../util/logger")
const { createDB } = require("../../util/databaseUtil")


module.exports = {
    name: 'ready',
    once: true,
    /** @param {Client} client */
    async execute(client) {
        createDB()
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