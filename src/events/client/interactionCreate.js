const {log} = require('../../util/logger')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const {commands} = client;
            const {commandName} = interaction;
            const command = commands.get(commandName)
            if (!command) return;
            if (interaction == 'quote-daily') {
                nextDaily = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
                cooldown = new Date(nextDaily - Date.now())
            }
            try {
                await command.execute(interaction, client);
                
                log(`(${interaction.user.tag}) ran command ${interaction}`)
                // console.log(typeof users)
            } catch (error) {
                console.error(error)
                await interaction.reply({
                    content:`Something went wrong while executing this command`,
                    ephermal: true
                })
            }
        }
    }
}