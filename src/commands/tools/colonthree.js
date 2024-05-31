const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder, ButtonBuilder, ButtonStyle, ActionRow, ActionRowBuilder } = require('discord.js')
const { execute, name } = require('../../events/client/ready')


module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('colonthree')
        .setDescription(':3'),
        async execute(interaction, client){

            await interaction.reply({
                content: ':3',
                ephemeral: true
            })

             
        }
}

