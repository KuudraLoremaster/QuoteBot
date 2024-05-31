const { SlashCommandBuilder, EmbedBuilder, Embed, quote, UserSelectMenuBuilder, ButtonBuilder, ButtonStyle, ActionRow, ActionRowBuilder } = require('discord.js')
const { execute, name } = require('../../events/client/ready')
const { createUpgradeEmbed } = require('../../util/quoteEmbed')


const fs = require('fs');
const { addUpgrade, getStats, getLuckMult, getStreak } = require('../../util/databaseUtil');
const upgrades = require('../../json/upgrades.json')[0]
const admins = require('../../json/globals.json').admins

const count = Object.keys(upgrades).length

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('view stats')
        .addUserOption(option => option.setName('user').setDescription('user to view stats').setRequired(false)),
        async execute(interaction, client){
            user = interaction.options.getUser('user')
            if(user == null) user = interaction.user
            stats = getStats(user.id)

            stats_embed = new EmbedBuilder()
            .setTitle(`${user.tag}'s Stats`)
            .setThumbnail(user.displayAvatarURL())
            .setColor([23,20,30])
            .addFields({name: 'Quote Dailies', value: stats.q_daily.toString()},
                        {name: 'Streak', value: stats.streak.toString()},
                        {name: 'Luck Multiplier', value: stats.luck_mult.toString()},
                        {name: 'Money Multiplier', value: stats.money_mult.toString()})

            await interaction.reply({
                embeds: [stats_embed],
            })

             
        }
}

