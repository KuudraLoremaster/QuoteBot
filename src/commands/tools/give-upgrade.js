const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder, ButtonBuilder, ButtonStyle, ActionRow, ActionRowBuilder } = require('discord.js')
const { execute, name } = require('../../events/client/ready')
const { createUpgradeEmbed } = require('../../util/quoteEmbed')


const fs = require('fs');
const { addUpgrade } = require('../../util/databaseUtil');
const upgrades = require('../../json/upgrades.json')[0]
const admins = require('../../json/globals.json').admins

const count = Object.keys(upgrades).length

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('give-upgrade')
        .setDescription('free upgrades!!! (real)')
        .addIntegerOption(option => option.setName('upgrade-id').setDescription("ID of the upgrade").setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('amount').setRequired(false).setMinValue(1)),
        async execute(interaction, client){
            id = interaction.options.getInteger('upgrade-id').toString()
            amount = interaction.options.getInteger('amount')
            if(amount == null) amount = 1
            is_admin = false            

            for(let i = 0; i < admins.length; i++){
                if(admins[i] == interaction.user.id){
                    is_admin = true
                    break
                }
                
            }

            if(!is_admin){
                await interaction.reply({content:"You don't have permission to use this command.", ephemeral: true})
                return

            }

            if(id < 0 || id > count-1){
                await interaction.reply({content:`Please choose a number between 0 and ${count-1}.`, ephemeral: true})
                return
            }

            
            upgrade_embed = addUpgrade(id, interaction.user.id, amount)

            await interaction.reply({
                embeds: [upgrade_embed],
                ephemeral: true
            })

             
        }
}

