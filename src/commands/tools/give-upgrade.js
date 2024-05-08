const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder, ButtonBuilder, ButtonStyle, ActionRow, ActionRowBuilder } = require('discord.js')
const { execute, name } = require('../../events/client/ready')
const { createUpgradeEmbed } = require('../../util/quoteEmbed')


const fs = require('fs');
const { addUpgrade } = require('../../util/databaseUtil');
const upgrades = require('../../json/upgrades.json')[0]
const admins = require('../../json/globals.json').admins

const count = Object.keys(upgrades).length

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give-upgrade')
        .setDescription('free upgrades!!! (real)')
        .addIntegerOption(option => option.setName('upgrade-id').setDescription("ID of the upgrade").setRequired(true)),
        async execute(interaction, client){
            id = interaction.options.getInteger('upgrade-id').toString()
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

       
            const use_btn = new ButtonBuilder()
            .setCustomId('use')
            .setLabel('Use')
            .setStyle(ButtonStyle.Success)
            
            const row = new ActionRowBuilder()
            .addComponents(use_btn)

            const user_filter = i => i.user.id === interaction.user.id
            
            upgrade_embed = addUpgrade(id, interaction.user.id)

            response = await interaction.reply({
                embeds: [upgrade_embed],
                components: [row]
            })

            const confirm = await response.awaitMessageComponent({filter: user_filter, time: 60_000})
            if(confirm.customId = 'use'){
               
                await interaction.followUp({content: `Gained ${upgrades[id].luck_mult+1}x Luck and ${upgrades[id].money_mult+1}x Money!`, ephemeral: true})
                await interaction.deleteReply()


            }   
        }
}

